import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getActiveNotes } from '../utils/network-data';
import NoteList from '../components/NoteList';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import { MdAdd } from 'react-icons/md';
import LocaleContext from '../contexts/LocaleContext';

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [notes, setNotes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [keyword, setKeyword] = React.useState(searchParams.get('keyword') || '');
  
  // Mengambil konteks bahasa jika ada
  const localeContext = React.useContext(LocaleContext);
  const locale = localeContext ? localeContext.locale : 'id';

  React.useEffect(() => {
    getActiveNotes().then(({ data }) => {
      setNotes(data || []);
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
    <section className="homepage">
      <h2>{locale === 'id' ? 'Catatan Aktif' : 'Active Notes'}</h2>
      
      <SearchBar keyword={keyword} keywordChange={onKeywordChangeHandler} />

      {loading ? (
        <Loading />
      ) : (
        <NoteList notes={filteredNotes} />
      )}

      {/* TOMBOL TAMBAH CATATAN (Floating Action Button dengan Ikon Vektor) */}
      <div className="homepage__action">
        <Link 
          to="/notes/new" 
          className="action" 
          title={locale === 'id' ? 'Tambah Catatan' : 'Add Note'}
        >
          <MdAdd size={28} />
        </Link>
      </div>
    </section>
  );
}

export default HomePage;