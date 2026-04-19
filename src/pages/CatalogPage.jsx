import { useState, useEffect, useMemo } from 'react';
import BookCard from '../components/BookCard';

export default function CatalogPage() {
  const [books, setBooks]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeGenre, setActiveGenre] = useState('all');
  const [authorSearch, setAuthorSearch] = useState('');

  // useEffect: завантаження books.json при монтуванні
  useEffect(() => {
    fetch('/data/books.json')
      .then(res => res.json())
      .then(data => { setBooks(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // useMemo: унікальні жанри з даних
  const genres = useMemo(() => {
    const set = new Set(books.map(b => b.genre));
    return ['all', ...Array.from(set)];
  }, [books]);

  // useMemo: фільтрація за жанром + автором одночасно
  const filtered = useMemo(() => books.filter(book => {
    const genreOk  = activeGenre === 'all' || book.genre === activeGenre;
    const authorOk = !authorSearch.trim() ||
      book.author.toLowerCase().includes(authorSearch.toLowerCase().trim());
    return genreOk && authorOk;
  }), [books, activeGenre, authorSearch]);

  return (
    <div className="container page">
      <h2 className="section-heading">Каталог <em>книг</em></h2>

      {/* Фільтр за жанром (Завдання 2) */}
      <div className="filter-bar">
        <span className="filter-label">Жанр:</span>
        {genres.map(genre => (
          <button
            key={genre}
            className={`genre-btn${activeGenre === genre ? ' active' : ''}`}
            onClick={() => setActiveGenre(genre)}
          >
            {genre === 'all' ? 'Всі' : genre}
          </button>
        ))}
      </div>

      {/* Фільтр за автором (Завдання 2) */}
      <div className="filter-bar" style={{ marginBottom: '32px' }}>
        <span className="filter-label">Автор:</span>
        <input
          type="text"
          className="search-input"
          placeholder="Пошук за автором..."
          value={authorSearch}
          onChange={e => setAuthorSearch(e.target.value)}
        />
        {authorSearch && (
          <button className="genre-btn" style={{ color: 'var(--danger)' }}
            onClick={() => setAuthorSearch('')}>
            ✕ Скинути
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">Завантаження книг</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>Книг не знайдено</h3>
          <button className="btn-primary"
            onClick={() => { setActiveGenre('all'); setAuthorSearch(''); }}>
            Скинути фільтри
          </button>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: '20px', fontSize: '0.88rem', color: 'var(--text-lt)' }}>
            Знайдено: <strong style={{ color: 'var(--walnut)' }}>{filtered.length}</strong>
          </p>
          <div className="books-grid">
            {filtered.map(book => <BookCard key={book.id} book={book} />)}
          </div>
        </>
      )}
    </div>
  );
}