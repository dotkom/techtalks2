import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { post } from '../../utils/apiCalls.js';
import InputField from '../inputs/InputField.jsx';

const Wrapper = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
`;

const Paamelding = props => {
  const [navn, updateName] = useState('');
  const [epost, updateEmail] = useState('');
  const [linjeforening, updateLinje] = useState('');
  const [alder, updateAge] = useState('');
  const [studieår, updateYear] = useState('');
  const [allergier, updateAllergies] = useState('');
  const [status, setStatus] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  

  const submitForm = async () => {
    const req = {
      body: JSON.stringify({
        navn,
        epost,
        linjeforening,
        alder,
        studieår,
        allergier
      }),
    };
    const res = await post('/db/paamelding', req);
    const jsoned = await res.json();
    setStatus(jsoned.status);
  }

  const { event } = props;
  const { AntallPlasser, AntallPåmeldte, PaameldingsStart } = event;
  const PaameldingsDate = new Date(PaameldingsStart);
  
  useEffect(() => {
    setTimeout(()=>{
      const ms = Math.max(0, PaameldingsDate - new Date());
      const seconds = Math.floor(ms/1000);
      setTimeLeft(seconds);
    }, 1000);
  }, [timeLeft, PaameldingsDate]);


  if (PaameldingsStart === '') {
    return (
      <Wrapper>
        <h2 id="paamelding">Påmelding</h2>
        <p>Laster inn...</p>
      </Wrapper>
    );
  }

  if (timeLeft > 0) {
    const seconds = timeLeft % 60;
    const minutes = Math.floor(timeLeft / 60) % 60;
    const hours = Math.floor(timeLeft / 3600) % 24;
    const days = Math.floor(timeLeft / (3600 * 24));
    const secondString = `${seconds} ${seconds === 1 ? 'sekund' : 'sekunder'}`;
    const minuteString = `${minutes} ${minutes === 1 ? 'minutt' : 'minutter'}`;
    const hourString = `${hours} ${hours === 1 ? 'time' : 'timer'}`;
    const dayString = `${days} ${days === 1 ? 'dag' : 'dager'}`;
    const list = [days, hours, minutes, seconds];
    const stringList = [dayString, hourString, minuteString, secondString];
    const revisedStringList = stringList.filter((_, i) => list[i] > 0);
    if (revisedStringList.length === 1) {
      return (
        <Wrapper>
          <h2 id="paamelding">Påmelding</h2>
          <h3>Påmeldingen åpner om {revisedStringList[0]}</h3>
        </Wrapper>
      );
    }
    const final = revisedStringList.pop();
    const finalString = `${revisedStringList.join(', ')} og ${final}`;
    return (
      <Wrapper>
        <h2 id="paamelding">Påmelding</h2>
    <h3>Påmeldingen åpner om {finalString}</h3>
      </Wrapper>
    );
  }
  if (status === 'succeeded') {
    return (
      <Wrapper>
        <h2 id="paamelding">Påmelding</h2>
        <p>
          Du vil snart få en bekreftelses e-post sendt til {epost}.
          <br />
          <b>OBS! Du er ikke påmeldt før du har verifisert påmeldingen din</b>
        </p>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <h2 id="paamelding">Påmelding</h2>
      <h3>{`${AntallPåmeldte} av ${AntallPlasser} påmeldt`}</h3>
      { 
        AntallPåmeldte < AntallPlasser ? (
          <div>
            <InputField type="text" updateValue={updateName} label="Navn: " id="paameldingNavn" val={navn} />
            <InputField type="text" updateValue={updateEmail} label="E-post: " id="paameldingEpost" val={epost} />
            <InputField
              type="text"
              updateValue={updateLinje}
              label="Linjeforening: "
              id="paameldingLinje"
              val={linjeforening}
            />
            <InputField type="number" updateValue={updateAge} label="Alder: " id="paameldingAlder" val={alder} />
            <InputField
              type="number"
              updateValue={updateYear}
              label="Studieår: "
              id="paameldingStudieaar"
              val={studieår}
            />
            <InputField
              type="text"
              updateValue={updateAllergies}
              label="Allergier: "
              id="paameldingAllergier"
              val={allergier}
            />
            <button onClick={submitForm}>Meld meg på</button>
          </div>
        )  : <p>Arrangementet er fullt</p>
      }
    </Wrapper>
  );
}

export default Paamelding;
