import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from "react";
import Header from "./components/Layout/Header";
import Catalog from "./pages/Catalog";
import Info from "./pages/Info";
import Auth from "./pages/Auth";
import AdminPanel from "./pages/AdminPanel"; // Импортируем компонент админ-панели
import { CartProvider } from "./CartContext"; // Провайдер корзины
import { AuthProvider, useAuth } from "./AuthContext"; // Импортируем useAuth
import ErrorBoundary from "./ErrorBoundary"; // Компонент для обработки ошибок

const ADMIN_ID = "VzxhMgwnAcRNBBRlNalqYLtVVMf2";

// Компонент для защиты роутов (только для администратора)
const PrivateAdminRoute = ({ children }) => {
  const { isAdmin } = useAuth(); // Используем хук useAuth
  return isAdmin ? children : <Navigate to="/" />; // Редирект, если не админ
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openAuthModal = () => setIsModalOpen(true);
  const closeAuthModal = () => setIsModalOpen(false);
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <AuthProvider adminId={ADMIN_ID}>
      <CartProvider>
        <Router>
          <Header
            openAuthModal={openAuthModal}
            openSidebar={openSidebar}
          />
          <main>
            <ErrorBoundary>
              <Routes>
                {/* Основные роуты */}
                <Route path="/" element={<Info />} /> {/* Первая страница */}
                <Route path="/info" element={<Info />} />
                <Route path="/catalog" element={<Catalog />} />

                {/* Защищенный роут для админ-панели */}
                <Route
                  path="/admin"
                  element={
                    <PrivateAdminRoute>
                      <AdminPanel />
                    </PrivateAdminRoute>
                  }
                />

                {/* Редирект на главную для неизвестных путей */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </ErrorBoundary>
          </main>

          {/* Модальное окно авторизации */}
          {isModalOpen && (
            <ErrorBoundary>
              <Auth closeAuthModal={closeAuthModal} />
            </ErrorBoundary>
          )}

          {/* Боковое меню заказов */}
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