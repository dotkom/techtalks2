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
    flex-flow: row nowrap;
  }
  & td,th {
    border: 1px solid #ccc;
    flex: 1;
    &:first-child {
      flex: 0 0 4em;
      width: 4em;
    }
  }
`;

const Program = props => {
  const { events } = props;
  const timeslots = ['09:15',  '10:15', '11:15', '12:15', '13:15', '14:15', '15:15'];
  const antallParalleller = events.reduce((a, b) => Math.max(a, b.parallell), 0);
  const parallells = [];
  for(let i = 1; i <= antallParalleller; i++) {
    parallells.push(i);
  }
  
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
                  parallells.map(i => <th key={i}>Parallell {i}</th>)
                }
              </tr>
            </thead>
            <tbody>
              {
                timeslots.map((timeslot, timeIndex)=>{
                  const rowEvents = events.filter(event=>event.tid.startsWith(timeslot));
                  return (
                    <tr key={timeslot}>
                      <td>{timeslot}</td>
                      {
                        parallells.map(parallell => {
                          const thisEvent = rowEvents.filter(event=>event.parallell === parallell);
                          if(thisEvent.length) {
                            const { navn, beskrivelse, varighet, bedrift, stedNavn, stedLink } = thisEvent[0];
                            return (
                              <td key={parallell} rowSpan={varighet}>
                                <h3>
                                  {navn}
                                  <br />
                                  <a href={stedLink}>{stedNavn}</a>
                                </h3>
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
