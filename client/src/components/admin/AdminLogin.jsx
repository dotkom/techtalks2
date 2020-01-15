import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { post } from '../../utils/apiCalls.js';
import InputField from '../inputs/InputField';

const AdminLogin = props => {
  const [username, changeUsername] = useState('');
  const [password, changePass] = useState('');
  const [status, setStatus] = useState('waiting');

  // make sure admin isn't already logged in
  useEffect(()=>{
    const internal = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const req = {
          body: JSON.stringify({
            token,
          }),
        };
        const res = await post('/db/isAdminLoggedIn', req);
        const j = await res.json();
        const { loggedIn } = j;
        if (loggedIn === 'y') {
          setStatus('succeeded');
        }
      }
    };
    internal();
  }, [])

  
  const login = async () => {
    const req = {
      body: JSON.stringify({
        username,
        password,
      })
    };
    const res = await post('/db/adminLogin', req);
    const j = await res.json();
    const { token, status } = j;
    if (status === 'succeeded') {
      localStorage.setItem('token', token);
    }
    setStatus(status);
  }
  if (status === 'succeeded') {
    return <Redirect to="/admin/main" />;
  }
  return (
    <div>
      <h1>Sup, wanna login?</h1>
      <InputField
        updateValue={changeUsername}
        label="Brukernavn: "
        id="adminUsername"
        val={username}
        type="text"
      />
      <InputField updateValue={changePass} label="Passord: " id="adminPass" val={password} type="password" />
      {status === 'invalid' ? <p>Invalid login credentials</p> : null}
      <button type="button" onClick={login}>
        Attempt hack
      </button>
    </div>
  );
};

export default AdminLogin;
