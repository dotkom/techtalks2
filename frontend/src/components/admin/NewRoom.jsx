import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { post } from '../../utils/apiCalls.js';
import InputField from '../inputs/InputField.jsx';

const NewRoom = (props) => {
  const [name, changeName] = useState('');
  const [building, changeBuilding] = useState('');
  const [mazemap, changeMazemap] = useState('');
  const [status, changeStatus] = useState('waiting');

  const submit = async () => {
    const token = localStorage.getItem('token');
    const req = {
      body: JSON.stringify({
        token,
        name,
        mazemap,
        building,
      }),
    };
    const res = await post('/db/newRoom', req);
    const j = await res.json();
    changeStatus(j.status);
  };

  if (status === 'denied') {
    return <Redirect to="/admin" />;
  }
  if (status === 'succeeded') {
    return <Redirect to="/admin/rooms" />;
  }
  return (
    <div>
      <h1>Create new room</h1>
      <InputField id="rNameIn" label="Romnavn: " val={name} type="text" updateValue={changeName} />
      <InputField id="buildIn" label="Bygning: " val={building} type="text" updateValue={changeBuilding} />
      <InputField id="mazeIn" label="Mazemap URL: " val={mazemap} type="text" updateValue={changeMazemap} />
      <button type="button" onClick={submit}>
        Lag rom
      </button>
    </div>
  );
};

export default NewRoom;
