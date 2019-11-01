import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
  margin: auto;
  padding: 1em;
`;
const Td = styled.td`
  max-width: 50em;
`;


const Program = props => (
  <div>
    <button type='button' onClick={props.toggleProgram}>{`${props.showProgram ? 'Skjul' : 'Vis'} program`}</button>
    { props.showProgram ? (
      <div>
        <p>Legg til flere hendelser <a href={`/admin/newProgramEvent?id=${props.id}`}>her</a></p>
        <Table>
          <thead>
            <tr>
              <th>Navn</th>
              <th>Tid</th>
              <th>Bedrift</th>
              <th>Sted</th>
              <th>Beskrivelse</th>
              <th>Slett</th>
            </tr>
          </thead>
          <tbody>
            {props.program.map(({id, navn, tid, beskrivelse, stedNavn, stedLink, bedriftNavn}, ind) => (
              <tr key={id}>
                <Td>{navn}</Td>
                <Td>{tid}</Td>
                <Td>{bedriftNavn}</Td>
                <Td><a href={stedLink}>{stedNavn}</a></Td>
                <Td>{beskrivelse}</Td>
                <Td><button type="button" onClick={()=>props.deleteProgramEvent(id)}>Slett</button></Td>
              </tr>))
            }
          </tbody>
        </Table>
      </div>
    ) : <br/>
  }
  </div>
);


export default Program;
