import { supabase } from '@/lib/supabase';
import SubjectNoteList from '@/components/SubjectNoteList';
import Link from 'next/link';

export const revalidate = 0;

export default async function SubjectPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const { data: subject } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', id)
    .single();

  const { data: notes } = await supabase
    .from('notes')
    .select('*')
    .eq('subject_id', id)
    .order('created_at', { ascending: false });

  if (!subject) {
    return (
      <div className="text-center py-10 bg-red-50 text-red-600 rounded-lg">
        Subject nahi mila. Link check karein.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/" className="text-gray-500 hover:text-blue-600 transition font-medium">
          ← Back to Subjects
        </Link>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <span>{subject.icon}</span> {subject.name} Notes
        </h2>
      </div>

      {(!notes || notes.length === 0) ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">Is subject ke liye abhi koi notes upload nahi hue hain.</p>
        </div>
      ) : (
        <SubjectNoteList initialNotes={notes} />
      )}
    </div>
  );
}