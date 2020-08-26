import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { post, get } from '../../utils/apiCalls.js';
import InputField from '../inputs/InputField';

const AdminLogin = (props) => {
  const [username, changeUsername] = useState('');
  const [password, changePass] = useState('');
  const [status, setStatus] = useState('waiting');

  // make sure admin isn't already logged in
  useEffect(() => {
    const internal = async () => {
      await get('/admin/is-logged-in')
        .then((response) => {
          if (response.ok) setStatus('success');
        })
        .catch((err) => setStatus('error'));
    };
    internal();
  }, []);

  const login = async () => {
    const req = {
      body: JSON.stringify({
        username,
        password,
      }),
    };
    await post('/admin/login', req)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          throw new Error('unauthorized');
        } else {
          throw new Error('error');
        }
      })
      .then((body) => {
        localStorage.setItem('token', body);
        setStatus('success');
      })
      .catch((err) => {
        if (err.message === 'unauthorized') {
          setStatus('invalid');
        } else {
          setStatus('error');
        }
      });
  };
  if (status === 'success') {
    return <Redirect to="/admin/main" />;
  }
  return (
    <div>
      <h1>Sup, wanna login?</h1>
      <InputField updateValue={changeUsername} label="Brukernavn: " id="adminUsername" val={username} type="text" />
      <InputField updateValue={changePass} label="Passord: " id="adminPass" val={password} type="password" />
      {status === 'invalid' ? <p>Invalid login credentials</p> : null}
      {status === 'error' ? <p>Something went wrong</p> : null}
      <button type="button" onClick={login}>
        Attempt hack
      </button>
    </div>
  );
};

export default AdminLogin;
