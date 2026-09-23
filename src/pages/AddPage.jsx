import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addNote } from '../utils/local-data';

function AddPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();

  function onSubmitHandler(e) {
    e.preventDefault();
    addNote({ title, body });
    navigate('/');
  }

  return (
    <section className="add-new-page">
      <h2>Tambah Catatan Baru</h2>
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
          onInput={(e) => setBody(e.target.innerHTML)}
        />
        <button type="submit" className="add-new-page__action">
          Simpan
        </button>
      </form>
    </section>
  );
}

export default AddPage;