import React, { useState } from 'react';
import styled from 'styled-components';

const Header = styled.h3`
  cursor: pointer;
  padding: 0.3em;
`;

const ClickA = styled.a`
  cursor: pointer;
`;

const ProgramHendelse = (props) => {
  const { event, antallParalleller } = props;
  const [showDetails, setShowDetails] = useState(false);
  const handleClick = () => setShowDetails((v) => !v);

  const { navn, beskrivelse, varighet, bedrift, stedNavn, stedLink, alleParalleller } = event;

  const beskrivelseSplitted = beskrivelse.split('\n');
  const DESCRIPTION_MAX = 200;
  let soFar = 0;
  return (
    <td rowSpan={varighet} colSpan={alleParalleller ? antallParalleller : 1}>
      <Header onClick={handleClick}>
        {navn}
        <br />
        <a href={stedLink}>{stedNavn}</a>
      </Header>
      <p>{bedrift}</p>
      {beskrivelse.length < DESCRIPTION_MAX ? (
        <p>
          {beskrivelseSplitted.map((line) => {
            return <p>{line}</p>;
          })}
        </p>
      ) : showDetails ? (
        <p>
          {beskrivelseSplitted.map((line) => {
            return <p>{line}</p>;
          })}

          {<ClickA onClick={handleClick}>Les mindre</ClickA>}
        </p>
      ) : (
        <p>
          {(beskrivelse.slice(0, DESCRIPTION_MAX) + '...').split('\n').map((line) => {
            return <p>{line}</p>;
          })}
          {<ClickA onClick={handleClick}>Les mer</ClickA>}
        </p>
      )}
    </td>
  );
};

export default ProgramHendelse;
