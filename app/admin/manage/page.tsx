'use client';

import { supabase } from '@/lib/supabase';
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

  // 2. Multi-select handlers
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

  // 1. Fixed Single Delete
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
      if (error) throw error;

      // Functional state update se React instantly UI refresh karega
      setNotes(prev => prev.filter(note => note.id !== id));
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
      router.refresh(); // Next.js server cache clear karne ke liye
    } catch (error) {
      alert('Error deleting note. Please try again.');
      console.error(error);
    }
  };

  // 2. Multi-Delete Execution
  const handleMultiDelete = async () => {
    if (selectedIds.length === 0) return;
    const confirmDelete = window.confirm(`Kya aap sach mein in ${selectedIds.length} notes ko delete karna chahte hain?`);
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const notesToDelete = notes.filter(n => selectedIds.includes(n.id));
      
      // Storage files delete karo loop mein
      for (const note of notesToDelete) {
        const urlParts = note.file_url.split('/notes-files/');
        if (urlParts.length === 2) {
          const filePath = urlParts[1];
          await supabase.storage.from('notes-files').remove([filePath]);
        }
      }

      // Database se ek sath delete karo
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
      <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Uploaded Notes</h2>
          <p className="text-gray-500 mt-1">Review and delete files from your repository.</p>
        </div>
        <div className="flex items-center gap-4">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleMultiDelete}
              disabled={isDeleting}
              className="text-sm font-medium bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {isDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.length})`}
            </button>
          )}
          <Link href="/admin" className="text-sm font-medium text-blue-600 hover:underline">
            ← Back to Upload
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
          No notes have been uploaded yet.
        </div>
      ) : (
        // 3. overflow-x-auto lagaya mobile par horizontal scroll ke liye
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={notes.length > 0 && selectedIds.length === notes.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notes.map((note) => (
                  <tr key={note.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedIds.includes(note.id)}
                        onChange={(e) => handleSelectOne(e, note.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-[200px]">
                      <a href={note.file_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                        {note.title}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {note.subjects?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded-md">{note.unit}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDelete(note.id, note.file_url)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
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