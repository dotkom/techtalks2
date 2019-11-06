import React, { Component } from 'react';
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


class Home extends Component {
  state = {
    partners: [],
    program: [],
    event: {
      ArrangementID: 0,
      Beskrivelse: '',
      AntallPlasser: 0,
      AntallPåmeldte: 0,
    },
  };

  async componentDidMount() {
    const response = await fetch('/db/home');
    const jsoned = await response.json();
    const { partners, program, event } = jsoned;
    this.setState({
      partners,
      program,
      event,
    });
  }

  render() {
    const { partners, program, event } = this.state;
    return (
      <div>
        <Navbar />
        <Wrapper>
          <About event={event} />
          <Program events={program} />
          <Samarbeidspartnere partners={partners} />
          <Paamelding event={event} />
        </Wrapper>
      </div>
    );
  }
}

export default Home;
