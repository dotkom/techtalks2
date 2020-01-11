import React, { useState } from 'react';
import styled from 'styled-components';

import InputField from '../inputs/InputField';

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


  const submitForm = async () => {
    const req = {
      method: 'POST',
      body: JSON.stringify({
        navn,
        epost,
        linjeforening,
        alder,
        studieår,
        allergier
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await fetch('db/paamelding', req);
    const jsoned = await res.json();
    console.log(jsoned);
    setStatus(jsoned.status);
  }

  const { event } = props;
  const { AntallPlasser, AntallPåmeldte, PaameldingsStart } = event;
  const PaameldingsDate = new Date(PaameldingsStart);
  console.log(PaameldingsDate);
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
