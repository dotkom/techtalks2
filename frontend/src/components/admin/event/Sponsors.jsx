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
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {
                props.sponsors.map(({BedriftID, navn, logo, sponsorType}) => (
                  <tr key={BedriftID}>
                    <Td>{BedriftID}</Td>
                    <Td>{navn}</Td>
                    <Td>{logo}</Td>
                    <Td>{['Sølv','Gull','HSP'][sponsorType-1]}</Td>
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
