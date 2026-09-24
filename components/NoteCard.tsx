import Link from 'next/link';

interface Note {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
  created_at: string;
}

// Full class names on purpose: Tailwind can't detect classes built dynamically
const TYPE_COLORS: Record<string, string> = {
  PDF: 'bg-nb-pink',
  PPT: 'bg-nb-orange',
  PPTX: 'bg-nb-orange',
  DOC: 'bg-nb-blue',
  DOCX: 'bg-nb-blue',
  JPG: 'bg-nb-purple',
  PNG: 'bg-nb-purple',
};

export default function NoteCard({ note }: { note: Note }) {
  const date = new Date(note.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Supabase URL par ?download lagane se file seedha download ho jati hai
  const downloadUrl = `${note.file_url}?download=`;

  const badgeColor = TYPE_COLORS[note.file_type?.toUpperCase()] || 'bg-nb-yellow';

  return (
    <div className="nb-card nb-card-hover p-5">
      <div className="mb-3 flex items-start justify-between">
        <span
          className={`inline-block rounded border-2 border-ink px-2 py-0.5 text-xs font-extrabold uppercase ${badgeColor}`}
        >
          {note.file_type}
        </span>
        <span className="text-xs font-bold text-ink/60">{date}</span>
      </div>

      <h3 className="mb-4 mt-2 truncate text-lg" title={note.title}>
        {note.title}
      </h3>

      <div className="flex gap-3">
        <Link
          href={note.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="nb-btn flex-1 bg-nb-blue"
        >
          View
        </Link>
        <a href={downloadUrl} className="nb-btn flex-1 bg-nb-green">
          Download
        </a>
      </div>
    </div>
  );
}