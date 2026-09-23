import { supabase } from '@/lib/supabase';
import UploadForm from '@/components/UploadForm';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminPage() {
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name')
    .order('name', { ascending: true });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-500 mt-1">Upload new notes, PDFs, or PPTs to Sem 5 Notes.</p>
        </div>
        <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">
          View Live Site →
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <UploadForm subjects={subjects || []} />
      </div>
    </div>
  );
}