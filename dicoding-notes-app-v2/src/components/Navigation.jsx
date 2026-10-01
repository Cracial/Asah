import React from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineArchive, MdGTranslate, MdDarkMode, MdWbSunny } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';

function Navigation({ name, logout, theme, toggleTheme, locale, toggleLocale }) {
  return (
    <header>
      <div className="navigation-container">
        <h1>
          <Link to="/">{locale === 'id' ? 'Aplikasi Catatan' : 'Notes App'}</Link>
        </h1>

        <div className="nav-actions">
          {/* Fitur / Tombol untuk melihat Catatan Terarsip */}
          {name && (
            <Link to="/archives" className="nav-link" title="Terarsip">
              <MdOutlineArchive size={22} />
              <span>{locale === 'id' ? 'Terarsip' : 'Archived'}</span>
            </Link>
          )}

          {/* Tombol Ubah Bahasa */}
          <button className="toggle-locale" onClick={toggleLocale} title="Ubah Bahasa">
            <MdGTranslate size={20} />
          </button>

          {/* Tombol Ubah Tema */}
          <button className="toggle-theme" onClick={toggleTheme} title="Ubah Tema">
            {theme === 'dark' ? <MdWbSunny size={20} /> : <MdDarkMode size={20} />}
          </button>

          {/* Tombol Logout */}
          {name && (
            <button className="button-logout" onClick={logout} title="Logout">
              <FiLogOut size={18} />
              <span>{name}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navigation;