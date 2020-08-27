import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { post } from '../../../utils/apiCalls.js';

import InputField from '../../inputs/InputField.jsx';
import DropdownMenu from '../../inputs/DropdownMenu.jsx';
import DropdownRange from '../../inputs/DropdownRange.jsx';

const NewProgramEvent = (props) => {
  const [status, setStatus] = useState('waiting');
  const [sponsors, setSponsors] = useState([]);
  const [rom, setRom] = useState([]);
  const [bedriftID, changeSponsor] = useState(0);
  const [navn, changeName] = useState('');
  const [beskrivelse, changeDescription] = useState('');
  const [klokkeslett, changeTime] = useState('13:00');
  const [romID, changeRoom] = useState(0);
  const [parallell, setParallell] = useState(1);
  const [alleParalleller, setAlleParalleller] = useState(false);
  const [varighet, setVarighet] = useState(1);

  useEffect(() => {
    const internal = async () => {
      const { arrangementID } = props;
      const token = localStorage.getItem('token');
      const req = {
        body: JSON.stringify({
          token,
          arrangementID,
        }),
      };
      const res = await post('/db/preCreateProgram', req);
      const j = await res.json();
      const { status, sponsors, rom } = j;
      if (status === 'succeeded') {
        setSponsors(sponsors);
        setRom(rom);
        setStatus('ready');
      } else {
        setStatus(status);
      }
    };
    internal();
  }, [props]);

  const submit = async () => {
    const token = localStorage.getItem('token');
    const { arrangementID } = props;
    const req = {
      body: JSON.stringify({
        token,
        bedriftID: bedriftID || null,
        arrangementID,
        navn,
        beskrivelse,
        klokkeslett: `${klokkeslett}`,
        romID,
        parallell,
        alleParalleller,
        varighet,
      }),
    };
    const res = await post('/db/createProgramEvent', req);
    const { status } = await res.json();
    setStatus(status);
  };

  if (status === 'waiting') {
    return (
      <div>
        <h1>Lag ny programhendelse</h1>
        <p>Laster inn</p>
      </div>
    );
  }
  if (status === 'denied') {
    return <Redirect to="/admin" />;
  }
  if (status === 'succeeded') {
    return <Redirect to={`/admin/event?id=${props.arrangementID}`} />;
  }
  // might add some feedback on fail
  return (
    <div>
      <h1>Lag ny programhendelse</h1>
      <DropdownMenu
        defaultValue={0}
        defaultOption="Tilknyttet sponsor?"
        value={bedriftID}
        onChange={changeSponsor}
        options={sponsors}
        valueField="BedriftID"
        displayField="navn"
      />
      <InputField type="text" label="Navn: " val={navn} updateValue={changeName} />
      <InputField type="textarea" label="Beskrivelse: " val={beskrivelse} updateValue={changeDescription} />
      <InputField type="text" label="Klokkeslett: " val={klokkeslett} updateValue={changeTime} />
      <InputField type="number" label="Parallell: " val={parallell} updateValue={setParallell} />
      <InputField type="number" label="Varighet: " val={varighet} updateValue={setVarighet} />
      <InputField type="checkbox" label="Alle paralleller? " val={alleParalleller} updateValue={setAlleParalleller} />
      <DropdownMenu
        defaultValue={0}
        defaultOption="Rom"
        value={romID}
        onChange={changeRoom}
        options={rom}
        valueField="romID"
        displayField="navn"
      />
      <button type="button" onClick={submit}>
        Lag hendelse
      </button>
    </div>
  );
};

export default NewProgramEvent;
