'use client';

import { useState, useMemo } from 'react';
import NoteCard from './NoteCard';

interface Note {
  id: string;
  title: string;
  unit: string;
  file_url: string;
  file_type: string;
  created_at: string;
}

export default function SubjectNoteList({ initialNotes }: { initialNotes: Note[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('All');

  // Extract unique units for filter buttons dynamically
  const units = useMemo(() => {
    const allUnits = initialNotes.map(n => n.unit);
    return ['All', ...Array.from(new Set(allUnits))].sort();
  }, [initialNotes]);

  // Filter notes based on search text and selected unit
  const filteredNotes = useMemo(() => {
    return initialNotes.filter((note) => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesUnit = selectedUnit === 'All' || note.unit === selectedUnit;
      return matchesSearch && matchesUnit;
    });
  }, [initialNotes, searchQuery, selectedUnit]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="nb-card space-y-4 bg-nb-yellow/30 p-4">
        <input
          type="text"
          placeholder="Search by topic, e.g. Normalization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="nb-input p-3"
        />

        <div className="flex flex-wrap gap-2">
          {units.map(unit => (
            <button
              key={unit}
              onClick={() => setSelectedUnit(unit)}
              className={`nb-btn px-3 py-1 text-sm ${
                selectedUnit === unit
                  ? 'bg-ink text-white'
                  : 'bg-white'
              }`}
            >
              {unit}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {filteredNotes.length === 0 ? (
        <div className="nb-card border-dashed bg-white py-16 text-center">
          <p className="font-bold text-ink/70">No notes found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}