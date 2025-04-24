import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from "react";
import Header from "./components/Layout/Header";
import Catalog from "./pages/Catalog";
import Info from "./pages/Info";
import Auth from "./pages/Auth";
import AdminPanel from "./pages/AdminPanel"; 
import { CartProvider } from "./CartContext"; 
import { AuthProvider, useAuth } from "./AuthContext"; 
import ErrorBoundary from "./ErrorBoundary"; 

const ADMIN_ID = "VzxhMgwnAcRNBBRlNalqYLtVVMf2";


const PrivateAdminRoute = ({ children }) => {
  const { isAdmin } = useAuth(); 
  return isAdmin ? children : <Navigate to="/" />; 
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
                
                <Route path="/" element={<Info />} /> 
                <Route path="/info" element={<Info />} />
                <Route path="/catalog" element={<Catalog />} />

                
                <Route
                  path="/admin"
                  element={
                    <PrivateAdminRoute>
                      <AdminPanel />
                    </PrivateAdminRoute>
                  }
                />

                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </ErrorBoundary>
          </main>

          
          {isModalOpen && (
            <ErrorBoundary>
              <Auth closeAuthModal={closeAuthModal} />
            </ErrorBoundary>
          )}

         
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