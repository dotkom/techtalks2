import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 0;
  width: 100%;
`;

const About = props => {
  const { event } = props;
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
            {D < new Date() ? 'Siste tech talks var ' : 'Neste tech talks er '}
            {DatoString}
          </p>
        </div>
      ) : null}
    </Wrapper>
  );
}

export default About;
