import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { post } from '../../utils/apiCalls.js';
import InputField from '../inputs/InputField.jsx';

const Wrapper = styled.div`
  text-align: left;

  display: flex;

  flex-direction: row;
  flex-flow: row wrap;
`;
const LinjeforeningWrapper = styled.div`
  flex-grow: 1;
`;

const LinjeforeningLink = styled.a`
  width: 100%;
  display: inline-block;
  color: #fff;
  text-decoration: none;
  padding: 2em;

  > p {
    color: #fff;
  }
  > img {
    width: 50%;
    filter: brightness(0) invert(1);
  }
  :hover {
    background-color: #292929;
  }
`;
const LinjeforeningContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  text-align: center;
`;

const CenteredH2 = styled.h2`
  text-align: center;
`;

const FlexInner = styled.div`
  flex-grow: 1;
  width: 0;
  margin: 2em;
`;

const thildeLogo =
  'data:image/png;base64,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';

const SexyButton = styled.div`
  background-color: #292929;
  text-align: center;
  height: 2em;
  margin-top: 1em;
  line-height: 2em;
  width: 100%;
  cursor: pointer;
  :hover {
    text-decoration: underline;
    text-decoration-color: #f89934;
  }
`;

const Paamelding = (props) => {
  const { event } = props;
  const { AntallPlasser, AntallPåmeldte, PaameldingsStart } = event;
  const PaameldingsDate = new Date(PaameldingsStart);

  const [navn, updateName] = useState('');
  const [epost, updateEmail] = useState('');
  const [linjeforening, updateLinje] = useState('');
  const [alder, updateAge] = useState('');
  const [studieår, updateYear] = useState('');
  const [allergier, updateAllergies] = useState('');
  const [status, setStatus] = useState('');
  const [timeLeft, setTimeLeft] = useState(NaN);

  const submitForm = async () => {
    const req = {
      body: JSON.stringify({
        navn,
        epost,
        linjeforening,
        alder,
        studieår,
        allergier,
      }),
    };
    const res = await post('/db/paamelding', req);
    const jsoned = await res.json();
    setStatus(jsoned.status);
  };

  useEffect(() => {
    const ms = Math.max(0, PaameldingsDate - new Date());
    const seconds = Math.floor(ms / 1000);
    setTimeLeft(seconds);
  }, [PaameldingsDate]);

  useEffect(() => {
    setTimeout(() => {
      const ms = Math.max(0, PaameldingsDate - new Date());
      const seconds = Math.floor(ms / 1000);
      setTimeLeft(seconds);
    }, 1000);
  }, [timeLeft, PaameldingsDate]);

  if (PaameldingsStart === '' || isNaN(timeLeft)) {
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
          <FlexInner>
            <h2 id="paamelding">Påmelding</h2>
            <h3>Påmeldingen åpner om {revisedStringList[0]}</h3>
          </FlexInner>
        </Wrapper>
      );
    }
    const final = revisedStringList.pop();
    const finalString = `${revisedStringList.join(', ')} og ${final}`;
    return (
      <Wrapper>
        <FlexInner>
          <h2 id="paamelding">Påmelding</h2>
          <h3>Påmeldingen åpner om {finalString}</h3>
        </FlexInner>
      </Wrapper>
    );
  }
  if (status === 'succeeded') {
    return (
      <Wrapper>
        <h2 id="paamelding">Påmelding</h2>
        <p>Du vil snart få en bekreftelses e-post sendt til {epost}.</p>
        <div>
          <p>
            <b>OBS! Du er ikke påmeldt før du har verifisert påmeldingen din</b>
          </p>
        </div>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <FlexInner>
        <h2 id="paamelding">Påmelding</h2>
        <h3>{`${AntallPåmeldte} av ${AntallPlasser} påmeldt`}</h3>
        {AntallPåmeldte < AntallPlasser ? (
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
              disabled
              type="text"
              updateValue={updateAllergies}
              label="Allergier: "
              id="paameldingAllergier"
              val={allergier}
            />
            <p>
              <i>Da det er under en uke igjen, kan vi dessverre ikke tilrettelegge for allergier.</i>
            </p>
            <SexyButton onClick={submitForm}>Meld meg på</SexyButton>
          </div>
        ) : (
          <p>Arrangementet er fullt. Er du med i en linjeforening? Sjekk om de har en egen påmelding der.</p>
        )}
      </FlexInner>
      <FlexInner>
        <CenteredH2>Også påmelding hos:</CenteredH2>
        <LinjeforeningContainer>
          <LinjeforeningWrapper>
            <LinjeforeningLink href="https://online.ntnu.no/events/795/tech-talks-2020/">
              <img src="https://online.ntnu.no/static/img/online_logo.svg" alt="Logo for linjeforeningen Online" />
              <p>Online(For informatikk)</p>
            </LinjeforeningLink>
          </LinjeforeningWrapper>
          <LinjeforeningWrapper>
            <LinjeforeningLink href="https://abakus.no/events/2602">
              <img src="https://abakus.no/7df72c5a291dc020b1d5d191ba50d871.png" alt="Logo for linjeforeningen Abakus" />
              <p>Abakus(For Datateknologi og Kommunikasjonsteknologi)</p>
            </LinjeforeningLink>
          </LinjeforeningWrapper>
          <LinjeforeningWrapper>
            <LinjeforeningLink href="https://tihlde.org/arrangementer/73/">
              <img src={thildeLogo} alt="Logo for linjeforeningen Tihlde" />
              <p>
                Tihlde(Dataingeniør, Digital infrastruktur og cybersikkerhet, Digital forretningsutvikling og Digital
                samhandling)
              </p>
            </LinjeforeningLink>
          </LinjeforeningWrapper>
        </LinjeforeningContainer>
      </FlexInner>
    </Wrapper>
  );
};

export default Paamelding;
