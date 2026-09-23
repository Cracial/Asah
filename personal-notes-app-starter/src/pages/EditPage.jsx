import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNote, editNote } from '../utils/local-data';

function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const note = getNote(id);

  if (!note) {
    return <p>Catatan tidak ditemukan!</p>;
  }

  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);

  function onSubmitHandler(e) {
    e.preventDefault();
    
    editNote({ id, title, body });
    
    // Alihkan langsung ke halaman utama
    navigate('/');
  }

  return (
    <section className="add-new-page">
      <h2>Edit Catatan</h2>
      <form onSubmit={onSubmitHandler} className="add-new-page__input">
        <input
          className="add-new-page__input__title"
          type="text"
          placeholder="Judul Catatan..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div
          className="add-new-page__input__body"
          data-placeholder="Isi catatan..."
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setBody(e.currentTarget.innerHTML)}
          dangerouslySetInnerHTML={{ __html: note.body }}
        />
        <button type="submit" className="add-new-page__action">
          Simpan Perubahan
        </button>
      </form>
    </section>
  );
}

export default EditPage;