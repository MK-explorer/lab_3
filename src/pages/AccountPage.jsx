import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import UserInfo from '../components/UserInfo';

export default function AccountPage() {
  const { currentUser, logout, showToast } = useApp();
  const [orders, setOrders] = useState([]);

  // useEffect: завантаження замовлень при зміні користувача
  useEffect(() => {
    if (currentUser) {
      setOrders(JSON.parse(localStorage.getItem('orders') || '[]'));
    } else {
      setOrders([]);
    }
  }, [currentUser]);

  if (!currentUser) return (
    <div className="container page">
      <div className="empty-state">
        <div className="empty-icon">🔒</div>
        <h3>Увійдіть до акаунту</h3>
        <p>Натисніть кнопку «Увійти» у шапці сайту.</p>
      </div>
    </div>
  );

  return (
    <div className="container page">
      <h2 className="section-heading">Мій <em>акаунт</em></h2>
      <div className="account-layout">

        {/* Компонент UserInfo (Завдання 1) */}
        <div>
          <UserInfo user={currentUser} />
          <button onClick={() => { logout(); showToast('Ви вийшли з акаунту'); }}
            style={{ marginTop:'16px', width:'100%', background:'none',
              border:'1px solid #e0b0a0', color:'var(--danger)',
              padding:'10px', borderRadius:'var(--radius)', fontSize:'0.88rem', cursor:'pointer' }}>
            Вийти з акаунту
          </button>
        </div>

        {/* Історія замовлень */}
        <div className="orders-section">
          <h3>Історія покупок</h3>
          {orders.length === 0 ? (
            <div className="empty-state" style={{ padding:'40px 0' }}>
              <div className="empty-icon">📦</div>
              <p>У вас ще немає замовлень.</p>
            </div>
          ) : (
            orders.map(order => <OrderCard key={order.id} order={order} />)
          )}
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }) {
  const statusMap = {
    processing: { label: 'В обробці',  cls: 'processing' },
    delivered:  { label: 'Доставлено', cls: 'delivered' },
  };
  const { label, cls } = statusMap[order.status] || statusMap.processing;

  return (
    <div className="order-card">
      <div className="order-header">
        <span className="order-num">Замовлення #{order.id}</span>
        <span className="order-date">{order.date}</span>
        <span className={`order-status ${cls}`}>{label}</span>
      </div>
      <ul className="order-items">
        {order.items.map((item, i) => (
          <li key={i}>{item.title} × {item.qty} — <strong>{item.price * item.qty} грн</strong></li>
        ))}
      </ul>
      <p className="order-total">Сума: {order.total} грн</p>
    </div>
  );
}