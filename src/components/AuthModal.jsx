import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function AuthModal({ onClose }) {
  const { login, showToast } = useApp();
  const [tab, setTab] = useState('login');

  const [loginForm, setLoginForm]     = useState({ username: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const [regForm, setRegForm]         = useState({ name: '', email: '', username: '', password: '' });
  const [regErrors, setRegErrors]     = useState({});

  // useEffect: закриття по Escape + блокування прокрутки
  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  async function handleLogin() {
    const errors = {};
    if (!loginForm.username.trim()) errors.username = 'Введіть логін';
    if (!loginForm.password.trim()) errors.password = 'Введіть пароль';
    if (Object.keys(errors).length) { setLoginErrors(errors); return; }

    try {
      const res   = await fetch('/data/users.json');
      const users = await res.json();

      let found = users.find(
        u => u.username === loginForm.username.trim() && u.password === loginForm.password.trim()
      );
      if (!found) {
        const local = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        found = local.find(
          u => u.username === loginForm.username.trim() && u.password === loginForm.password.trim()
        );
      }

      if (found) {
        login({ id: found.id, name: found.name, email: found.email, username: found.username, memberSince: found.memberSince });
        showToast(`Вітаємо, ${found.name}! 👋`);
        onClose();
      } else {
        setLoginErrors({ general: 'Невірний логін або пароль' });
      }
    } catch {
      setLoginErrors({ general: 'Помилка завантаження. Спробуйте ще раз.' });
    }
  }

  function handleRegister() {
    const errors = {};
    if (!regForm.name.trim())              errors.name     = "Введіть ім'я";
    if (!regForm.email.includes('@'))      errors.email    = 'Введіть коректний email';
    if (regForm.username.trim().length<4)  errors.username = 'Мінімум 4 символи';
    if (regForm.password.length < 6)       errors.password = 'Мінімум 6 символів';
    if (Object.keys(errors).length) { setRegErrors(errors); return; }

    const local = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (local.find(u => u.username === regForm.username.trim())) {
      setRegErrors({ username: 'Логін вже зайнятий' }); return;
    }

    const months = ['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
    const now = new Date();
    const memberSince = `${months[now.getMonth()]} ${now.getFullYear()}`;
    const newUser = { id: Date.now(), ...regForm, memberSince };

    local.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(local));
    login({ id: newUser.id, name: newUser.name, email: newUser.email, username: newUser.username, memberSince });
    showToast(`Акаунт створено! Вітаємо, ${newUser.name}! 🎉`);
    onClose();
  }

  const labels      = { name: "Ім'я", email: 'Email', username: 'Логін', password: 'Пароль' };
  const placeholders = { name: "Ваше ім'я", email: 'your@email.com', username: 'Мін. 4 символи', password: 'Мін. 6 символів' };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="auth-tabs">
          <button className={`auth-tab${tab==='login'    ? ' active':''}`} onClick={() => setTab('login')}>Вхід</button>
          <button className={`auth-tab${tab==='register' ? ' active':''}`} onClick={() => setTab('register')}>Реєстрація</button>
        </div>

        {tab === 'login' && (
          <div>
            {['username','password'].map(field => (
              <div className="auth-form-group" key={field}>
                <label>{labels[field]}</label>
                <input
                  type={field === 'password' ? 'password' : 'text'}
                  className={loginErrors[field] ? 'invalid' : ''}
                  placeholder={placeholders[field]}
                  value={loginForm[field]}
                  onChange={e => setLoginForm(f => ({ ...f, [field]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
                <span className="auth-error">{loginErrors[field]}</span>
              </div>
            ))}
            {loginErrors.general && <span className="auth-error">{loginErrors.general}</span>}
            <button className="btn-auth-submit" onClick={handleLogin}>Увійти</button>
            <p className="auth-hint">Демо: <code>demo</code> / <code>demo123</code></p>
          </div>
        )}

        {tab === 'register' && (
          <div>
            {['name','email','username','password'].map(field => (
              <div className="auth-form-group" key={field}>
                <label>{labels[field]}</label>
                <input
                  type={field==='password' ? 'password' : field==='email' ? 'email' : 'text'}
                  className={regErrors[field] ? 'invalid' : ''}
                  placeholder={placeholders[field]}
                  value={regForm[field]}
                  onChange={e => setRegForm(f => ({ ...f, [field]: e.target.value }))}
                />
                <span className="auth-error">{regErrors[field]}</span>
              </div>
            ))}
            <button className="btn-auth-submit" onClick={handleRegister}>Зареєструватися</button>
          </div>
        )}
      </div>
    </div>
  );
}