import { useState } from 'react';
import { FaPlus, FaSpinner } from 'react-icons/fa';

const inputClass =
  'w-full rounded-xl border border-sage-200 bg-sage-50/60 px-4 py-2.5 text-sm text-ink placeholder:text-sage-400 transition focus:border-sage-400 focus:bg-white focus:ring-4 focus:ring-sage-200/60 focus:outline-none';

const BookForm = ({ onAddBook }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || submitting) return;

    setSubmitting(true);
    const ok = await onAddBook({ title: title.trim(), author: author.trim() });
    setSubmitting(false);

    if (ok) {
      setTitle('');
      setAuthor('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="mb-1.5 block text-xs font-semibold tracking-wide text-sage-700 uppercase">
          Book title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. The Alchemist"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="author" className="mb-1.5 block text-xs font-semibold tracking-wide text-sage-700 uppercase">
          Author
        </label>
        <input
          id="author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="e.g. Paulo Coelho"
          required
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-sage-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-sage-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-sage-700 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? <FaSpinner className="animate-spin" /> : <FaPlus className="text-xs" />}
        {submitting ? 'Adding…' : 'Add to shelf'}
      </button>
    </form>
  );
};

export default BookForm;
