import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import EventInfo from './EventInfo.jsx';
import Sponsors from './Sponsors.jsx';
import Participants from './Participants.jsx';
import Program from './Program.jsx';


class Event extends Component {
  state = {
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

  toggleEvent = () => {
    this.setState({
      showEvent: !this.state.showEvent
    });
  }

  toggleSponsors = () => {
    this.setState({
      showSponsors: !this.state.showSponsors
    });
  }

  toggleDeltagere = () => {
    this.setState({
      showDeltagere: !this.state.showDeltagere
    });
  }

  toggleProgram = () => {
    this.setState({
      showProgram: !this.state.showProgram
    });
  }

  slettDeltager = async (index) => {
    const { deltagere } = this.state;
    const token = localStorage.getItem('token');
    const { PaameldingsHash } = deltagere[index];
    const req = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        PaameldingsHash,
        token
      })
    };
    const res = await fetch('/db/deleteParticipant', req);
    const j = await res.json();
    const { status } = j;
    if(status === 'succeeded') {
      deltagere.splice(index, 1);
      this.setState({
        deltagere
      });
    }
  }

  async componentDidMount() {
    const token = localStorage.getItem('token');
    const { id } = this.props;
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
        <EventInfo 
          toggleEvent={this.toggleEvent}
          showEvent={showEvent}
          dato={Dato}
          beskrivelse={Beskrivelse}
          antallPlasser={AntallPlasser}
          antallPåmeldte={AntallPåmeldte}
          link={Link}
        />
        <Sponsors 
          toggleSponsors={this.toggleSponsors}
          showSponsors={showSponsors}
          sponsors={sponsors}
        />
        <Participants
          deltagere={deltagere}
          toggleDeltagere={this.toggleDeltagere}
          showDeltagere={showDeltagere}
          slettDeltager={this.slettDeltager}
        />
        <Program
          toggleProgram={this.toggleProgram}
          showProgram={showProgram}
          program={program}
        />
      </div>
    );
  }
};

export default Event;
