import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Header from "./components/Layout/Header";
import Catalog from "./pages/Catalog";
import Info from "./pages/Info";
import Auth from "./pages/Auth";
import { CartProvider } from "./CartContext"; // Провайдер корзины
import { AuthProvider } from "./AuthContext"; // Провайдер авторизации
import ErrorBoundary from "./ErrorBoundary"; // Компонент для обработки ошибок

function App() {
  // Состояние для управления модальным окном авторизации
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Состояние для управления боковым меню
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Функция для открытия модального окна авторизации
  const openAuthModal = () => setIsModalOpen(true);

  // Функция для закрытия модального окна авторизации
  const closeAuthModal = () => setIsModalOpen(false);

  // Функция для открытия бокового меню
  const openSidebar = () => setIsSidebarOpen(true);

  // Функция для закрытия бокового меню
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    // Оборачиваем всё в AuthProvider для управления авторизацией
    <AuthProvider>
      {/* Оборачиваем всё в CartProvider для управления корзиной */}
      <CartProvider>
        {/* Оборачиваем всё в Router для маршрутизации */}
        <Router>
          {/* Хедер с возможностью открыть модальное окно авторизации и боковое меню */}
          <Header
            openAuthModal={openAuthModal}
            openSidebar={openSidebar}
          />

          {/* Основной контент страницы */}
          <main>
            {/* Оборачиваем Routes в ErrorBoundary для обработки ошибок */}
            <ErrorBoundary>
              <Routes>
                {/* Маршрут для каталога */}
                <Route path="/catalog" element={<Catalog />} />

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

          {/* Боковое меню */}
          {isSidebarOpen && (
            <ErrorBoundary>
              <OrdersSidebar closeSidebar={closeSidebar} />
            </ErrorBoundary>
          )}
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;