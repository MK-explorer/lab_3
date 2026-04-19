import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

function buildStars(rating) {
  const full  = Math.floor(rating);
  const empty = 5 - full;
  return '★'.repeat(full) + '☆'.repeat(empty);
}

export default function BookCard({ book }) {
  const { isInCart, addToCart, showToast } = useApp();
  const navigate = useNavigate();
  const inCart = isInCart(book.id);

  function handleAdd() {
    if (inCart) { navigate('/cart'); return; }
    addToCart(book);
    showToast(`«${book.title}» додано до кошика 🛒`);
  }

  return (
    <article className="book-card">
      <img
        src={book.image}
        alt={book.title}
        loading="lazy"
        onError={e => {
          e.target.src = `https://placehold.co/300x400/2c1a0e/f5e6c8?font=georgia&text=${encodeURIComponent(book.title)}`;
        }}
      />
      <div className="book-info">
        <span className="book-genre">{book.genre}</span>
        <h3>{book.title}</h3>
        <p className="author">{book.author}</p>
        <div className="rating">
          <span className="stars">{buildStars(book.rating)}</span>
          <span>{book.rating} ({book.ratingCount})</span>
        </div>
        <p className="price">{book.price} грн</p>
        <button
          className={`btn-add${inCart ? ' added' : ''}`}
          onClick={handleAdd}
        >
          {inCart ? '✓ Додано — перейти до кошика' : 'Додати до кошика'}
        </button>
      </div>
    </article>
  );
}