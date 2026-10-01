import React from 'react';
import { useNavigate } from 'react-router-dom';
import { addNote } from '../utils/network-data';

function AddPage() {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');

  const onTitleChange = (event) => setTitle(event.target.value);
  const onBodyInput = (event) => setBody(event.target.innerHTML);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const { error } = await addNote({ title, body });
    if (!error) {
      navigate('/');
    }
  };

  return (
    <section className="add-new-page">
      <form className="add-new-page__input" onSubmit={onSubmitHandler}>
        <input
          className="add-new-page__input__title"
          placeholder="Judul catatan..."
          value={title}
          onChange={onTitleChange}
          required
        />
        <div
          className="add-new-page__input__body"
          data-placeholder="Tuliskan catatanmu di sini..."
          contentEditable
          onInput={onBodyInput}
        />
        <div className="add-new-page__action">
          <button className="action" type="submit" title="Simpan">
            ✓
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddPage;