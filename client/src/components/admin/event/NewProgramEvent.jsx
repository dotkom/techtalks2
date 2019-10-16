import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import InputField from '../../inputs/InputField.jsx';
import DropdownMenu from '../../inputs/DropdownMenu.jsx';


class NewProgramEvent extends Component {
  state = {
    status: 'waiting',
    sponsors: [],
    rom: [],
    bedriftID: 0,
    navn: '',
    beskrivelse: '',
    klokkeslett: '00:00',
    romID: 0,
  }

  async componentDidMount() {
    const { arrangementID } = this.props;
    const token = localStorage.getItem('token');
    const req = {
      method: 'POST',
      body: JSON.stringify({
        token,
        arrangementID
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const res = await fetch('/db/preCreateProgram', req);
    const j = await res.json();
    console.log(j);
    const { status, sponsors, rom } = j;
    if(status === 'succeeded') {
      this.setState({
        sponsors,
        rom,
        status: 'ready'
      });
    } else {
      this.setState({status});
    }
  }

  submit = async () => {
    const token = localStorage.getItem('token');
    const { bedriftID, navn, beskrivelse, klokkeslett, romID } = this.state;
    const { arrangementID } = this.props;
    const req = {
      method: 'POST',
      body: JSON.stringify({
        token,
        bedriftID: bedriftID || null,
        arrangementID,
        navn,
        beskrivelse,
        klokkeslett,
        romID
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const res = await fetch('/db/createProgramEvent', req);
    const { status } = await res.json();
    this.setState({status});
  }

  changeSponsor = bedriftID => {
    this.setState({
      bedriftID
    })
  }

  changeName = navn => {
    this.setState({navn});
  }

  changeDescription = beskrivelse => {
    this.setState({beskrivelse});
  }

  changeTime = klokkeslett => {
    this.setState({klokkeslett});
  }

  changeRoom = romID => {
    this.setState({romID});
  }

  render() {
    const { status, sponsors, rom, bedriftID, navn, beskrivelse, klokkeslett, romID } = this.state;
    if(status === 'waiting') {
      return (
        <div>
          <h1>Lag ny programhendelse</h1>
          <p>Laster inn</p>
        </div>
      );
    }
    if(status === 'denied') {
      return <Redirect to="/admin" />;
    }
    if(status === 'succeeded') {
      return <Redirect to={`/admin/event?id=${this.props.arrangementID}`} />;
    }
    // might add some feedback on fail
    return (
      <div>
        <h1>Lag ny programhendelse</h1>
        <DropdownMenu
          defaultValue={0}
          defaultOption="Tilknyttet sponsor?"
          value={bedriftID}
          onChange={this.changeSponsor}
          options={sponsors}
          valueField="BedriftID"
          displayField="navn"
        />
        <InputField
          type="text" 
          label="Navn: "
          val={navn}
          updateValue={this.changeName}
        />
        <InputField
          type="text"
          label="Beskrivelse: "
          val={beskrivelse}
          updateValue={this.changeDescription}
        />
        <InputField
          type="time"
          label="Klokkeslett: "
          val={klokkeslett}
          updateValue={this.changeTime}
        />
        <DropdownMenu
          defaultValue={0}
          defaultOption="Rom"
          value={romID}
          onChange={this.changeRoom}
          options={rom}
          valueField="romID"
          displayField="navn"
        />
        <button type="button" onClick={this.submit}>Lag hendelse</button>
      </div>
    )
  }
}

export default NewProgramEvent;
