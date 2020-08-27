import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Files from 'react-files';

import InputField from '../../inputs/InputField.jsx';

import { get, del, post } from '../../../utils/apiCalls.js';

const Table = styled.table`
  margin: auto;
  padding: 1em;
`;
const Td = styled.td`
  max-width: 50em;
`;

const UploadArea = styled.div`
  background-color: red;
  min-width: 5em;
`;

const ExternalParticipants = (props) => {
  const [participants, setParticipants] = useState([]);
  const [loadBlob, setLoadBlob] = useState({});

  const [importProcess, setImportProcess] = useState('');

  const [parseReady, setParseReady] = useState(false);

  function updateExternalParticipants() {
    const internal = async () => {
      const token = localStorage.getItem('token');
      const { id } = props;
      const req = {
        body: JSON.stringify({
          token,
          id,
        }),
      };
      const res = await post('/db/externalParticipants', req);
      const p = await res.json();
      setParticipants(p);
    };
    internal();
  }
  useEffect(() => {
    updateExternalParticipants();
  }, [props]);

  async function deleteParticipant(participantUUID) {
    console.log(participantUUID);
    const token = localStorage.getItem('token');
    const { id } = props;
    const req = {
      body: JSON.stringify({
        token,
        id,
      }),
    };
    const res = await post(`/db/externalParticipants/${participantUUID}`, req);
    updateExternalParticipants();
  }

  async function importBlob() {
    for (let i = 0; i < loadBlob.length; i++) {
      console.log(loadBlob[i]);
      const internal = async () => {
        const token = localStorage.getItem('token');
        const Navn = loadBlob[i].first_name + ' ' + loadBlob[i].last_name;
        const req = {
          body: JSON.stringify({
            token,
            Navn,
          }),
        };
        const res = await post('/db/createExternalParticipants', req);
      };
      await internal();
      setImportProcess(`${i + 1} / ${loadBlob.length}`);
    }
    updateExternalParticipants();
  }

  return (
    <div>
      <button type="button" onClick={props.toggleExternalParticipants}>{`${
        props.showExternalParticipants ? 'Skjul' : 'Vis'
      } eksterne påmeldte`}</button>
      {props.showExternalParticipants ? (
        <div>
          <UploadArea>
            <Files
              onChange={(file) => {
                const fileReader = new FileReader();

                fileReader.onload = (event) => {
                  const b = JSON.parse(event.target.result).Attendees;
                  console.log(b);
                  setLoadBlob(b);
                  setParseReady(true);
                };
                fileReader.readAsText(file[0]);
              }}
            >
              Dra en fil hit eller klikk for klargjøring av fil for importering
              <p>(Onlineweb-format)</p>
            </Files>
            {parseReady ? (
              importProcess !== '' ? (
                <p>{importProcess}</p>
              ) : (
                <button onClick={importBlob}>Importer deltagere</button>
              )
            ) : (
              <p>venter fil</p>
            )}
          </UploadArea>
          <Table>
            <thead>
              <tr>
                <td>Name</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => {
                return (
                  <tr>
                    <td>{participant.Navn}</td>
                    <td>
                      <button
                        onClick={() => {
                          deleteParticipant(participant.UUID);
                        }}
                      >
                        Slett
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      ) : (
        <br />
      )}
    </div>
  );
};

export default ExternalParticipants;
