import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Navbar from './Navbar';
import About from './About';
import Samarbeidspartnere from './Samarbeidspartnere';
import Program from './Program';
import Paamelding from './Paamelding';

const Wrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 14em);
  max-width: 50em;
  margin: 0 auto;
  padding: 1em 0.5em;
  z-index: 0;
  background-color: white;
`;


const Home = () => {
  const [partners, setPartners] = useState([]);
  const [program, setProgram] = useState([]);
  const [event, setEvent] = useState({
    ArrangementID: 0,
    Beskrivelse: '',
    AntallPlasser: 0,
    AntallPåmeldte: 0
  });

  useEffect(()=>{
    const internal = async () => {
      const response = await fetch('/db/home');
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
      <Program events={program} />
      <Samarbeidspartnere partners={partners} />
      <Paamelding event={event} />
      <About event={event} />
    </Wrapper>
  );
}

export default Home;
