import React, { Component } from 'react';
import styled from 'styled-components';

class Program extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: props.events,
      displayDetails: props.events.map(() => false)
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const n = parseInt(e.target.id);
    const { displayDetails } = this.state;
    displayDetails[n] = !displayDetails[n];
    this.forceUpdate();
  }

  render() {
    const Wrapper = styled.div`
      margin: auto;
      width: 100%;
      max-width: 600px;
    `;
    const ProgramTable = styled.table`
      width: 100%
    `
    const { events } = this.state;
    return (
      <Wrapper>
        <h2 id='program'>Program</h2>
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
                  <td onClick={ this.handleClick } id={index} >{navn}</td>
                  <td><a href={stedLink}>{stedNavn}</a></td>
                </tr>
                { shouldDisplay ? 
                  (<tr>
                    <td colSpan='3'>
                      { beskrivelse }
                    </td>
                  </tr>)
                  :
                  null
                }
              </tbody>
            );
          })}
        </ProgramTable>
      </Wrapper>
    );
  }
}

export default Program;
