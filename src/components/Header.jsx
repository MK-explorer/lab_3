import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AuthModal from './AuthModal';

export default function Header() {
  const { currentUser, logout, cartCount, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  function handleAuthClick() {
    if (currentUser) {
      logout();
      showToast('Ви вийшли з акаунту');
      navigate('/');
    } else {
      setShowModal(true);
    }
  }

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="header-logo" onClick={() => navigate('/')}>
            Книга<span>Ленд</span>
          </div>

          <nav className="header-nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
              Головна
            </NavLink>
            <NavLink to="/catalog" className={({ isActive }) => isActive ? 'active' : ''}>
              Каталог
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => `cart-link${isActive ? ' active' : ''}`}>
              🛒 Кошик
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </NavLink>
            <NavLink to="/account" className={({ isActive }) => isActive ? 'active' : ''}>
              Акаунт
            </NavLink>
          </nav>

          <button className="btn-auth" onClick={handleAuthClick}>
            👤 {currentUser ? `${currentUser.name.split(' ')[0]} | Вийти` : 'Увійти'}
          </button>
        </div>
      </header>

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  );
}