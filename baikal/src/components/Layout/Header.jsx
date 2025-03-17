import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Header({ openAuthModal }) {  // Принимаем openAuthModal как пропс
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
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
          <li><Link to="/catalog" onClick={closeMenu}>Catalog</Link></li>
          <li><Link to="/orders" onClick={closeMenu}>My orders</Link></li>
          <li><Link to="/info" onClick={closeMenu}>Info</Link></li>
          <li><button onClick={openAuthModal}>Auth</button></li>  {/* Используем openAuthModal из пропсов */}
        </ul>
      </nav>

      <div className="burger" ref={burgerRef} onClick={toggleMenu}>
        <div className="burger-line"></div>
        <div className="burger-line"></div>
        <div className="burger-line"></div>
      </div>
    </header>
  );
}

export default Header;