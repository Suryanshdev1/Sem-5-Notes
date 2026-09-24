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
      <div className="nb-card bg-nb-pink py-10 text-center font-bold">
        Subject nahi mila. Link check karein.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8 space-y-4">
        <Link href="/" className="nb-btn bg-white px-3 py-1.5 text-sm">
          ← Back to Subjects
        </Link>
        <h2 className="flex items-center gap-3 text-3xl sm:text-4xl">
          <span className="nb-icon h-12 w-12 bg-nb-yellow text-2xl">
            {subject.icon || '📘'}
          </span>
          {subject.name} Notes
        </h2>
      </div>

      {(!notes || notes.length === 0) ? (
        <div className="nb-card border-dashed bg-white py-16 text-center">
          <p className="font-bold text-ink/70">
            Is subject ke liye abhi koi notes upload nahi hue hain.
          </p>
        </div>
      ) : (
        <SubjectNoteList initialNotes={notes} />
      )}
    </div>
  );
}