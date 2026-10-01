import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getUserLogged, putAccessToken } from './utils/network-data';
import ThemeContext from './contexts/ThemeContext';
import LocaleContext from './contexts/LocaleContext';

import Navigation from './components/Navigation';
import Loading from './components/Loading';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ArchivalPage from './pages/ArchivalPage';
import AddPage from './pages/AddPage';
import DetailPage from './pages/DetailPage';
import EditPage from './pages/EditPage'; // <-- Import EditPage
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const [authedUser, setAuthedUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [locale, setLocale] = useState(localStorage.getItem('locale') || 'id');

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  const toggleLocale = () => {
    setLocale((prevLocale) => {
      const newLocale = prevLocale === 'id' ? 'en' : 'id';
      localStorage.setItem('locale', newLocale);
      return newLocale;
    });
  };

  const themeContextValue = useMemo(() => ({ theme, toggleTheme }), [theme]);
  const localeContextValue = useMemo(() => ({ locale, toggleLocale }), [locale]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    async function fetchUser() {
      const { data } = await getUserLogged();
      setAuthedUser(data);
      setInitializing(false);
    }
    fetchUser();
  }, []);

  const onLoginSuccess = async ({ accessToken }) => {
    putAccessToken(accessToken);
    const { data } = await getUserLogged();
    setAuthedUser(data);
  };

  const onLogout = () => {
    setAuthedUser(null);
    putAccessToken('');
  };

  if (initializing) {
    return <Loading />;
  }

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <LocaleContext.Provider value={localeContextValue}>
        <div className="app-container">
          <Navigation
            name={authedUser ? authedUser.name : null}
            logout={onLogout}
            theme={theme}
            toggleTheme={toggleTheme}
            locale={locale}
            toggleLocale={toggleLocale}
          />
          <main>
            {authedUser === null ? (
              <Routes>
                <Route path="/*" element={<LoginPage loginSuccess={onLoginSuccess} />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            ) : (
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/archives" element={<ArchivalPage />} />
                <Route path="/notes/new" element={<AddPage />} />
                <Route path="/notes/:id" element={<DetailPage />} />
                <Route path="/notes/:id/edit" element={<EditPage />} /> {/* <-- Route Edit Catatan */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            )}
          </main>
        </div>
      </LocaleContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;