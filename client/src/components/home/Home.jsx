import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { get } from '../../utils/apiCalls.js';
import Navbar from './Navbar';
import About from './About';
import Samarbeidspartnere from './Samarbeidspartnere';
import Program from './Program';
import Overview from './Overview';
import Paamelding from './Paamelding';

const Wrapper = styled.div`
  max-width: 70em;
  margin: 0 auto;
  z-index: 0;
  background-color: #181B1E;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);

  color: #fff;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  & > div {
    padding: 3em;
    flex: 1;
    border-bottom: 1px solid #333333;
  }
  & > div:first-child {
    /*margin-top: 3em; */
  }
  & > div:last-child {
    /*margin-bottom: 3em;*/
  }
  & > div:nth-child(2n+1) {

    /*color: #000;*/
    /*background-color: #fff;*/
    /*transform: skew(0deg, -8deg);
    & > * {
      transform: skew(0deg, 8deg);
    }*/
  }
  & > div:nth-child(2n) {
    z-index: 2;
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
        <Overview events={program} />
        <Program events={program} />
        <Samarbeidspartnere partners={partners} />
        <Paamelding event={event} />
        <About event={event} />
      </Content>
    </Wrapper>
  );
}

export default Home;
