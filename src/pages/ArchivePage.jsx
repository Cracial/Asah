import React from 'react';
import { useSearchParams } from 'react-router-dom';
import NoteList from '../components/NoteList';
import SearchBar from '../components/SearchBar';
import { getArchivedNotes } from '../utils/local-data';

function ArchivePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('title') || '';

  const notes = getArchivedNotes().filter((note) =>
    note.title.toLowerCase().includes(keyword.toLowerCase())
  );

  function onKeywordChangeHandler(newKeyword) {
    setSearchParams(newKeyword ? { title: newKeyword } : {});
  }

  return (
    <section className="archive-page">
      <h2>Catatan Terarsip</h2>
      <SearchBar keyword={keyword} keywordChange={onKeywordChangeHandler} />
      <NoteList notes={notes} emptyMessage="Arsip kosong" />
    </section>
  );
}

export default ArchivePage;