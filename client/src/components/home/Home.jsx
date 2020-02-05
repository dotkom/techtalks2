import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { get } from '../../utils/apiCalls.js';
import Navbar from './Navbar';
import About from './About';
import Samarbeidspartnere from './Samarbeidspartnere';
import Program from './Program';
import Paamelding from './Paamelding';

const Wrapper = styled.div`
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;

  & > div {
    padding: 2rem;
    + div {
      border-top: 1px solid #333;
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
