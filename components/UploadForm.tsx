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
        <div className={`p-3 rounded-md text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
        <select name="subject_id" className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:outline-none" required>
          <option value="">Select a subject...</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Files</label>
        {/* 'multiple' attribute add kiya gaya aur name ko 'files' kar diya gaya */}
        <input 
          type="file" 
          name="files" 
          multiple
          accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.png" 
          className="w-full border-gray-300 rounded-lg p-2 border file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" 
          required 
        />
      </div>

      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
        {loading ? 'Uploading files...' : 'Upload Notes'}
      </button>
    </form>
  );
}