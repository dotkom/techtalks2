import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
  margin: auto;
  padding: 1em;
`;
const Td = styled.td`
  max-width: 50em;
`;

const EventInfo = (props) => (
  <div>
    <button type='button' onClick={props.toggleEvent}>{`${props.showEvent ? 'Skjul' : 'Vis'} info om arrangementet`}</button>
    {
      props.showEvent ? (
        <Table id="eventInfo">
          <tbody>
            <tr>
              <th>Dato</th>
              <Td>{new Date(props.dato).toLocaleDateString()}</Td>
            </tr>
            <tr>
              <th>Beskrivelse</th>
              <Td>{props.beskrivelse}</Td>
            </tr>
            <tr>
              <th>Påmeldte</th>
              <Td>{`${props.antallPåmeldte}/${props.antallPlasser}`}</Td>
            </tr>
            <tr>
              <th>Link</th>
              <Td><a href={props.link}>{props.link}</a></Td>
            </tr>
          </tbody>
        </Table>
      ) : <br/>
    }
  </div>
);

export default EventInfo;
