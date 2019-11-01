import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  margin: 0;
`;
const ProgramTable = styled.table`
  width: 100%;
`;
const Td = styled.td`
  cursor: pointer;
`;


const Program = props => {
  const { events } = props;
  const timeslots = [];
  console.table(events);
  const jsonRooms = [];
  for(let event of events) {
    const jsonRoom = JSON.stringify({navn: event.stedNavn, link: event.stedLink});
    if (jsonRooms.indexOf(jsonRoom) === -1) {
      jsonRooms.push(jsonRoom);
    }
  }
  jsonRooms.sort(); // name first => this sorts by name
  const rooms = jsonRooms.map(JSON.parse);
  return (
    <Wrapper>
      <h2 id="program">Program</h2>
      <ProgramTable>
        <thead>
          <tr>
            <th>Tid</th>
            {
  rooms.map(({navn, link}) => <th key={navn}><a href={link}>{navn}</a></th>)
            }
          </tr>
        </thead>
        <tbody>
          {
            timeslots.map((timeslot, index)=>{
            
              return (<tr></tr>)
            })
          }
        </tbody>
      </ProgramTable>
    </Wrapper>
  );
}

export default Program;
