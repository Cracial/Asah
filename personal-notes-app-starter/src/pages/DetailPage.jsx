import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import parser from 'html-react-parser';
import { getNote, deleteNote, archiveNote, unarchiveNote } from '../utils/local-data';
import { showFormattedDate } from '../utils';

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const note = getNote(id);

  if (!note) {
    return <p>Catatan tidak ditemukan!</p>;
  }

  function handleDelete() {
    deleteNote(id);
    navigate('/');
  }

  function handleArchiveToggle() {
    if (note.archived) {
      unarchiveNote(id);
      navigate('/archives');
    } else {
      archiveNote(id);
      navigate('/');
    }
  }

  return (
    <section className="detail-page">
      <h3 className="detail-page__title">{note.title}</h3>
      <p className="detail-page__createdAt">{showFormattedDate(note.createdAt)}</p>
      <div className="detail-page__body">{parser(note.body)}</div>
      <div className="detail-page__action">
        <button type="button" onClick={handleArchiveToggle}>
          {note.archived ? 'Pindahkan' : 'Arsipkan'}
        </button>
        <Link to={`/notes/${id}/edit`}>
          <button type="button" style={{ backgroundColor: '#0284c7', color: '#fff' }}>
            Edit
          </button>
        </Link>
        <button type="button" onClick={handleDelete}>
          Hapus
        </button>
      </div>
    </section>
  );
}

export default DetailPage;