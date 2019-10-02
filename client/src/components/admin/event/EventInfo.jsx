import React, { Component } from 'react';
import styled from 'styled-components';

import InputField from '../../inputs/InputField.jsx';

const Table = styled.table`
  margin: auto;
  padding: 1em;
`;
const Td = styled.td`
  max-width: 50em;
`;

class EventInfo extends Component {
  state = {
    editing: false,
    beskrivelse: '',
    antallPlasser: '',
    link: '',
    dato: '',
  }


  cancelEditing = () => {
    this.setState({
      beskrivelse: '',
      antallPlasser: '',
      link: '',
      dato: '',
      editing: false
    });
  }

  enableEditing = () => {
    const { beskrivelse, antallPlasser, link, dato } = this.props;
    const d = new Date(dato);
    this.setState({
      beskrivelse,
      antallPlasser,
      link,
      // dato på YYYY/MM/DD-format. Offset må trekkes fra for at tidssoner ikke setter dagen tilbake med 1
      dato: new Date(d - 60000*d.getTimezoneOffset()).toISOString().split('T')[0],
      editing: true
    });
  }

  saveChanges = async () => {
    const { beskrivelse, antallPlasser, link, dato } = this.state;
    const newData = { beskrivelse, antallPlasser, link, dato };
    this.props.saveChanges(newData);
    this.setState({
      beskrivelse: '',
      antallPlasser: '',
      link: '',
      dato: '',
      editing: false
    });
  }

  changeDate = dato => {
    this.setState({dato});
  }

  changeDesc = beskrivelse => {
    this.setState({beskrivelse});
  }

  changePlasser = antallPlasser => {
    this.setState({antallPlasser});
  }

  changeLink = link => {
    this.setState({link});
  }

  render() {
    const { toggleEvent, showEvent, antallPåmeldte } = this.props;
    const { editing } = this.state;
    if(editing) {
      // if editing, the things that can be edited are in the state
      const { dato, beskrivelse, antallPlasser, link } = this.state;
      return (
        <div>
          <button type="button" onClick={toggleEvent}>{`${showEvent ? 'Skjul' : 'Vis'} info om arrangementet`}</button>
          {
            showEvent ? (
              <div>
                <button type="button" onClick={this.saveChanges}>Lagre</button>
                <button type="button" onClick={this.cancelEditing}>Avbryt</button>
                <Table id="eventInfo">
                  <tbody>
                    <tr>
                      <Td><InputField type="date" label="Dato: " val={dato} id={"eventDate"} updateValue={this.changeDate} /></Td>
                    </tr>
                    <tr>
                      <Td><InputField type="textarea" label="Beskrivelse: " val={beskrivelse} updateValue={this.changeDesc} /></Td>
                    </tr>
                    <tr>
                      <Td><InputField type="number" label="Antall plasser: " val={antallPlasser} updateValue={this.changePlasser} /></Td>
                    </tr>
                    <tr>
                      <Td><InputField type="text" label="Link: " val={link} updateValue={this.changeLink} /></Td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            ) : <br/>
          }
        </div>
      );
    }
    // if not editing, the state is empty and props should be used
    const { dato, beskrivelse, antallPlasser, link } = this.props;
    return (
      <div>
        <button type="button" onClick={toggleEvent}>{`${showEvent ? 'Skjul' : 'Vis'} info om arrangementet`}</button>
        {
          showEvent ? (
            <div>
              <button type="button" onClick={this.enableEditing}>Rediger</button>
              <Table id="eventInfo">
                <tbody>
                  <tr>
                    <th>Dato</th>
                    <Td>{new Date(dato).toLocaleDateString()}</Td>
                  </tr>
                  <tr>
                    <th>Beskrivelse</th>
                    <Td>{beskrivelse}</Td>
                  </tr>
                  <tr>
                    <th>Påmeldte</th>
                    <Td>{`${antallPåmeldte}/${antallPlasser}`}</Td>
                  </tr>
                  <tr>
                    <th>Link</th>
                    <Td><a href={link}>{link}</a></Td>
                  </tr>
                </tbody>
              </Table>
            </div>
          ) : <br/>
        }
      </div>
    );
  }
}

export default EventInfo;
