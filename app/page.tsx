import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const revalidate = 0; // Dynamic data ke liye caching disable karna

// Full class names on purpose: Tailwind can't detect classes built dynamically
const COLORS = [
  { card: 'bg-nb-green', tab: 'bg-nb-green' },
  { card: 'bg-nb-yellow', tab: 'bg-nb-yellow' },
  { card: 'bg-nb-pink', tab: 'bg-nb-pink' },
  { card: 'bg-nb-purple', tab: 'bg-nb-purple' },
  { card: 'bg-nb-orange', tab: 'bg-nb-orange' },
  { card: 'bg-nb-blue', tab: 'bg-nb-blue' },
];

export default async function Home() {
  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return (
      <div className="nb-card bg-nb-pink py-10 text-center font-bold">
        Subjects load karne mein error aayi. Database connection check karo.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="space-y-3 text-center">
        <h2 className="text-4xl leading-tight sm:text-5xl">
          Because your GPA
          <br />
          is currently fucked.
        </h2>
        <p className="font-medium text-ink/70">
          Access all your PDFs, PPTs, and notes
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {subjects?.map((subject, i) => {
          const color = COLORS[i % COLORS.length];
          return (
            <Link
              href={`/subject/${subject.id}`}
              key={subject.id}
              className="group relative block pt-3 transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1"
            >
              {/* folder tab */}
              <div
                className={`absolute left-4 top-0 h-4 w-16 rounded-t-md border-2 border-b-0 border-ink ${color.tab}`}
              />

              <div
                className={`nb-card relative p-4 group-hover:shadow-nb-lg group-active:shadow-none ${color.card}`}
              >
                <div className="flex items-start justify-between">
                  <span className="nb-icon bg-white/70 text-2xl">
                    {subject.icon || '📘'}
                  </span>
                  <span className="rounded border-2 border-ink bg-white px-1.5 py-0.5 text-xs font-bold">
                    Open →
                  </span>
                </div>
                <h3 className="mt-6 text-xl">{subject.name}</h3>
                <p className="mt-1 text-sm font-semibold text-ink/70">View notes</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}