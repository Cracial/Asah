import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { getArchivedNotes } from '../utils/network-data';
import NoteList from '../components/NoteList';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';

function ArchivalPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [notes, setNotes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [keyword, setKeyword] = React.useState(searchParams.get('keyword') || '');

  React.useEffect(() => {
    getArchivedNotes().then(({ data }) => {
      setNotes(data);
      setLoading(false);
    });
  }, []);

  function onKeywordChangeHandler(newKeyword) {
    setKeyword(newKeyword);
    setSearchParams({ keyword: newKeyword });
  }

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <section className="archives-page">
      <h2>Catatan Terarsip</h2>
      <SearchBar keyword={keyword} keywordChange={onKeywordChangeHandler} />
      {loading ? <Loading /> : <NoteList notes={filteredNotes} />}
    </section>
  );
}

export default ArchivalPage;