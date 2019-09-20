import React, { Component } from 'react';
import styled from 'styled-components';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: props.event,
    };
  }

  render() {
    const Wrapper = styled.div`
      width: 100%;
      max-width: 600px;
      margin: auto;
    `;
    const { event } = this.state;
    const { ArrangementID, Dato, Beskrivelse } = event;
    const D = new Date(Dato);
    const DatoString = D.toLocaleDateString();
    return (
      <Wrapper>
        <h2 id="about">Om Tech Talks</h2>
        {ArrangementID ? (
          <div>
            <p>{Beskrivelse}</p>
            <p>
              {D < new Date() ? 'Siste tech talks var ' : 'Neste tech talks er '} den
              {DatoString}
            </p>
          </div>
        ) : null}
      </Wrapper>
    );
  }
}

export default About;
