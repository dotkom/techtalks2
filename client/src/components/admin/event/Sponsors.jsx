import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
  margin: auto;
  padding: 1em;
`;
const Td = styled.td`
  max-width: 50em;
`;

const Sponsors = (props) => (
  <div>
    <button type='button' onClick={props.toggleSponsors}>{`${props.showSponsors ? 'Skjul' : 'Vis'} sponsorer`}</button>
      {
        props.showSponsors ? (
          <Table>
            <thead>
              <tr>
                <th>BedriftID</th>
                <th>Navn</th>
                <th>Logo</th>
              </tr>
            </thead>
            <tbody>
              {
                props.sponsors.map(({BedriftID, navn, logo}) => (
                  <tr key={BedriftID}>
                    <Td>{BedriftID}</Td>
                    <Td>{navn}</Td>
                    <Td>{logo}</Td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        ) : <br/>
      }
  </div>
);

export default Sponsors;
