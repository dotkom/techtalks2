import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { get } from '../../utils/apiCalls.js';
import Navbar from './Navbar';
import About from './About';
import Samarbeidspartnere from './Samarbeidspartnere';
import Program from './Program';
import Paamelding from './Paamelding';

const Wrapper = styled.div`
  min-height: calc(100vh - 14em);
  max-width: 50em;
  margin: 0 auto;
  padding: 1em 0.5em;
  z-index: 0;
  background-color: #383c3c;
  color: #fff;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  & > div {
    padding: 3em;
    flex: 1;
  }
  & > div:first-child {
    margin-top: 3em;
  }
  & > div:last-child {
    margin-bottom: 3em;
  }
  & > div:nth-child(2n+1) {
    color: #000;
    background-color: #fff;
    transform: skew(0deg, -8deg);
    & > * {
      transform: skew(0deg, 8deg);
    }
  }
`;


const Home = () => {
  const [partners, setPartners] = useState([]);
  const [program, setProgram] = useState([]);
  const [event, setEvent] = useState({
    ArrangementID: 0,
    Beskrivelse: '',
    AntallPlasser: 0,
    AntallPåmeldte: 0,
    PaameldingsStart: ''
  });

  useEffect(()=>{
    const internal = async () => {
      const response = await get('/db/home');
      const jsoned = await response.json();
      const { partners, program, event } = jsoned;
      setPartners(partners);
      setProgram(program);
      setEvent(event);
    };
    internal();
  }, []);

  return (
    <Wrapper>
      <Navbar />
      <Content>
        <Program events={program} />
        <Samarbeidspartnere partners={partners} />
        <Paamelding event={event} />
        <About event={event} />
      </Content>
    </Wrapper>
  );
}

export default Home;
