'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import Link from 'next/link';

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

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const { data } = await supabase
      .from('notes')
      .select('id, title, unit, file_url, subjects(name)')
      .order('created_at', { ascending: false });
      
    // Type casting to handle Supabase's returned join structure
    setNotes((data as unknown as Note[]) || []);
    setLoading(false);
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    const confirmDelete = window.confirm('Are you sure you want to permanently delete this note?');
    if (!confirmDelete) return;

    try {
      // 1. Extract file path from public URL to delete from Storage
      const urlParts = fileUrl.split('/notes-files/');
      if (urlParts.length === 2) {
        const filePath = urlParts[1];
        await supabase.storage.from('notes-files').remove([filePath]);
      }

      // 2. Delete the record from PostgreSQL database
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) throw error;

      // 3. Update UI
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      alert('Error deleting note. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Uploaded Notes</h2>
          <p className="text-gray-500 mt-1">Review and delete files from your repository.</p>
        </div>
        <Link href="/admin" className="text-sm font-medium text-blue-600 hover:underline">
          ← Back to Upload
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
          No notes have been uploaded yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notes.map((note) => (
                <tr key={note.id} className="hover:bg-gray-50">
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
      )}
    </div>
  );
}