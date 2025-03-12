import React, { useState , useEffect} from "react";
import Cart from "./Cart";  // Подключаем компонент Cart

import { CartContext } from '../CartContext.jsx'; // если в корне папки src // указываем .jsx // правильный путь, если файл в той же папке
// Данные товаров с уникальными значениями
const products = [
  {
    id: Math.random(),
    name: "Пельмени Свинина/Говядина",
    price: "1290 din",
    description: "Заморозка 1кг",
    image: "пельмениСвининаГовядина.png",
  },
  {
    id: Math.random(),
    name: "Пельмени: Говядина",
    price: "1590 din",
    description: "Заморозка 1кг",
    image: "пельмениГовядина.png",
  },
  {
    id: Math.random(),
    name: "Вареники: Творог",
    price: "1290 din",
    description: "Заморозка 1кг",
    image: "вареникиТворог.png",
  },
  {
    id: Math.random(),
    name: "Вареники: Картофель/лук",
    price: "1190 din",
    description: "Заморозка 1кг",
    image: "вареникиКартофельЛук.png",
  },
  {
    id: Math.random(),
    name: "Вареники: Картофель/Грибы",
    price: "1390 din",
    description: "Картофель/Грибы(шампиньоны, белый гриб) Заморозка 1кг",
    image: "вареникиКартофельГрибы.png",
  },
  {
    id: Math.random(),
    name: "Вареники: Вишня",
    price: "1290 din",
    description: "Заморозка 1кг",
    image: "вареникиВишня.png",
  },
  {
    id: Math.random(),
    name: "Блины: Яблоко/Корица",
    price: "690 din",
    description: "Упаковка 7 шт",
    image: "блиныЯблокоКорица.png",
  },
  {
    id: Math.random(),
    name: "Блины с творогом",
    price: "690 din",
    description: "Упаковка 7 шт",
    image: "блиныТворог.png",
  },
  {
    id: Math.random(),
    name: "Блины с курицей и грибами",
    price: "850 din",
    description: "Упаковка 7 шт",
    image: "блиныКурицаГрибы.png",
  },
  {
    id: Math.random(),
    name: "Морковь по-корейски",
    price: "195 din",
    description: "Упаковка 250 грамм",
    image: "public/морковьПоКорейски.png",
  },
  {
    id: Math.random(),
    name: "Торт Медовик",
    price: "2500 din",
    description: "Целый торт 1кг. По предзаказу",
    image: "Медовик.png",
  },
];



function Catalog() {
  const [cart, setCart] = useState([]);

  // Загружаем корзину из localStorage при первом рендере
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (storedCart) {
      setCart(storedCart);
    }
  }, []);

  // Сохраняем корзину в localStorage, когда она изменяется
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Добавляем товар в корзину
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  // Удаляем товар из корзины
  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
  };

  return (
    <div className="catalog">
      <div className="catalog-container">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">{product.price}</p>
            <p className="product-description">{product.description}</p>
            <button className="add-to-cart" onClick={() => addToCart(product)}>
              <p>Add to Cart</p>
            </button>
          </div>
        ))}
      </div>

      {/* Передаем корзину в компонент Cart */}
      <Cart cart={cart} removeFromCart={removeFromCart} />
    </div>
  );
}

export default Catalog;