import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { post } from '../../../utils/apiCalls.js';

import InputField from '../../inputs/InputField';

const NewEvent = props => {
  const [dato, changeDate] = useState('');
  const [antallPlasser, changePlasser] = useState('');
  const [beskrivelse, changeDesc] = useState('');
  const [påmeldingsStart, changeStart] = useState('');
  const [status, setStatus] = useState('default');

  const submit = async () => {
    setStatus('waiting');
    const token = localStorage.getItem('token');
    const req = {
      body: JSON.stringify({
        dato,
        antallPlasser,
        beskrivelse,
        påmeldingsStart,
        token,
      })
    };
    const res = await post('/db/newEvent', req);
    const j = await res.json();
    const { status } = j;
    setStatus(status);
  }

  if (status === 'denied') {
    return <Redirect to="/admin" />;
  }
  if (status === 'succeeded') {
    return <Redirect to="/admin/events" />;
  }
  return (
    <div>
      <h1>Nytt arrangement</h1>
      <InputField label="Dato: " id="eventDate" val={dato} updateValue={changeDate} type="date" />
      <InputField
        label="Antall plasser: "
        id="eventPlasser"
        val={antallPlasser}
        updateValue={changePlasser}
        type="number"
      />
      <InputField
        label="Beskrivelse: "
        id="eventDesc"
        val={beskrivelse}
        updateValue={changeDesc}
        type="textarea"
      />
      <InputField
        label="Påmeldingsstart: "
        id="eventStart"
        val={påmeldingsStart}
        updateValue={changeStart}
        type="datetime-local"
      />
      <button type="button" onClick={submit}>
        Lag arrangement
      </button>
    </div>
  );
};

export default NewEvent;
