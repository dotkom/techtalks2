import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { get } from '../../utils/apiCalls.js';
import Navbar from './Navbar';
import About from './About';
import Samarbeidspartnere from './Samarbeidspartnere';
import Program from './Program';
import Overview from './Overview';
import Paamelding from './Paamelding';

const Wrapper = styled.div``;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  & > div {
    @media (min-width: 64em) {
      padding: 3em;
    }
    @media (max-width: 64em) {
      padding: 1em;
    }
    flex: 1;
    border-top: 1px solid #333333;
  }
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
    PaameldingsStart: '',
  });

  useEffect(() => {
    const internal = async () => {
      get('/home')
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong');
          }
        })
        .then(({ partners, program, event }) => {
          setPartners(partners);
          setProgram(program);
          console.log(program);
          setEvent(event);
        });
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
};

export default Home;
