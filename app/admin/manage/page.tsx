'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Note {
  id: string;
  title: string;
  unit: string;
  file_url: string;
  subjects: { name: string } | null;
}

export default function ManageNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Browser client initialize karna zaroori hai taaki admin cookies Supabase tak pahuchein
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const { data } = await supabase
      .from('notes')
      .select('id, title, unit, file_url, subjects(name)')
      .order('created_at', { ascending: false });

    setNotes((data as unknown as Note[]) || []);
    setLoading(false);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(notes.map(n => n.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (e.target.checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    const confirmDelete = window.confirm('Kya aap is note ko permanently delete karna chahte hain?');
    if (!confirmDelete) return;

    try {
      const urlParts = fileUrl.split('/notes-files/');
      if (urlParts.length === 2) {
        const filePath = urlParts[1];
        await supabase.storage.from('notes-files').remove([filePath]);
      }

      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) throw error; // Ab agar auth fail hoga toh yahan exact error aayegi

      setNotes(prev => prev.filter(note => note.id !== id));
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
      router.refresh();
    } catch (error) {
      alert('Error deleting note. Please check your admin session.');
      console.error(error);
    }
  };

  const handleMultiDelete = async () => {
    if (selectedIds.length === 0) return;
    const confirmDelete = window.confirm(`Kya aap sach mein in ${selectedIds.length} notes ko delete karna chahte hain?`);
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const notesToDelete = notes.filter(n => selectedIds.includes(n.id));

      for (const note of notesToDelete) {
        const urlParts = note.file_url.split('/notes-files/');
        if (urlParts.length === 2) {
          const filePath = urlParts[1];
          await supabase.storage.from('notes-files').remove([filePath]);
        }
      }

      const { error } = await supabase.from('notes').delete().in('id', selectedIds);
      if (error) throw error;

      setNotes(prev => prev.filter(note => !selectedIds.includes(note.id)));
      setSelectedIds([]);
      router.refresh();
    } catch (error) {
      alert('Error deleting multiple notes.');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-4">
        <div>
          <h2 className="text-3xl">Manage Uploaded Notes</h2>
          <p className="mt-1 font-medium text-ink/70">
            Review and delete files from your repository.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleMultiDelete}
              disabled={isDeleting}
              className="nb-btn bg-nb-pink px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-nb"
            >
              {isDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.length})`}
            </button>
          )}
          <Link href="/admin" className="nb-btn bg-nb-blue px-3 py-1.5 text-sm">
            ← Back to Upload
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="nb-card bg-white py-10 text-center font-bold">
          Loading notes...
        </div>
      ) : notes.length === 0 ? (
        <div className="nb-card border-dashed bg-white py-10 text-center font-bold text-ink/70">
          No notes have been uploaded yet.
        </div>
      ) : (
        <div className="nb-card overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y-2 divide-ink">
              <thead className="bg-nb-yellow">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="h-5 w-5 cursor-pointer accent-ink"
                      checked={notes.length > 0 && selectedIds.length === notes.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-3 text-right text-xs font-extrabold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink bg-white">
                {notes.map((note) => (
                  <tr
                    key={note.id}
                    className={
                      selectedIds.includes(note.id)
                        ? 'bg-nb-yellow/40'
                        : 'hover:bg-nb-yellow/20'
                    }
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <input
                        type="checkbox"
                        className="h-5 w-5 cursor-pointer accent-ink"
                        checked={selectedIds.includes(note.id)}
                        onChange={(e) => handleSelectOne(e, note.id)}
                      />
                    </td>
                    <td className="max-w-[200px] truncate whitespace-nowrap px-6 py-4 text-sm font-bold">
                      <Link
                        href={note.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-2 underline-offset-2 hover:bg-nb-yellow"
                      >
                        {note.title}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-ink/70">
                      {note.subjects?.name || 'Unknown'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className="rounded border-2 border-ink bg-nb-blue px-2 py-0.5 text-xs font-extrabold">
                        {note.unit}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(note.id, note.file_url)}
                        className="nb-btn bg-nb-pink px-3 py-1.5 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}