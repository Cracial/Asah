import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import parser from 'html-react-parser';
import { showFormattedDate } from '../utils';

function NoteItem({ id, title, createdAt, body, onDelete }) {
  return (
    <article className="note-item">
      <div className="note-item__content">
        <h3 className="note-item__title">
          <Link to={`/notes/${id}`}>{title}</Link>
        </h3>
        <p className="note-item__createdAt">{showFormattedDate(createdAt)}</p>
        <div className="note-item__body">{parser(body)}</div>
      </div>
      <div className="note-item__action">
        <Link to={`/notes/${id}/edit`} className="action-edit">
          Edit
        </Link>
        {onDelete && (
          <button 
            type="button" 
            className="action-delete" 
            onClick={() => onDelete(id)}
          >
            Hapus
          </button>
        )}
      </div>
    </article>
  );
}

NoteItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};

export default NoteItem;