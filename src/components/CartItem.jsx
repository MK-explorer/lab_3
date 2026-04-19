import { useApp } from '../context/AppContext';

export default function CartItem({ item }) {
  const { updateQty, removeFromCart, showToast } = useApp();

  function handleRemove() {
    removeFromCart(item.id);
    showToast('Товар видалено з кошика');
  }

  return (
    <div className="cart-item">
      <img
        src={item.image}
        alt={item.title}
        onError={e => {
          e.target.src = `https://placehold.co/80x110/2c1a0e/f5e6c8?font=georgia&text=${encodeURIComponent(item.title.slice(0,10))}`;
        }}
      />
      <div className="cart-item-info">
        <h4>{item.title}</h4>
        <p className="author">{item.author}</p>
        <p className="item-price">
          {item.price} грн × {item.qty} ={' '}
          <strong>{item.price * item.qty} грн</strong>
        </p>
      </div>
      <div className="cart-item-actions">
        <div className="quantity-control">
          <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
          <span className="qty-display">{item.qty}</span>
          <button className="qty-btn" onClick={() => updateQty(item.id, +1)}>+</button>
        </div>
        <button className="btn-remove" onClick={handleRemove}>🗑 Видалити</button>
      </div>
    </div>
  );
}