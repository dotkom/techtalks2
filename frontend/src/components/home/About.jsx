import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
`;

const About = props => {
  const { event } = props;
  const { ArrangementID, Dato, Beskrivelse } = event;
  const D = new Date(Dato);
  const DatoString = D.toLocaleDateString();
  return (
    <Wrapper>
      <h2 id="about">Om Tech Talks</h2>
      <p><b>Tech Talks</b> er et faglig orientert arrangement, arrangert av <a href="https://www.facebook.com/ekskomOnline">Ekskursjonskomiteen</a> i samarbeid med linjeforeningen for informatikk ved NTNU, <a href="https://online.ntnu.no/">Online</a>. Ekskursjonskomiteens oppgave er å arrangere tredje årstrinn ved informatikkstudiet sin årlige ekskursjon.</p>
      {ArrangementID ? (
        <div>
          <p>{Beskrivelse}</p>
          <p>
            {D < new Date() ? 'Siste Tech Talks var ' : 'Neste Tech Talks er '}
            {DatoString}
          </p>
        </div>
      ) : null}
    </Wrapper>
  );
}

export default About;
