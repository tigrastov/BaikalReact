import { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import Cart from "../../pages/Cart.jsx";
import { CartContext } from '../../CartContext';
import { useAuth } from '../../AuthContext'; // Импортируем контекст авторизации
import OrdersSidebar from "../../pages/OrdersSidebar";

function Header({ openAuthModal }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);

  const { cart } = useContext(CartContext);
  const { user, isAdmin } = useAuth(); // Получаем пользователя и флаг isAdmin

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  const toggleCart = () => setCartOpen(!cartOpen);
  const toggleOrders = () => setOrdersOpen(!ordersOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target) &&
        burgerRef.current && !burgerRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header>
      <div className="logo">
        <img src="/Logotip.png" alt="Logo" />
      </div>

      <nav ref={menuRef} className={menuOpen ? "open" : ""}>
        <ul>
          <li><Link to="/info" onClick={closeMenu}>Info</Link></li>
          <li><Link to="/catalog" onClick={closeMenu}>Catalog</Link></li>
          <li>
            <button onClick={toggleOrders} className="link-style">
              My Orders
            </button>
          </li>
          {/* Ссылка на админ-панель только для администратора */}
          {isAdmin && (
            <li>
              <Link to="/admin" onClick={closeMenu}>Admin Panel</Link>
            </li>
          )}
          <li>
            <button onClick={toggleCart} className="cart-button link-style">
              Cart
              {cart.length > 0 && (
                <span className="cart-count">{cart.length}</span>
              )}
            </button>
          </li>
          <li>
            <button onClick={openAuthModal} className="link-style">
              Auth
            </button>
          </li>
        </ul>
      </nav>

      <div className="burger" ref={burgerRef} onClick={toggleMenu}>
        <div className="burger-line"></div>
        <div className="burger-line"></div>
        <div className="burger-line"></div>
      </div>

      {cartOpen && <div className="cart-overlay" onClick={toggleCart}></div>}
      <div className={`cart-sidebar ${cartOpen ? "open" : ""}`}>
        <Cart openAuthModal={openAuthModal} />
        <button className="close-cart" onClick={toggleCart}>×</button>
      </div>

      {ordersOpen && <div className="cart-overlay" onClick={toggleOrders}></div>}
      <div className={`orders-sidebar ${ordersOpen ? "open" : ""}`}>
        <OrdersSidebar isOpen={ordersOpen} onClose={toggleOrders} />
        <button className="close-orders" onClick={toggleOrders}>×</button>
      </div>
    </header>
  );
}

export default Header;