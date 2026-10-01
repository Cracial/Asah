import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function NoteItem({ id, title, createdAt, body }) {
  const formattedDate = new Date(createdAt).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="note-item">
      <h3 className="note-item__title">
        <Link to={`/notes/${id}`}>{title}</Link>
      </h3>
      <p className="note-item__createdAt">{formattedDate}</p>
      <p className="note-item__body">{body}</p>
    </article>
  );
}

NoteItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default NoteItem;