import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import InputField from '../inputs/InputField';

class NewEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dato: '',
      antallPlasser: '',
      beskrivelse: '',
      status: 'default'
    }
    this.changeDate = this.changeDate.bind(this);
    this.changePlasser = this.changePlasser.bind(this);
    this.changeDesc = this.changeDesc.bind(this);
    this.submit = this.submit.bind(this);
  }

  changeDate(dato) {
    this.setState({
      dato
    });
  }

  changePlasser(antallPlasser) {
    this.setState({
      antallPlasser
    });
  }

  changeDesc(beskrivelse) {
    this.setState({
      beskrivelse
    });
  }

  async submit() {
    await this.setState({
      status: 'waiting'
    });
    const { dato, antallPlasser, beskrivelse } = this.state;
    const token = localStorage.getItem('token');
    const req = {
      method: 'POST',
      body: JSON.stringify({
        dato,
        antallPlasser,
        beskrivelse,
        token
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const res = await fetch('/db/newEvent', req);
    const j = await res.json();
    const { status } = j;
    this.setState({
      status
    });
  }

  render() {
    const { dato, antallPlasser, beskrivelse, status } = this.state;
    if(status === 'denied') {
      return <Redirect to='/admin' />;
    }
    if(status === 'succeeded') {
      return <Redirect to='/admin/events' />;
    }
    return (
      <div>
        <h1>Nytt arrangement</h1>
        <InputField label='Dato: ' id='eventDate' val={dato} updateValue={this.changeDate} type='date'/>
        <InputField label='Antall plasser: ' id='eventPlasser' val={antallPlasser} updateValue={this.changePlasser} type='number' />
        <InputField label='Beskrivelse: ' id='eventDesc' val={beskrivelse} updateValue={this.changeDesc} type='textarea' />
        <button type='button' onClick={this.submit}>Lag arrangement</button>
      </div>
    );
  }
}


export default NewEvent;
