import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

const Table = styled.table`
  margin: auto;
`;

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      status: 'waiting',
      sponsors: [],
      program: [],
      event: {
        Beskrivelse: '',
        Dato: null,
        AntallPlasser: 0,
        AntallPåmeldte: 0,
        Link: ''
      },
      deltagere: [],
      showEvent: false,
      showSponsors: false,
      showDeltagere: false,
      showProgram: false,
    };
    this.toggleEvent = this.toggleEvent.bind(this);
    this.toggleSponsors = this.toggleSponsors.bind(this);
    this.toggleDeltagere = this.toggleDeltagere.bind(this);
    this.toggleProgram = this.toggleProgram.bind(this);
  }

  toggleEvent() {
    this.setState({
      showEvent: !this.state.showEvent
    });
  }

  toggleSponsors() {
    this.setState({
      showSponsors: !this.state.showSponsors
    });
  }

  toggleDeltagere() {
    this.setState({
      showDeltagere: !this.state.showDeltagere
    });
  }

  toggleProgram() {
    this.setState({
      showProgram: !this.state.showProgram
    });
  }

  async componentDidMount() {
    const token = localStorage.getItem('token');
    const { id } = this.state;
    const req = {
      method: 'POST',
      body: JSON.stringify({
        token,
        id
      }),
      headers: { 
        'Content-Type': 'application/json'
      }
    };
    const res = await fetch('/db/adminEvent', req);
    const j = await res.json();
    console.log(j);
    this.setState(j);
  }

  render() {
    const { status, event, sponsors, program, deltagere, showEvent, showSponsors, showProgram, showDeltagere } = this.state;
    const { Beskrivelse, Dato, AntallPlasser, AntallPåmeldte, Link } = event;
    if(status === 'denied') {
      return <Redirect to='/admin' />;
    }
    if(status === 'waiting') {
      return (
        <div>
          <h1>Info om arrangement</h1>
          <p>Laster inn</p>
        </div>
      );
    }
    return (
      <div>
        <h1>Info om arrangement</h1>
        <button type='button' onClick={this.toggleEvent}>{`${showEvent ? 'Skjul' : 'Vis'} info om arrangementet`}</button>
        {
          showEvent ? (
            <Table id="eventInfo">
              <tbody>
                <tr>
                  <th>Dato</th>
                  <td>{new Date(Dato).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <th>Beskrivelse</th>
                  <td>{Beskrivelse}</td>
                </tr>
                <tr>
                  <th>Påmeldte</th>
                  <td>{`${AntallPåmeldte}/${AntallPlasser}`}</td>
                </tr>
                <tr>
                  <th>Link</th>
                  <td>{Link}</td>
                </tr>
              </tbody>
            </Table>
          ) : <br/>
        }
        <button type='button' onClick={this.toggleSponsors}>{`${showSponsors ? 'Skjul' : 'Vis'} sponsorer`}</button>
        {
          showSponsors ? (
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
                  sponsors.map(({BedriftID, navn, logo}) => (
                    <tr key={BedriftID}>
                      <td>{BedriftID}</td>
                      <td>{navn}</td>
                      <td>{logo}</td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          ) : <br/>
        }
        <button type='button' onClick={this.toggleDeltagere}>{`${showDeltagere ? 'Skjul' : 'Vis'} deltagere`}</button>
        {
          showDeltagere ? (
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
                </tr>
              </thead>
              <tbody>
                {deltagere.map(({PaameldingsHash, Navn, Epost, Linjeforening, Alder, StudieAar, Verifisert, PaameldingsTidspunkt}) => (
                  <tr key={PaameldingsHash}>
                    <td>{Navn}</td>
                    <td>{Epost}</td>
                    <td>{Linjeforening}</td>
                    <td>{Alder}</td>
                    <td>{StudieAar}</td>
                    <td>{Verifisert ? 'Ja' : 'Nei'}</td>
                    <td>{new Date(PaameldingsTidspunkt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : <br/>
        }
        <button type='button' onClick={this.toggleProgram}>{`${showProgram ? 'Skjul' : 'Vis'} program`}</button>
        { showProgram ? (
          <Table>
            <thead>
              <tr>
                <th>Navn</th>
                <th>Tid</th>
                <th>Sted</th>
                <th>Beskrivelse</th>
              </tr>
            </thead>
            <tbody>
              {program.map(({navn, tid, beskrivelse, stedNavn, stedLink}, ind) => (
                <tr key={ind}>
                  <td>{navn}</td>
                  <td>{tid}</td>
                  <td><a href={stedLink}>{stedNavn}</a></td>
                  <td>{beskrivelse}</td>
                </tr>))
              }
            </tbody>
          </Table>
        ) : <br/>}
      </div>
    );
  }
};

export default Event;
