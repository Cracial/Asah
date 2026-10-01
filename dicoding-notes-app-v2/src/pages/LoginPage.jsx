import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useInput from '../hooks/useInput';
import { login } from '../utils/network-data';

function LoginPage({ loginSuccess }) {
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const { error, data } = await login({ email, password });
    if (!error) {
      loginSuccess(data);
    }
  };

  return (
    <section className="login-page">
      <h2>Yuk, login untuk menggunakan aplikasi.</h2>
      <form onSubmit={onSubmitHandler} className="input-login">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={onEmailChange} required />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={onPasswordChange} required />

        <button type="submit">Login</button>
      </form>
      <p>Belum punya akun? <Link to="/register">Daftar di sini</Link></p>
    </section>
  );
}

LoginPage.propTypes = {
  loginSuccess: PropTypes.func.isRequired,
};

export default LoginPage;