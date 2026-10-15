import { FaBook } from 'react-icons/fa';
import BookItem from './BookItem';

const Skeleton = () => (
  <div className="space-y-3">
    {[0, 1, 2].map((i) => (
      <div key={i} className="flex animate-pulse items-center gap-4 rounded-2xl bg-sage-50 p-4">
        <div className="h-16 w-12 rounded-lg bg-sage-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-sage-100" />
          <div className="h-3 w-1/3 rounded bg-sage-100" />
        </div>
      </div>
    ))}
  </div>
);

const BookList = ({ books, loading, hasAnyBooks, onDelete, onToggleRead }) => {
  if (loading) return <Skeleton />;

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-sage-200 bg-sage-50/50 px-6 py-14 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-sage-100 text-sage-500">
          <FaBook className="text-xl" />
        </div>
        <p className="font-display text-xl text-sage-800">
          {hasAnyBooks ? 'Nothing matches here' : 'Your shelf is empty'}
        </p>
        <p className="mt-1 max-w-xs text-sm text-sage-700/70">
          {hasAnyBooks
            ? 'Try another search or switch the filter.'
            : 'Add your first book using the form and start your reading journey.'}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {books.map((book, i) => (
        <BookItem
          key={book.id}
          book={book}
          index={i}
          onDelete={onDelete}
          onToggleRead={onToggleRead}
        />
      ))}
    </ul>
  );
};

export default BookList;
