import Link from 'next/link';

interface Note {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
  created_at: string;
}

export default function NoteCard({ note }: { note: Note }) {
  const date = new Date(note.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Supabase URL par ?download lagane se file seedha download ho jati hai
  const downloadUrl = `${note.file_url}?download=`;

  return (
    <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
      <div className="flex justify-between items-start mb-3">
        <span className="inline-block text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md uppercase">
          {note.file_type}
        </span>
        <span className="text-xs text-gray-400 font-medium">{date}</span>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mt-2 mb-4 truncate" title={note.title}>
        {note.title}
      </h3>
      
      <div className="flex gap-3">
        <Link 
          href={note.file_url}
          target="_blank"
          rel="noopener noreferrer" 
          className="flex-1 flex items-center justify-center py-2.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-lg font-semibold transition-colors"
        >
          View
        </Link>
        <a 
          href={downloadUrl}
          className="flex-1 flex items-center justify-center py-2.5 bg-green-50 hover:bg-green-600 hover:text-white text-green-600 rounded-lg font-semibold transition-colors"
        >
          Download
        </a>
      </div>
    </div>
  );
}