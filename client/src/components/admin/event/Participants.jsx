import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
  margin: auto;
  padding: 1em;
`;
const Td = styled.td`
  max-width: 50em;
`;

const Participants = props => (
  <div>
    <button type='button' onClick={props.toggleDeltagere}>{`${props.showDeltagere ? 'Skjul' : 'Vis'} deltagere`}</button>
    {
      props.showDeltagere ? (
        <Table>
          <thead>
            <tr>
              <th>Navn</th>
              <th>Epost</th>
              <th>Linjeforening</th>
              <th>Alder</th>
              <th>Studieår</th>
              <th>Verifisert?</th>
              <th>Påmeldingstidspunkt</th>
              <th>Slett?</th>
            </tr>
          </thead>
          <tbody>
            {props.deltagere.map(({PaameldingsHash, Navn, Epost, Linjeforening, Alder, StudieAar, Verifisert, PaameldingsTidspunkt}, index) => (
              <tr key={PaameldingsHash}>
                <Td>{Navn}</Td>
                <Td>{Epost}</Td>
                <Td>{Linjeforening}</Td>
                <Td>{Alder}</Td>
                <Td>{StudieAar}</Td>
                <Td>{Verifisert ? 'Ja' : 'Nei'}</Td>
                <Td>{new Date(PaameldingsTidspunkt).toLocaleString()}</Td>
                <Td><button type="button" onClick={() => props.slettDeltager(index)}>Slett</button></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : <br/>
    }
  </div>
)

export default Participants;
