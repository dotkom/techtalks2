import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import InputField from '../inputs/InputField.jsx';

class NewRoom extends Component {
  state = {
    name: '',
    building: '',
    mazemap: '',
    status: 'waiting'
  }

  changeName = name => {
    this.setState({ name });
  }

  changeBuilding = building => {
    this.setState({ building });
  }

  changeMazemap = mazemap => {
    this.setState({ mazemap });
  }

  submit = async () => {
    const token = localStorage.getItem('token');
    const { name, building, mazemap } = this.state;
    const req  = {
      method: 'POST',
      body: JSON.stringify({
        token,
        name,
        mazemap,
        building
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const res = await fetch('/db/newRoom', req); 
    const j = await res.json();
    this.setState(j);
  }

  render() {
    const { name, building, mazemap, status } = this.state;
    if(status === 'denied') {
      return <Redirect to="/admin" />;
    }
    if(status === 'succeeded') {
      return <Redirect to="/admin/rooms" />;
    }
    return (
      <div>
        <h1>Create new room</h1>
        <InputField
          id="rNameIn"
          label="Romnavn: "
          val={name}
          type="text"
          updateValue={this.changeName}
        />
        <InputField
          id="buildIn"
          label="Bygning: "
          val={building}
          type="text"
          updateValue={this.changeBuilding}
        />
        <InputField
          id="mazeIn"
          label="Mazemap URL: "
          val={mazemap}
          type="text"
          updateValue={this.changeMazemap}
        />
        <button type="button" onClick={this.submit}>Lag rom</button>
      </div>
    );
  }
}

export default NewRoom;
