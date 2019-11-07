import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import InputField from '../../inputs/InputField.jsx';
import DropdownMenu from '../../inputs/DropdownMenu.jsx';


const NewProgramEvent = props => {
  const [status, setStatus] = useState('waiting');
  const [sponsors, setSponsors] = useState([]);
  const [rom, setRom] = useState([]);
  const [bedriftID, changeSponsor] = useState(0);
  const [navn, changeName] = useState('');
  const [beskrivelse, changeDescription] = useState('');
  const [klokkeslett, changeTime] = useState('00:00');
  const [romID, changeRoom] = useState(0);

  useEffect(()=>{
    const internal = async () => {
      const { arrangementID } = props;
      const token = localStorage.getItem('token');
      const req = {
        method: 'POST',
        body: JSON.stringify({
          token,
          arrangementID
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const res = await fetch('/db/preCreateProgram', req);
      const j = await res.json();
      console.log(j);
      const { status, sponsors, rom } = j;
      if(status === 'succeeded') {
        setSponsors(sponsors);
        setRom(rom);
        setStatus('ready');
      } else {
        setStatus(status);
      }
    };
    internal();
  })


  const submit = async () => {
    const token = localStorage.getItem('token');
    const { bedriftID, navn, beskrivelse, klokkeslett, romID } = this.state;
    const { arrangementID } = this.props;
    const req = {
      method: 'POST',
      body: JSON.stringify({
        token,
        bedriftID: bedriftID || null,
        arrangementID,
        navn,
        beskrivelse,
        klokkeslett,
        romID
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const res = await fetch('/db/createProgramEvent', req);
    const { status } = await res.json();
    setStatus(status);
  }

  if(status === 'waiting') {
    return (
      <div>
        <h1>Lag ny programhendelse</h1>
        <p>Laster inn</p>
      </div>
    );
  }
  if(status === 'denied') {
    return <Redirect to="/admin" />;
  }
  if(status === 'succeeded') {
    return <Redirect to={`/admin/event?id=${this.props.arrangementID}`} />;
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
      <InputField
        type="text" 
        label="Navn: "
        val={navn}
        updateValue={changeName}
      />
      <InputField
        type="text"
        label="Beskrivelse: "
        val={beskrivelse}
        updateValue={changeDescription}
      />
      <InputField
        type="time"
        label="Klokkeslett: "
        val={klokkeslett}
        updateValue={changeTime}
      />
      <DropdownMenu
        defaultValue={0}
        defaultOption="Rom"
        value={romID}
        onChange={changeRoom}
        options={rom}
        valueField="romID"
        displayField="navn"
      />
      <button type="button" onClick={submit}>Lag hendelse</button>
    </div>
  )
}

export default NewProgramEvent;
