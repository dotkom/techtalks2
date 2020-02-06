import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { post } from '../../../utils/apiCalls.js';
import EventInfo from './EventInfo.jsx';
import Sponsors from './Sponsors.jsx';
import Participants from './Participants.jsx';
import Program from './Program.jsx';
import ExternalParticipants from './ExternalParticipants.jsx';


const Event = props => {
  const [status, setStatus] = useState('waiting');
  const [sponsors, setSponsors] = useState([]);
  const [program, setProgram] = useState([]);
  const [event, setEvent] = useState({Beskrivelse:'',Dato:null,AntallPlasser:0,AntallPåmeldte:0,Link:'',PaameldingsStart:''});
  const [deltagere, setDeltagere] = useState([]);
  const [showEvent, setShowEvent] = useState(false);
  const [showSponsors, setShowSponsors] = useState(false);
  const [showDeltagere, setShowDeltagere] = useState(false);
  const [showProgram, setShowProgram] = useState(false);
  const [showExternalParticipants, setShowExternalParticipants] = useState(false);

  const toggleEvent = () => setShowEvent(!showEvent);
  const toggleSponsors = () => setShowSponsors(!showSponsors);
  const toggleDeltagere = () => setShowDeltagere(!showDeltagere);
  const toggleProgram = () => setShowProgram(!showProgram);
  const toggleExternalParticipants = () => setShowExternalParticipants(!showExternalParticipants);

  const slettDeltager = async (PaameldingsHash) => {
    const token = localStorage.getItem('token');
    const req = {
      body: JSON.stringify({
        PaameldingsHash,
        token
      })
    };
    const res = await post('/db/deleteParticipant', req);
    const j = await res.json();
    const { status } = j;
    if(status === 'succeeded') {
      setDeltagere(deltagere.filter(deltager => deltager.PaameldingsHash !== PaameldingsHash));
    }
  }

  useEffect(()=>{
    const internal = async () => {
      const token = localStorage.getItem('token');
      const { id } = props;
      const req = {
        body: JSON.stringify({
          token,
          id
        }),
      };
      const res = await post('/db/adminEvent', req);
      const { status, sponsors, program, event, deltagere } = await res.json();
      setStatus(status);
      setSponsors(sponsors);
      setProgram(program);
      setEvent(event);
      setDeltagere(deltagere);
    };
    internal();
  },[props]);

  const changeInfo = async newData => {
    const token = localStorage.getItem('token');
    const { dato, beskrivelse, antallPlasser, link, påmeldingsStart } = newData;
    const { AntallPåmeldte } = event;
    const { id } = props;
    const req = {
      body: JSON.stringify({
        token,
        arrangementID: id,
        dato,
        beskrivelse,
        plasser: antallPlasser,
        link,
        påmeldingsStart
      })
    };
    const res = await post('/db/editEvent', req);
    const j = await res.json();
    const { status } = j;
    if (status === 'denied') {
      setStatus(status);
    } else if (status === 'succeeded') {
      setEvent({
        AntallPlasser: antallPlasser,
        Dato: dato,
        Link: link,
        Beskrivelse: beskrivelse,
        PaameldingsStart: påmeldingsStart,
        AntallPåmeldte
      });
    }
  }

  const deleteProgramEvent = async idToDelete => {
    const token = localStorage.getItem('token');
    const req = { body: JSON.stringify({ token, id: idToDelete }) };
    const res = await post('/db/deleteProgramEvent', req);
    const { status } = await res.json();
    if (status === 'ok') {
      setProgram(program.filter(p=>p.id!==idToDelete));
    }
  }

  const { Beskrivelse, Dato, AntallPlasser, AntallPåmeldte, Link, PaameldingsStart } = event;
  if(status === 'denied') {
    return <Redirect to='/admin' />;
  }
  if(status === 'waiting') {
    return (
      <div>
        <h1>Info om arrangement</h1>
        <p>Laster inn</p>
      </div>
    );
  }
  return (
    <div>
      <h1>Info om arrangement</h1>
      <EventInfo 
        toggleEvent={toggleEvent}
        showEvent={showEvent}
        dato={Dato}
        beskrivelse={Beskrivelse}
        antallPlasser={AntallPlasser}
        antallPåmeldte={AntallPåmeldte}
        link={Link}
        påmeldingsStart={PaameldingsStart}
        saveChanges={changeInfo}
      />
      <Sponsors 
        toggleSponsors={toggleSponsors}
        showSponsors={showSponsors}
        sponsors={sponsors}
      />
      <Participants
        deltagere={deltagere}
        toggleDeltagere={toggleDeltagere}
        showDeltagere={showDeltagere}
        slettDeltager={slettDeltager}
      />
      <Program
        toggleProgram={toggleProgram}
        showProgram={showProgram}
        program={program}
        id={props.id}
        deleteProgramEvent={deleteProgramEvent}
      />
      <ExternalParticipants
        toggleExternalParticipants={toggleExternalParticipants}
        showExternalParticipants={showExternalParticipants}
      />
    </div>
  );
};

export default Event;
