import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  flex: 1;
  margin: 0;
`;

const ProgramTable = styled.table`
  word-break: break-word;
  width: 100%;
  border: 1px solid #ccc;
  border-collapse: collapse;
  & th {
    font-size: 1.4em;
  }
  & tr {
    display: flex;
    flex-flow: row nowrap;
  }
  & td,th {
    border: 1px solid #ccc;
    flex: 1;
    &:first-child {
      flex: 0 0 4em;
    }
  }
`;

const Program = props => {
  // TODO: use parallell instead of room
  const { events } = props;
  const jsonRooms = [];
  const timeslots = [];
  for(let event of events) {
    const jsonRoom = JSON.stringify({navn: event.stedNavn, link: event.stedLink});
    console.log(event.parallell);
    if (jsonRooms.indexOf(jsonRoom) === -1) {
      jsonRooms.push(jsonRoom);
    }
    const t = event.tid.substring(0,5);
    if (timeslots.indexOf(t) === -1) {
      timeslots.push(t);
    }
  }
  timeslots.sort();
  jsonRooms.sort(); // name first => this sorts by room name
  const rooms = jsonRooms.map(JSON.parse);
  return (
    <Wrapper>
      <h2 id="program">Program</h2>
      {
        events.length ? (
          <ProgramTable>
        <thead>
          <tr>
            <td></td>
            {
              rooms.map(({navn, link},i) => <th key={navn}>Parallell {i+1} (<a href={link}>{navn}</a>)</th>)
            }
          </tr>
        </thead>
        <tbody>
          {
            timeslots.map((timeslot, _)=>{
              const rowEvents = events.filter(event=>event.tid.startsWith(timeslot));
              return (
                <tr key={timeslot}>
                  <td>{timeslot}</td>
                  {
                    rooms.map((room,ind) => {
                      const thisEvent = rowEvents.filter(event=>event.stedNavn === room.navn);
                      if(thisEvent.length) {
                        const {navn,beskrivelse,varighet, bedrift} = thisEvent[0];
                        return (
                          <td key={ind} rowSpan={varighet}>
                            <h3>{navn}</h3>
                            <p>{bedrift}</p>
                            <p>{beskrivelse}</p>
                          </td>
                        )
                      }
                      return null;
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </ProgramTable>
        ) : (
          <h2>kommer snart</h2>
        )
      }
    </Wrapper>
  );
}

export default Program;
