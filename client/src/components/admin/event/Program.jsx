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
              <th>Sted</th>
              <th>Beskrivelse</th>
            </tr>
          </thead>
          <tbody>
            {props.program.map(({navn, tid, beskrivelse, stedNavn, stedLink}, ind) => (
              <tr key={ind}>
                <Td>{navn}</Td>
                <Td>{tid}</Td>
                <Td><a href={stedLink}>{stedNavn}</a></Td>
                <Td>{beskrivelse}</Td>
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
