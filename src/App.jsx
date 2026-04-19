import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header     from './components/Header';
import Toast      from './components/Toast';
import HomePage   from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import CartPage   from './pages/CartPage';
import AccountPage from './pages/AccountPage';

function NotFound() {
  return (
    <div className="container page" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📖</div>
      <h2 style={{ marginBottom: '8px' }}>Сторінку не знайдено</h2>
      <a href="/" style={{ color: 'var(--amber)' }}>← На головну</a>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Header />

        <Routes>
          <Route path="/"        element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/cart"    element={<CartPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="*"        element={<NotFound />} />
        </Routes>

        <footer className="footer">
          <p>© {new Date().getFullYear()} КнигаЛенд </p>
        </footer>

        <Toast />
      </HashRouter>
    </AppProvider>
  );
}