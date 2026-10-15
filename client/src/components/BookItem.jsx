import { FaCheck, FaUndo, FaTrashAlt } from 'react-icons/fa';

// soft "book spine" colours, picked from the title so each book keeps its own look
const SPINES = [
  'from-sage-400 to-sage-600',
  'from-clay-400 to-clay-600',
  'from-sage-300 to-sage-500',
  'from-clay-200 to-clay-500',
  'from-sage-500 to-sage-700',
];

const spineFor = (text = '') => {
  let hash = 0;
  for (const ch of text) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return SPINES[hash % SPINES.length];
};

const formatDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const BookItem = ({ book, index = 0, onDelete, onToggleRead }) => {
  const isRead = book.status === 'read';

  return (
    <li
      className={`animate-fade-up group flex items-center gap-4 rounded-2xl border p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-sage-800/10 sm:p-4 ${
        isRead ? 'border-sage-200 bg-sage-50/80' : 'border-sage-100 bg-white'
      }`}
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
    >
      {/* Book cover */}
      <div
        className={`relative flex h-16 w-12 shrink-0 items-center justify-center rounded-md bg-linear-to-br shadow-md shadow-sage-800/20 transition-opacity duration-300 ${spineFor(
          book.title
        )} ${isRead ? 'opacity-60' : ''}`}
      >
        <span className="absolute inset-y-0 left-1.5 w-px bg-white/30" />
        <span className="font-display text-xl font-semibold text-white/95">
          {book.title.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3
          className={`truncate font-display text-lg font-semibold transition-colors duration-300 ${
            isRead ? 'text-sage-700/60 line-through decoration-sage-400/70' : 'text-sage-800'
          }`}
          title={book.title}
        >
          {book.title}
        </h3>
        <p className="truncate text-sm text-sage-700/75">by {book.author}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isRead ? 'bg-sage-200 text-sage-800' : 'bg-clay-100 text-clay-600'
            }`}
          >
            {isRead && <FaCheck className="text-[9px]" />}
            {isRead ? 'Read' : 'To read'}
          </span>
          <span className="text-xs text-sage-700/50">Added {formatDate(book.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => onToggleRead(book.id)}
          title={isRead ? 'Mark as unread' : 'Mark as read'}
          aria-label={isRead ? 'Mark as unread' : 'Mark as read'}
          className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all duration-200 sm:text-sm ${
            isRead
              ? 'bg-white text-sage-700 ring-1 ring-sage-200 hover:bg-sage-100'
              : 'bg-sage-600 text-white shadow-sm hover:bg-sage-700'
          }`}
        >
          {isRead ? <FaUndo className="text-xs" /> : <FaCheck className="text-xs" />}
          <span className="hidden sm:inline">{isRead ? 'Unread' : 'Done'}</span>
        </button>

        <button
          onClick={() => onDelete(book.id)}
          title="Delete book"
          aria-label="Delete book"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-clay-500 transition-all duration-200 hover:bg-clay-100 hover:text-clay-600"
        >
          <FaTrashAlt className="text-sm" />
        </button>
      </div>
    </li>
  );
};

export default BookItem;
