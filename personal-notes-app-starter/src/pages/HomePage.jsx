import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import NoteList from '../components/NoteList';
import SearchBar from '../components/SearchBar';
import { getActiveNotes, deleteNote } from '../utils/local-data';

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('title') || '';
  
  // Gunakan state agar re-render terpicu saat menghapus
  const [notes, setNotes] = useState(getActiveNotes());

  function onDeleteHandler(id) {
    deleteNote(id);
    setNotes(getActiveNotes()); // Perbarui state dengan data terbaru
  }

  function onKeywordChangeHandler(newKeyword) {
    setSearchParams(newKeyword ? { title: newKeyword } : {});
  }

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <section className="homepage">
      <h2>Catatan Aktif</h2>
      <SearchBar keyword={keyword} keywordChange={onKeywordChangeHandler} />
      <NoteList 
        notes={filteredNotes} 
        emptyMessage="Tidak ada catatan" 
        onDelete={onDeleteHandler} 
      />
    </section>
  );
}

export default HomePage;