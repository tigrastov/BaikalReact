import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Layout/Header";
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import Info from "./pages/Info";
import Orders from "./pages/Orders";
import Auth from "./pages/Auth";
import { CartProvider } from "./CartContext"; // Провайдер корзины
import { AuthProvider } from "./AuthContext"; // Провайдер авторизации
import React, { useState } from "react";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openAuthModal = () => setIsModalOpen(true);
  const closeAuthModal = () => setIsModalOpen(false);

  return (
    <AuthProvider> {/* Добавляем AuthProvider */}
      <CartProvider>
        <Router>
          <Header openAuthModal={openAuthModal} /> {/* Передаем функцию для открытия модального окна в Header */}
          <main>
            <Routes>
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/info" element={<Info />} />
            </Routes>
          </main>

          {/* Модальное окно для авторизации */}
          {isModalOpen && <Auth closeAuthModal={closeAuthModal} />} {/* Показываем Auth при открытом состоянии модального окна */}
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;