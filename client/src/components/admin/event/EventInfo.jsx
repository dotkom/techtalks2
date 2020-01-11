import React, { useState } from 'react';
import styled from 'styled-components';

import InputField from '../../inputs/InputField.jsx';

const Table = styled.table`
  margin: auto;
  padding: 1em;
`;
const Td = styled.td`
  max-width: 50em;
`;

const EventInfo = props => {
  const [editing, setEditing] = useState(false);
  const [beskrivelse, changeDesc] = useState('');
  const [antallPlasser, changePlasser] = useState('');
  const [link, changeLink] = useState('');
  const [dato, changeDate] = useState('');
  const [påmeldingsStart, changeStart] = useState('');


  const cancelEditing = () => {
    setEditing(false);
    changeDesc('');
    changePlasser('');
    changeLink('');
    changeDate('');
    changeStart('');
  }

  const enableEditing = () => {
    const { beskrivelse, antallPlasser, link, dato, påmeldingsStart } = props;
    const d = new Date(dato);
    const dStart = new Date(påmeldingsStart);
    setEditing(true);
    changeDesc(beskrivelse);
    changePlasser(antallPlasser);
    changeLink(link);
    // dato på YYYY/MM/DD-format. Offset må trekkes fra for at tidssoner ikke setter dagen tilbake med 1
    changeDate(new Date(d - 60000*d.getTimezoneOffset()).toISOString().split('T')[0]);
    changeStart(new Date(d - 60000*dStart.getTimezoneOffset()).toISOString());
  }

  const saveChanges = async () => {
    const newData = { beskrivelse, antallPlasser, link, dato, påmeldingsStart };
    props.saveChanges(newData);
    cancelEditing();
  }

  const { toggleEvent, showEvent, antallPåmeldte } = props;
  if(!editing) {
    // if not editing, the things that can be edited are in the props
    const { dato, beskrivelse, antallPlasser, link, påmeldingsStart } = props;
    return (
      <div>
        <button type="button" onClick={toggleEvent}>{`${showEvent ? 'Skjul' : 'Vis'} info om arrangementet`}</button>
        {
          showEvent ? (
            <div>
              <button type="button" onClick={enableEditing}>Rediger</button>
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
                  <tr>
                    <th>Påmeldingsstart</th>
                    <Td>{new Date(påmeldingsStart).toLocaleDateString()} {new Date(påmeldingsStart).toLocaleTimeString()}</Td>
                  </tr>
                </tbody>
              </Table>
            </div>
          ) : <br/>
        }
      </div>
    );
  }
  // if editing, use the values in working state
  // The if is in this order (rather than `if(editing)`) for scoping reasons
  // (since 'dato' is in global scope, the props unpacking can't be)
  // not the best of practices, but it's mostly a readability issue - will fix if/when the rest is done
  return (
    <div>
      <button type="button" onClick={toggleEvent}>{`${showEvent ? 'Skjul' : 'Vis'} info om arrangementet`}</button>
      {
        showEvent ? (
          <div>
            <button type="button" onClick={saveChanges}>Lagre</button>
            <button type="button" onClick={cancelEditing}>Avbryt</button>
            <Table id="eventInfo">
              <tbody>
                <tr>
                  <Td><InputField type="date" label="Dato: " val={dato} id={"eventDate"} updateValue={changeDate} /></Td>
                </tr>
                <tr>
                  <Td><InputField type="textarea" label="Beskrivelse: " val={beskrivelse} updateValue={changeDesc} /></Td>
                </tr>
                <tr>
                  <Td><InputField type="number" label="Antall plasser: " val={antallPlasser} updateValue={changePlasser} /></Td>
                </tr>
                <tr>
                  <Td><InputField type="text" label="Link: " val={link} updateValue={changeLink} /></Td>
                </tr>
                <tr>
                  <Td><InputField type="datetime-local" val={påmeldingsStart} updateValue={changeStart} /></Td>
                </tr>
              </tbody>
            </Table>
          </div>
        ) : <br/>
      }
    </div>
  );
}

export default EventInfo;
