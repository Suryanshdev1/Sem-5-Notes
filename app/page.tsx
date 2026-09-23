import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const revalidate = 0; // Dynamic data ke liye caching disable karna

export default async function Home() {
  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return (
      <div className="text-red-500 text-center py-10 bg-red-50 rounded-lg">
        Subjects load karne mein error aayi. Database connection check karo.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Select Subject</h2>
        <p className="text-gray-500">Access all your PDFs, PPTs, and notes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects?.map((subject) => (
          <Link 
            href={`/subject/${subject.id}`} 
            key={subject.id}
            className="block p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow hover:border-blue-300 active:scale-95 duration-200"
          >
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{subject.icon}</span>
              <div>
                <h3 className="text-lg font-semibold">{subject.name}</h3>
                <p className="text-sm text-gray-500 mt-1">View notes →</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}