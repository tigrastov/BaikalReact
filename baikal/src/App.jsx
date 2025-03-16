import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Header from "./components/Layout/Header";
import Catalog from "./pages/Catalog";
import Info from "./pages/Info";
import Orders from "./pages/Orders";
import Auth from "./pages/Auth";
import { CartProvider } from "./CartContext"; // Провайдер корзины
import { AuthProvider } from "./AuthContext"; // Провайдер авторизации
import ErrorBoundary from "./ErrorBoundary"; // Компонент для обработки ошибок

function App() {
  // Состояние для управления модальным окном авторизации
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Функция для открытия модального окна
  const openAuthModal = () => setIsModalOpen(true);

  // Функция для закрытия модального окна
  const closeAuthModal = () => setIsModalOpen(false);

  return (
    // Оборачиваем всё в AuthProvider для управления авторизацией
    <AuthProvider>
      {/* Оборачиваем всё в CartProvider для управления корзиной */}
      <CartProvider>
        {/* Оборачиваем всё в Router для маршрутизации */}
        <Router>
          {/* Хедер с возможностью открыть модальное окно авторизации */}
          <Header openAuthModal={openAuthModal} />

          {/* Основной контент страницы */}
          <main>
            {/* Оборачиваем Routes в ErrorBoundary для обработки ошибок */}
            <ErrorBoundary>
              <Routes>
                {/* Маршрут для каталога */}
                <Route path="/catalog" element={<Catalog />} />

                {/* Маршрут для заказов */}
                <Route path="/orders" element={<Orders />} />

                {/* Маршрут для информации */}
                <Route path="/info" element={<Info />} />
              </Routes>
            </ErrorBoundary>
          </main>

          {/* Модальное окно для авторизации */}
          {isModalOpen && (
            <ErrorBoundary>
              <Auth closeAuthModal={closeAuthModal} />
            </ErrorBoundary>
          )}
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;