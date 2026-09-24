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
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-4">
        <div>
          <h2 className="text-3xl">Admin Dashboard</h2>
          <p className="mt-1 font-medium text-ink/70">
            Upload new notes, PDFs, or PPTs to Sem 5 Notes.
          </p>
        </div>
        <Link href="/" className="nb-btn bg-nb-blue px-3 py-1.5 text-sm">
          View Live Site →
        </Link>
      </div>

      <div className="nb-card bg-nb-yellow/30 p-6">
        <UploadForm subjects={subjects || []} />
      </div>
    </div>
  );
}