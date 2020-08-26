import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { post, get } from '../../../utils/apiCalls.js';

import InputField from '../../inputs/InputField.jsx';
import DropdownMenu from '../../inputs/DropdownMenu.jsx';

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

      get(`/admin/program/${arrangementID}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong');
          }
        })
        .then(({ sponsors, rom }) => {
          setSponsors(sponsors);
          setRom(rom);
          setStatus('ready');
        });
    };
    internal();
  }, [props]);

  const submit = async () => {
    const { arrangementID } = props;
    const req = {
      body: JSON.stringify({
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
    await post('/admin/program/events', req).then((response) => {
      if (response.ok) {
        setStatus('success');
      }
    });
  };

  if (status === 'waiting') {
    return (
      <div>
        <h1>Lag ny programhendelse</h1>
        <p>Laster inn</p>
      </div>
    );
  }
  if (status === 'success') {
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
