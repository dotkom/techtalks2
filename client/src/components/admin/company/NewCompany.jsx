import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { post } from '../../../utils/apiCalls.js';
import InputField from '../../inputs/InputField';

const NewCompany = props => {
  const [name, changeName] = useState('');
  const [logo, changeLogo] = useState('');
  const [isSponsor, changeSponsorship] = useState(false);
  const [status, setStatus] = useState('');

  const submitCompany = async () => {
    const token = localStorage.getItem('token');
    const req = {
      body: JSON.stringify({
        token,
        navn: name,
        logo,
        isSponsor,
      })
    };
    setStatus('waiting',);
    const res = await post('/db/newCompany', req);
    const j = await res.json();
    const { status } = j;
    setStatus(status);
  }
  if (status === 'denied') {
    return <Redirect to="/admin" />;
  }

  if (status === 'succeeded') {
    return <Redirect to="/admin/companies" />;
  }
  return (
    <div>
      <InputField label="Navn: " id="cName" val={name} updateValue={changeName} type="text" />
      <InputField label="Logo: " id="cLogo" val={logo} updateValue={changeLogo} type="text" />
      <label htmlFor="cSpons">
        Sponsor
        <input type="checkbox" id="cSpons" checked={isSponsor} onChange={e=>changeSponsorship(e.target.checked)} />
      </label>
      <button type="button" onClick={submitCompany}>
        Lag selskap
      </button>
      {status === 'failed' ? <p>Kunne ikke opprette selskapet</p> : null}
    </div>
  );
}

export default NewCompany;
