import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { get, patch, del } from '../../../utils/apiCalls.js';
import EventInfo from './EventInfo.jsx';
import Sponsors from './Sponsors.jsx';
import Participants from './Participants.jsx';
import Program from './Program.jsx';
import ExternalParticipants from './ExternalParticipants.jsx';
import BlippTokens from './BlippTokens.jsx';
import ScanStatus from './ScanStatus.jsx';

const Event = (props) => {
  const [status, setStatus] = useState('waiting');
  const [sponsors, setSponsors] = useState([]);
  const [program, setProgram] = useState([]);
  const [event, setEvent] = useState({
    Beskrivelse: '',
    Dato: null,
    AntallPlasser: 0,
    AntallPåmeldte: 0,
    Link: '',
    PaameldingsStart: '',
  });
  const [deltagere, setDeltagere] = useState([]);
  const [showEvent, setShowEvent] = useState(false);
  const [showSponsors, setShowSponsors] = useState(false);
  const [showDeltagere, setShowDeltagere] = useState(false);
  const [showProgram, setShowProgram] = useState(false);
  const [showExternalParticipants, setShowExternalParticipants] = useState(false);
  const [showBlippTokens, setShowBlippTokens] = useState(false);
  const [showScanStatus, setShowScanStatus] = useState(false);

  const toggleEvent = () => setShowEvent(!showEvent);
  const toggleSponsors = () => setShowSponsors(!showSponsors);
  const toggleDeltagere = () => setShowDeltagere(!showDeltagere);
  const toggleProgram = () => setShowProgram(!showProgram);
  const toggleExternalParticipants = () => setShowExternalParticipants(!showExternalParticipants);
  const toggleBlippTokens = () => setShowBlippTokens(!showBlippTokens);
  const toggleScanStatus = () => setShowScanStatus(!showScanStatus);

  const slettDeltager = async (PaameldingsHash) => {
    await del(`/admin/participants/${PaameldingsHash}`).then((response) => {
      if (response.ok) {
        setDeltagere(deltagere.filter((deltager) => deltager.PaameldingsHash !== PaameldingsHash));
      }
    });
  };

  useEffect(() => {
    const internal = async () => {
      const { id } = props;
      await get(`/admin/events/${id}`)
        .then((response) => {
          if (response.ok) return response.json();
          else throw new Error('Something went wrong');
        })
        .then(({ sponsors, program, event, deltagere }) => {
          setStatus('success');
          setSponsors(sponsors);
          setProgram(program);
          setEvent(event);
          setDeltagere(deltagere);
        });
    };
    internal();
  }, [props]);

  const changeInfo = async (newData) => {
    const { dato, beskrivelse, antallPlasser, link, påmeldingsStart } = newData;
    const { AntallPåmeldte } = event;
    const { id } = props;
    const req = {
      body: JSON.stringify({
        arrangementID: id,
        dato,
        beskrivelse,
        plasser: antallPlasser,
        link,
        påmeldingsStart,
      }),
    };
    await patch('/admin/events', req).then((response) => {
      if (response.ok) {
        setEvent({
          AntallPlasser: antallPlasser,
          Dato: dato,
          Link: link,
          Beskrivelse: beskrivelse,
          PaameldingsStart: påmeldingsStart,
          AntallPåmeldte,
        });
      }
    });
  };

  const deleteProgramEvent = async (id) => {
    await del(`/admin/program/events/${id}`).then((response) => {
      if (response.ok) {
        setProgram(program.filter((p) => p.id !== id));
      }
    });
  };

  const { Beskrivelse, Dato, AntallPlasser, AntallPåmeldte, Link, PaameldingsStart } = event;
  if (status === 'waiting') {
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
      <Sponsors toggleSponsors={toggleSponsors} showSponsors={showSponsors} sponsors={sponsors} />
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
      <BlippTokens toggleBlippTokens={toggleBlippTokens} showBlippTokens={showBlippTokens} />
      <ScanStatus toggleScanStatus={toggleScanStatus} showScanStatus={showScanStatus} />
    </div>
  );
};

export default Event;
