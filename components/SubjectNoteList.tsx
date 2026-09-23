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
      <div className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
        <input
          type="text"
          placeholder="Search by topic, e.g. Normalization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border-gray-300 rounded-lg p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        
        <div className="flex flex-wrap gap-2">
          {units.map(unit => (
            <button
              key={unit}
              onClick={() => setSelectedUnit(unit)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedUnit === unit 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {unit}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">No notes found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}