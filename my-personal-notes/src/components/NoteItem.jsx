import React from 'react';
import { showFormattedDate } from '../utils';

function NoteItem({ note, onDelete, onArchive }) {
  return (
    <div
      className="note-item"
      data-testid="note-item"
      data-note-id={note?.id}
    >
      <div className="note-item__content" data-testid="note-item-content">
        <h3 className="note-item__title" data-testid="note-item-title">
          {note?.title}
        </h3>
        <p className="note-item__date" data-testid="note-item-date">
          {showFormattedDate(note?.createdAt)}
        </p>
        <p className="note-item__body" data-testid="note-item-body">
          {note?.body}
        </p>
      </div>
      <div className="note-item__action" data-testid="note-item-action">
        <button
          className="note-item__delete-button"
          type="button"
          onClick={() => onDelete(note.id)}
          data-testid="note-item-delete-button"
        >
          Delete
        </button>

        <button
          className="note-item__archive-button"
          type="button"
          onClick={() => onArchive(note.id)}
          data-testid="note-item-archive-button"
        >
          {note?.archived ? 'Pindahkan' : 'Arsip'}
        </button>
      </div>
    </div>
  );
}

export default NoteItem;