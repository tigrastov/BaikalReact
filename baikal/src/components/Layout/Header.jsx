import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);  // Ссылка на меню
  const burgerRef = useRef(null);  // Ссылка на бургер-меню

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);  // Переключение состояния меню
  };

  const closeMenu = () => {
    setMenuOpen(false);  // Закрытие меню
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Проверяем, был ли клик вне меню и вне бургер-меню
      if (
        menuRef.current && !menuRef.current.contains(event.target) &&
        burgerRef.current && !burgerRef.current.contains(event.target)
      ) {
        closeMenu();  // Закрыть меню, если клик был вне
      }
    };

    // Добавляем обработчик события
    document.addEventListener('click', handleClickOutside);

    // Убираем обработчик при размонтировании компонента
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header>
      <div className="logo">
        <img src="/Logotip.png" alt="Logo" />
      </div>

      {/* Открытое меню или бургер */}
      <nav ref={menuRef} className={menuOpen ? "open" : ""}>
        <ul>
          <li><Link to="/catalog" onClick={closeMenu}>Catalog</Link></li>

          <li><Link to="/info" onClick={closeMenu}>Info</Link></li>
        </ul>
      </nav>

      {/* Бургер-меню */}
      <div className="burger" ref={burgerRef} onClick={toggleMenu}>
        <div className="burger-line"></div>
        <div className="burger-line"></div>
        <div className="burger-line"></div>
      </div>
    </header>
  );
}

export default Header;