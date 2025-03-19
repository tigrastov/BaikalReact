import { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import Cart from "../../pages/Cart.jsx";
import { CartContext } from '../../CartContext'; // Импортируем контекст корзины

function Header({ openAuthModal }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);

  // Используем контекст корзины
  const { cart } = useContext(CartContext);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

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

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
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
          <li><Link to="/orders" onClick={closeMenu}>My orders</Link></li>
          <li>
            <button onClick={toggleCart} className="cart-button">
              Cart
              {/* Красный кружок с количеством товаров */}
              {cart.length > 0 && (
                <span className="cart-count">{cart.length}</span>
              )}
            </button>
          </li>
          <li><button onClick={openAuthModal}>Auth</button></li>
        </ul>
      </nav>

      <div className="burger" ref={burgerRef} onClick={toggleMenu}>
        <div className="burger-line"></div>
        <div className="burger-line"></div>
        <div className="burger-line"></div>
      </div>

      {/* Затемнение фона */}
      {cartOpen && <div className="cart-overlay" onClick={toggleCart}></div>}

      {/* Сайдбар корзины */}
      <div className={`cart-sidebar ${cartOpen ? "open" : ""}`}>
        <Cart openAuthModal={openAuthModal} /> {/* Передаем openAuthModal в Cart */}
        <button className="close-cart" onClick={toggleCart}>×</button>
      </div>
    </header>
  );
}

export default Header;