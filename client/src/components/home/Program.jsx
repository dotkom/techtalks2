import React, { Component } from 'react';
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


class Program extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayDetails: props.events.map(() => false),
    };
  }

  handleClick = e => {
    const n = parseInt(e.target.id);
    const { displayDetails } = this.state;
    displayDetails[n] = !displayDetails[n];
    this.forceUpdate();
  }

  render() {
    const { events } = this.props;
    return (
      <Wrapper>
        <h2 id="program">Program</h2>
        <ProgramTable>
          <thead>
            <tr>
              <th>Tid</th>
              <th>Foredrag</th>
              <th>Sted</th>
            </tr>
          </thead>
          {events.map((event, index) => {
            const { navn, tid, stedNavn, stedLink, beskrivelse } = event;
            const shouldDisplay = this.state.displayDetails[index];
            return (
              <tbody key={index}>
                <tr>
                  <td>{tid}</td>
                  <Td onClick={this.handleClick} id={index}>
                    {navn}
                  </Td>
                  <td>
                    <a href={stedLink}>{stedNavn}</a>
                  </td>
                </tr>
                {shouldDisplay ? (
                  <tr>
                    <td colSpan="3">{beskrivelse}</td>
                  </tr>
                ) : null}
              </tbody>
            );
          })}
        </ProgramTable>
      </Wrapper>
    );
  }
}

export default Program;
