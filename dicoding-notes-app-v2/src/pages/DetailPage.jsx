import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getNote, deleteNote, archiveNote, unarchiveNote } from '../utils/network-data';
import { MdDelete, MdArchive, MdUnarchive, MdEdit } from 'react-icons/md';
import Loading from '../components/Loading';
import { showFormattedDate } from '../utils';

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getNote(id).then(({ data }) => {
      setNote(data);
      setLoading(false);
    });
  }, [id]);

  const onDeleteHandler = async () => {
    await deleteNote(id);
    if (note?.archived) {
      navigate('/archives');
    } else {
      navigate('/');
    }
  };

  const onArchiveHandler = async () => {
    await archiveNote(id);
    navigate('/');
  };

  const onUnarchiveHandler = async () => {
    await unarchiveNote(id);
    navigate('/archives');
  };

  if (loading) return <Loading />;
  if (!note) return <p className="detail-page">Catatan tidak ditemukan.</p>;

  return (
    <section className="detail-page">
      <h3 className="detail-page__title">{note.title}</h3>
      <p className="detail-page__createdAt">{showFormattedDate(note.createdAt)}</p>
      <div className="detail-page__body">{note.body}</div>

      <div className="detail-page__action">
        {/* Tombol Edit Catatan */}
        <Link to={`/notes/${id}/edit`} className="action" title="Edit Catatan">
          <MdEdit size={24} />
        </Link>

        {note.archived ? (
          <button className="action" type="button" title="Pindahkan" onClick={onUnarchiveHandler}>
            <MdUnarchive size={24} />
          </button>
        ) : (
          <button className="action" type="button" title="Arsipkan" onClick={onArchiveHandler}>
            <MdArchive size={24} />
          </button>
        )}

        <button className="action action-danger" type="button" title="Hapus" onClick={onDeleteHandler}>
          <MdDelete size={24} />
        </button>
      </div>
    </section>
  );
}

export default DetailPage;