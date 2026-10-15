import { useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaBookOpen, FaSearch } from 'react-icons/fa';
import BookForm from './components/BookForm';
import BookList from './components/BookList';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://server-gamma-two-70.vercel.app/books';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'To read' },
  { key: 'read', label: 'Finished' },
];

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  // GET /books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching books:', error);
        toast.error('Could not load your books');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // POST /books  → returns true on success so the form can clear itself
  const handleAddBook = async (bookData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });
      const newBook = await response.json();
      if (response.ok) {
        setBooks((prev) => [newBook, ...prev]);
        toast.success('Added to your shelf');
        return true;
      }
      toast.error(newBook.error || 'Could not add the book');
      return false;
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Could not add the book');
      return false;
    }
  };

  // DELETE /books/:id
  const handleDeleteBook = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setBooks((prev) => prev.filter((book) => book.id !== id));
        toast.success('Removed from your shelf');
      } else {
        toast.error('Could not delete the book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Could not delete the book');
    }
  };

  // PUT /books/:id  (toggle read / unread)
  const handleToggleRead = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'PUT' });
      const updatedBook = await response.json();
      if (response.ok) {
        setBooks((prev) => prev.map((b) => (b.id === id ? updatedBook : b)));
        toast.success(updatedBook.status === 'read' ? 'Marked as read 🎉' : 'Moved back to your list');
      } else {
        toast.error('Could not update the book');
      }
    } catch (error) {
      console.error('Error updating book status:', error);
      toast.error('Could not update the book');
    }
  };

  const stats = useMemo(() => {
    const read = books.filter((b) => b.status === 'read').length;
    const total = books.length;
    return { total, read, unread: total - read, percent: total ? Math.round((read / total) * 100) : 0 };
  }, [books]);

  const visibleBooks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      const matchesFilter = filter === 'all' || b.status === filter;
      const matchesQuery =
        !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [books, filter, query]);

  const counts = { all: stats.total, unread: stats.unread, read: stats.read };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-linear-to-br from-sage-50 via-cream to-clay-50 pb-16">
      {/* soft floating background shapes */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-0">
        <div className="animate-float absolute -top-24 -left-24 h-80 w-80 rounded-full bg-sage-200/50 blur-3xl" />
        <div className="animate-float absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-clay-100/70 blur-3xl [animation-delay:-5s]" />
        <div className="animate-float absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-sage-100/70 blur-3xl [animation-delay:-9s]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="animate-fade-up pt-10 pb-8 text-center sm:pt-14">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-600 text-sage-50 shadow-lg shadow-sage-600/20">
            <FaBookOpen className="text-2xl" />
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-sage-800 sm:text-5xl">
            My BookShelf
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-sage-700/80">
            A quiet corner for the books you want to read, and the ones you already loved.
          </p>
        </header>

        {/* Stats */}
        <section
          className="animate-fade-up mb-8 grid grid-cols-3 gap-3 sm:gap-4"
          style={{ animationDelay: '80ms' }}
        >
          {[
            { label: 'Total', value: stats.total, tone: 'text-sage-800' },
            { label: 'To read', value: stats.unread, tone: 'text-clay-600' },
            { label: 'Finished', value: stats.read, tone: 'text-sage-600' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/70 bg-white/70 p-4 text-center shadow-sm shadow-sage-800/5 backdrop-blur"
            >
              <div className={`font-display text-3xl font-semibold ${s.tone}`}>{s.value}</div>
              <div className="mt-0.5 text-xs font-medium tracking-wide text-sage-700/70 uppercase">
                {s.label}
              </div>
            </div>
          ))}
          <div className="col-span-3 rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm shadow-sage-800/5 backdrop-blur">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-sage-800">Reading progress</span>
              <span className="text-sage-700/80">{stats.percent}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-sage-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-sage-400 to-sage-600 transition-all duration-700 ease-out"
                style={{ width: `${stats.percent}%` }}
              />
            </div>
          </div>
        </section>

        <main className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Form */}
          <aside
            className="animate-fade-up rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-sage-800/5 backdrop-blur lg:sticky lg:top-8"
            style={{ animationDelay: '140ms' }}
          >
            <h2 className="font-display text-2xl font-semibold text-sage-800">Add a book</h2>
            <p className="mt-1 mb-5 text-sm text-sage-700/70">What's next on your list?</p>
            <BookForm onAddBook={handleAddBook} />
          </aside>

          {/* List */}
          <section
            className="animate-fade-up rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl shadow-sage-800/5 backdrop-blur sm:p-6 lg:col-span-2"
            style={{ animationDelay: '200ms' }}
          >
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-2xl font-semibold text-sage-800">Your books</h2>
              <div className="relative sm:w-60">
                <FaSearch className="absolute top-1/2 left-3.5 -translate-y-1/2 text-xs text-sage-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search title or author"
                  aria-label="Search books"
                  className="w-full rounded-full border border-sage-200 bg-sage-50/70 py-2 pr-4 pl-9 text-sm text-ink placeholder:text-sage-400 transition focus:border-sage-400 focus:bg-white focus:ring-4 focus:ring-sage-200/60 focus:outline-none"
                />
              </div>
            </div>

            <div className="mb-5 inline-flex rounded-full bg-sage-100/80 p-1" role="tablist">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={filter === f.key}
                  onClick={() => setFilter(f.key)}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                    filter === f.key
                      ? 'bg-white text-sage-800 shadow-sm'
                      : 'text-sage-700/70 hover:text-sage-800'
                  }`}
                >
                  {f.label}
                  <span className="ml-1.5 text-xs text-sage-500">{counts[f.key]}</span>
                </button>
              ))}
            </div>

            <BookList
              books={visibleBooks}
              loading={loading}
              hasAnyBooks={books.length > 0}
              onDelete={handleDeleteBook}
              onToggleRead={handleToggleRead}
            />
          </section>
        </main>

        <footer className="mt-12 text-center text-sm text-sage-700/60">
          Happy reading ✦
        </footer>
      </div>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#374a34',
            color: '#f3f6f1',
            borderRadius: '9999px',
            padding: '10px 18px',
            fontSize: '14px',
          },
          iconTheme: { primary: '#a8bf9e', secondary: '#374a34' },
        }}
      />
    </div>
  );
}

export default App;
