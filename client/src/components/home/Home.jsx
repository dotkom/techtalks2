import React, { Component } from 'react';
import styled from 'styled-components';

import Navbar from './Navbar';
import About from './About';
import Samarbeidspartnere from './Samarbeidspartnere';
import Program from './Program';
import Paamelding from './Paamelding';

const Wrapper = styled.div`
  width: 100%;
  min-height: 90%;
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
      <Wrapper>
        <Navbar />
        <About event={event} />
        <Samarbeidspartnere partners={partners} />
        <Program events={program} />
        <Paamelding event={event} />
      </Wrapper>
    );
  }
}

export default Home;
