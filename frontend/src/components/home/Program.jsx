import React from 'react';
import styled from 'styled-components';

import ProgramHendelse from './ProgramHendelse';

const Wrapper = styled.div`
  flex: 1;
  margin: 0;
  display: flex;
  flex-direction: column;
`;

const ProgramTable = styled.table`
  word-break: break-word;
  width: 100%;
  border: 1px solid #333333;
  border-collapse: collapse;
  & th {
    font-size: 1.4em;
  }
  & tr {
    display: flex;
    flex-flow: row nowrap;
  }
  & td,
  th {
    border: 1px solid #333333;
    flex: 1;
    flex-basis: 0;
    flex-grow: 1;
    &:first-child {
      flex: 0 0 3em;
      width: 3em;
    }
  }
`;

const Program = (props) => {
  const { events } = props;
  const times = events.map(({ tid }) => tid.substring(0, 5));
  const timeslots = [];
  //try to find all unique timeslots
  times.sort();
  times.forEach((time) => {
    if (timeslots.length === 0 || timeslots[timeslots.length - 1] !== time) {
      timeslots.push(time);
    }
  });
  const periods = [];
  for (let i = 0; i < timeslots.length - 1; i++) {
    periods.push({
      start: timeslots[i],
      stop: timeslots[i + 1],
    });
  }
  periods.push({
    start: timeslots[timeslots.length - 1],
    stop: '16:00',
  });
  const antallParalleller = events.reduce((a, b) => Math.max(a, b.parallell), 0);
  const parallells = [];
  for (let i = 1; i <= antallParalleller; i++) {
    parallells.push(i);
  }

  return (
    <Wrapper id="program">
      {events.length ? (
        <ProgramTable>
          <thead>
            <tr>
              <td></td>
              {parallells.map((i) => (
                <th key={i}>Parallell {i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map(({ start, stop }) => {
              const rowEvents = events.filter((event) => event.tid.startsWith(start));
              return (
                <tr key={start}>
                  <td>
                    {start}-{stop}
                  </td>
                  {parallells.map((parallell) => {
                    const thisEvent = rowEvents.filter((event) => event.parallell === parallell);
                    if (thisEvent.length) {
                      return (
                        <ProgramHendelse key={parallell} event={thisEvent[0]} antallParalleller={antallParalleller} />
                      );
                    }
                    return null;
                  })}
                </tr>
              );
            })}
          </tbody>
        </ProgramTable>
      ) : (
        <h3>Kommer snart</h3>
      )}
    </Wrapper>
  );
};

export default Program;
