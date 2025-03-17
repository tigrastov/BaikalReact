import React, { useState, useEffect, useContext } from "react";
import { collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase"; // Импортируем Firebase
import placeholderImage from "../assets/placeholder.jpg"; // Локальная заглушка
import { CartContext } from "../CartContext"; // Импортируем контекст корзины
import LoadingScreen from "./LoadingScreen"; // Импортируем компонент загрузки

function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Используем контекст корзины
  const { cart, addToCart, removeFromCart } = useContext(CartContext);

  // Загружаем данные о товарах из Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products");
        const productsSnapshot = await getDocs(productsCollection);

        if (productsSnapshot.empty) {
          setError("No products found.");
          setLoading(false);
          return;
        }

        const productsData = await Promise.all(
          productsSnapshot.docs.map(async (doc) => {
            const product = doc.data();
            let imageUrl;
            try {
              // Получаем URL изображения из Firebase Storage, используя ID продукта
              const imageRef = ref(storage, `products/${product.id}`);
              imageUrl = await getDownloadURL(imageRef);
            } catch (error) {
              console.error(`Image not found for product ${product.id}:`, error);
              // Используем локальную заглушку
              imageUrl = placeholderImage;
            }
            return { ...product, id: doc.id, imageUrl };
          })
        );

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <LoadingScreen />; // Показываем картинку загрузки
  }

  if (error) {
    return <div className="error-message">{error}</div>; // Показываем сообщение об ошибке
  }

  return (
    <div className="catalog">
      {/* Контейнер для каталога товаров */}
      <div className="catalog-container">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="product-image"
              onError={(e) => {
                e.target.src = placeholderImage; // Заглушка, если изображение не загрузилось
              }}
            />
            <h3 className="product-name">{product.title}</h3>
            <p className="product-price">{product.price} din</p>
            <p className="product-description">{product.descript}</p>
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