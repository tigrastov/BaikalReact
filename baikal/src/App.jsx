import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Info from './pages/Info';
import { CartProvider } from './CartContext'; // Импортируем провайдер корзины
import { CartContext } from './CartContext.jsx'; // указываем .jsx
function App() {
  return (
    <CartProvider> {/* Оборачиваем все приложение в провайдер корзины */}
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/info" element={<Info />} />
          </Routes>
        </main>
      </Router>
    </CartProvider>
  );
}

export default App;