import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard';

export default function HomePage() {
  const [books, setBooks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // useEffect: завантаження books.json при монтуванні
  useEffect(() => {
    fetch('/data/books.json')
      .then(res => res.json())
      .then(data => {
        // Fisher-Yates shuffle для рандомних рекомендацій
        const shuffled = [...data];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setBooks(shuffled.slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <h1>Книжковий світ у <em>кожному домі</em></h1>
          <p>Понад 15 книг для душі, розуму та натхнення. Українська класика, світові бестселери.</p>
          <button className="hero-btn" onClick={() => navigate('/catalog')}>
            Перейти до каталогу →
          </button>
        </div>
      </section>

      <div className="container page">
        <h2 className="section-heading">Рекомендуємо <em>сьогодні</em></h2>

        {loading ? (
          <div className="loading">Завантаження книг</div>
        ) : (
          <div className="books-grid">
            {books.map(book => <BookCard key={book.id} book={book} />)}
          </div>
        )}

        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <button className="btn-primary" onClick={() => navigate('/catalog')}>
            Переглянути весь каталог
          </button>
        </div>
      </div>
    </main>
  );
}