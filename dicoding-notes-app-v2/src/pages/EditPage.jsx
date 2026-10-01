import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNote, editNote } from '../utils/network-data';
import { MdCheck } from 'react-icons/md';
import Loading from '../components/Loading';
import LocaleContext from '../contexts/LocaleContext';

function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const localeContext = useContext(LocaleContext);
  const locale = localeContext ? localeContext.locale : 'id';

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNote(id).then(({ data }) => {
      if (data) {
        setTitle(data.title);
        setBody(data.body);
      }
      setLoading(false);
    });
  }, [id]);

  const onTitleChangeHandler = (event) => {
    setTitle(event.target.value);
  };

  const onBodyChangeHandler = (event) => {
    setBody(event.target.value);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    await editNote({ id, title, body });
    navigate('/');
  };

  if (loading) return <Loading />;

  return (
    <section className="add-new-page">
      <h2>{locale === 'id' ? 'Edit Catatan' : 'Edit Note'}</h2>
      <form className="add-new-page__input" onSubmit={onSubmitHandler}>
        <input
          className="add-new-page__input__title"
          type="text"
          placeholder={locale === 'id' ? 'Judul catatan...' : 'Note title...'}
          value={title}
          onChange={onTitleChangeHandler}
          required
        />
        <textarea
          className="add-new-page__input__body"
          placeholder={locale === 'id' ? 'Isi catatan...' : 'Note body...'}
          value={body}
          onChange={onBodyChangeHandler}
          required
        />
        <div className="add-new-page__action">
          <button className="action" type="submit" title={locale === 'id' ? 'Simpan' : 'Save'}>
            <MdCheck size={28} />
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditPage;