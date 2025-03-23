import React, { useState, useEffect, useContext } from "react";
import { collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase"; // Импортируем Firebase
import placeholderImage from "../assets/placeholder.jpg"; // Локальная заглушка для изображений
import { CartContext } from "../CartContext"; // Импортируем контекст корзины
import LoadingScreen from "./LoadingScreen"; // Компонент загрузки

function Catalog() {
  // Состояния для хранения товаров, загрузки и ошибок
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Используем контекст корзины для добавления товаров
  const { addToCart } = useContext(CartContext);

  // Загружаем данные о товарах из Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Получаем коллекцию "products" из Firestore
        const productsCollection = collection(db, "products");
        const productsSnapshot = await getDocs(productsCollection);

        // Если коллекция пуста, выводим сообщение об ошибке
        if (productsSnapshot.empty) {
          setError("No products found.");
          setLoading(false);
          return;
        }

        // Преобразуем данные о товарах
        const productsData = await Promise.all(
          productsSnapshot.docs.map(async (doc) => {
            const product = doc.data();

            // Используем ID документа, если product.id отсутствует
            const productId = product.id || doc.id;

            let imageUrl;
            try {
              // Получаем URL изображения из Firebase Storage
              const imageRef = ref(storage, `products/${productId}`);
              imageUrl = await getDownloadURL(imageRef);
            } catch (error) {
              console.error(`Image not found for product ${productId}:`, error);
              // Используем локальную заглушку, если изображение не найдено
              imageUrl = placeholderImage;
            }

            // Возвращаем объект товара с добавленными данными
            return { ...product, id: productId, imageUrl };
          })
        );

        // Обновляем состояние с данными о товарах
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };

    fetchProducts(); // Вызываем функцию загрузки данных
  }, []);

  // Если данные загружаются, показываем экран загрузки
  if (loading) {
    return <LoadingScreen />;
  }

  // Если произошла ошибка, показываем сообщение об ошибке
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Рендерим каталог товаров
  return (
    <div className="catalog">
      {/* Контейнер для карточек товаров */}
      <div className="catalog-container">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {/* Изображение товара */}
            <img
              src={product.imageUrl}
              alt={product.title}
              className="product-image"
              onError={(e) => {
                e.target.src = placeholderImage; // Заглушка, если изображение не загрузилось
              }}
            />

            {/* Название товара */}
            <h3 className="product-name">{product.title}</h3>

            {/* Цена товара */}
            <p className="product-price">{product.price} din</p>

            {/* Описание товара */}
            <p className="product-description">{product.descript}</p>

            {/* Кнопка "Добавить в корзину" */}
            <button
              className="add-to-cart"
              onClick={() => addToCart(product)} // Добавляем товар в корзину
              aria-label={`Add ${product.title} to cart`}
            >
              <p>Add to Cart</p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalog;