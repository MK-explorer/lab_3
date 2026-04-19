import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import CartItem from '../components/CartItem';

export default function CartPage() {
  const { cart, currentUser, clearCart, showToast } = useApp();
  const navigate = useNavigate();

  const totalQty   = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery   = totalPrice >= 500 ? 0 : 75;
  const grandTotal = totalPrice + delivery;

  function handleOrder() {
    if (!currentUser) { showToast('Увійдіть до акаунту для оформлення замовлення'); return; }
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const now = new Date();
    orders.unshift({
      id:     Math.floor(Math.random() * 90000) + 10000,
      date:   now.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'processing',
      items:  cart.map(i => ({ title: i.title, qty: i.qty, price: i.price })),
      total:  grandTotal,
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    clearCart();
    showToast('Замовлення оформлено! Дякуємо! 🎉');
    navigate('/account');
  }

  if (cart.length === 0) return (
    <div className="container page">
      <div className="empty-state">
        <div className="empty-icon">🛒</div>
        <h3>Кошик порожній</h3>
        <p>Перейдіть до каталогу, щоб додати книги</p>
        <button className="btn-primary" onClick={() => navigate('/catalog')}>До каталогу</button>
      </div>
    </div>
  );

  return (
    <div className="container page">
      <h2 className="section-heading">Мій <em>кошик</em></h2>
      <div className="cart-layout">
        <div className="cart-items-list">
          {cart.map(item => <CartItem key={item.id} item={item} />)}
        </div>

        <aside className="cart-summary-box">
          <h3>Підсумок замовлення</h3>
          <div className="summary-row">
            <span>Товари ({totalQty} шт.):</span><span>{totalPrice} грн</span>
          </div>
          <div className="summary-row">
            <span>Доставка:</span>
            <span style={{ color: delivery===0 ? 'var(--success)' : 'inherit' }}>
              {delivery === 0 ? 'Безкоштовно' : `${delivery} грн`}
            </span>
          </div>
          {delivery > 0 && (
            <p style={{ fontSize:'0.75rem', color:'var(--text-lt)', marginTop:'4px' }}>
              Безкоштовна доставка від 500 грн
            </p>
          )}
          <div className="summary-row summary-total">
            <span>Разом:</span><span>{grandTotal} грн</span>
          </div>
          <button className="btn-order" onClick={handleOrder}>
            {currentUser ? 'Оформити замовлення' : '🔒 Увійдіть для оформлення'}
          </button>
        </aside>
      </div>
    </div>
  );
}