import React, { useState } from 'react';
import styled from 'styled-components';

const Header = styled.h3`
  cursor: pointer;
  padding: 0.3em;
`;

const ProgramHendelse = (props) => {
  const { event, antallParalleller } = props;
  const [showDetails, setShowDetails] = useState(false);
  const handleClick = ()=>setShowDetails(v=>!v);

  const { navn, beskrivelse, varighet, bedrift, stedNavn, stedLink, alleParalleller } = event;
  return (
    <td rowSpan={varighet} colSpan={alleParalleller ? antallParalleller : 1}>
      <Header onClick={handleClick}>
        {navn}
        <br />
        <a href={stedLink}>{stedNavn}</a>
      </Header>
      <p>{bedrift}</p>
      {
        showDetails ? (
          <p>
            { beskrivelse.split("\n").map(line => { 
              return (<p>{line}</p>);
              }) 
            }
          </p>
        ) : null
      } 
    </td>
  );
};

export default ProgramHendelse;