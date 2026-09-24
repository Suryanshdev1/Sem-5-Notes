'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Subject {
  id: string;
  name: string;
}

export default function UploadForm({ subjects }: { subjects: Subject[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData(e.currentTarget);
    const files = formData.getAll('files') as File[];
    const subjectId = formData.get('subject_id') as string;

    if (!files.length || !subjectId) {
      setMessage({ text: 'Subject and files are required.', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      // Loop lagakar sabhi files ko ek-ek karke upload karna
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const originalName = file.name.replace(`.${fileExt}`, '');
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${subjectId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('notes-files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('notes-files')
          .getPublicUrl(filePath);

        // Database me original file name ko as a title save karna
        const { error: dbError } = await supabase.from('notes').insert({
          subject_id: subjectId,
          unit: 'General', // Database schema satisfy karne ke liye default value
          title: originalName,
          file_url: publicUrlData.publicUrl,
          file_type: fileExt?.toUpperCase() || 'UNKNOWN',
        });

        if (dbError) throw dbError;
      }

      setMessage({ text: 'All files uploaded successfully! ✅', type: 'success' });
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (error: any) {
      setMessage({ text: error.message || 'Upload failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {message.text && (
        <div
          className={`rounded-lg border-2 border-ink p-3 text-sm font-bold shadow-nb-sm ${
            message.type === 'error' ? 'bg-nb-pink' : 'bg-nb-green'
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-extrabold uppercase tracking-wide">
          Subject
        </label>
        <select name="subject_id" className="nb-input cursor-pointer" required>
          <option value="">Select a subject...</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-extrabold uppercase tracking-wide">
          Upload Files
        </label>
        {/* 'multiple' attribute add kiya gaya aur name ko 'files' kar diya gaya */}
        <input
          type="file"
          name="files"
          multiple
          accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.png"
          className="nb-input cursor-pointer file:mr-4 file:cursor-pointer file:rounded-md file:border-2 file:border-ink file:bg-nb-yellow file:px-3 file:py-1 file:text-sm file:font-bold file:text-ink"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="nb-btn w-full bg-nb-green py-3 text-base disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-nb"
      >
        {loading ? 'Uploading files...' : 'Upload Notes'}
      </button>
    </form>
  );
}