import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, NotebookPen, Info } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  body: string;
  updatedAt: string;
}

const STORAGE_KEY = 'ma_industries_field_notes';

export function NotesTab() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [saved, setSaved] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Note[] = JSON.parse(stored);
        setNotes(parsed);
        if (parsed.length > 0) {
          setSelectedId(parsed[0].id);
          setEditTitle(parsed[0].title);
          setEditBody(parsed[0].body);
        }
      }
    } catch (e) {
      console.warn('Failed to load notes from localStorage');
    }
  }, []);

  const persist = (updated: Note[]) => {
    setNotes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const selectNote = (note: Note) => {
    setSelectedId(note.id);
    setEditTitle(note.title);
    setEditBody(note.body);
    setSaved(false);
  };

  const newNote = () => {
    const note: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      body: '',
      updatedAt: new Date().toLocaleDateString('en-GB'),
    };
    const updated = [note, ...notes];
    persist(updated);
    selectNote(note);
  };

  const saveNote = () => {
    const updated = notes.map(n =>
      n.id === selectedId
        ? { ...n, title: editTitle, body: editBody, updatedAt: new Date().toLocaleDateString('en-GB') }
        : n
    );
    persist(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deleteNote = () => {
    if (!selectedId) return;
    const updated = notes.filter(n => n.id !== selectedId);
    persist(updated);
    if (updated.length > 0) {
      selectNote(updated[0]);
    } else {
      setSelectedId(null);
      setEditTitle('');
      setEditBody('');
    }
  };

  return (
    <div className="flex flex-col pb-20 max-w-3xl mx-auto">
      {/* Device Storage Advisory */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-800">
        <Info size={16} className="flex-shrink-0 mt-0.5 text-amber-600" />
        <span>
          <strong>Notes are stored privately on this device.</strong> They are not synced to any server or visible to others. Clearing your browser data will erase them.
        </span>
      </div>

      <div className="flex gap-4 h-[calc(100vh-300px)] min-h-[400px]">
        {/* Notes Sidebar */}
        <div className="w-44 flex-shrink-0 flex flex-col gap-2">
          <button
            onClick={newNote}
            className="w-full flex items-center justify-center gap-1 bg-[#2E7D32] text-white py-2 rounded-xl font-bold text-sm hover:bg-green-700 transition shadow-sm"
          >
            <Plus size={16} /> New Note
          </button>
          <div className="flex-1 overflow-y-auto space-y-1.5">
            {notes.length === 0 && (
              <div className="text-center text-gray-400 text-xs mt-4 px-2">
                <NotebookPen size={28} className="mx-auto mb-2 opacity-40" />
                No notes yet. Tap "New Note" to start.
              </div>
            )}
            {notes.map(n => (
              <button
                key={n.id}
                onClick={() => selectNote(n)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition border ${
                  selectedId === n.id
                    ? 'bg-[#2E7D32] text-white border-green-700 shadow-md'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-bold truncate">{n.title}</div>
                <div className={`text-[10px] mt-0.5 ${selectedId === n.id ? 'text-green-100' : 'text-gray-400'}`}>{n.updatedAt}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Note Editor */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {selectedId ? (
            <>
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
                placeholder="Note title..."
              />
              <textarea
                value={editBody}
                onChange={e => setEditBody(e.target.value)}
                className="flex-1 w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none leading-relaxed"
                placeholder="Start typing your field notes here...

e.g. Plot boundary notes, measurements, khasra numbers, owner details, next steps..."
              />
              <div className="flex gap-2">
                <button
                  onClick={saveNote}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm ${
                    saved ? 'bg-green-500 text-white' : 'bg-[#2E7D32] text-white hover:bg-green-700'
                  }`}
                >
                  <Save size={16} /> {saved ? 'Saved ✓' : 'Save Note'}
                </button>
                <button
                  onClick={deleteNote}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 font-bold text-sm hover:bg-red-100 transition"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center text-gray-400">
              <div>
                <NotebookPen size={48} className="mx-auto mb-3 opacity-30" />
                <p className="font-semibold">Select or create a note to get started.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
