import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Files from 'react-files';

import { get, del, post } from '../../../utils/apiCalls.js';

const Table = styled.table`
  margin: auto;
  padding: 1em;
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

  function getParticipants() {
    const internal = async () => {
      await get('/admin/participants/external')
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong');
          }
        })
        .then((participants) => setParticipants(participants));
    };
    internal();
  }
  useEffect(() => {
    getParticipants();
  }, [props]);

  async function deleteParticipant(participantUUID) {
    const { id } = props;
    const req = {
      body: JSON.stringify({
        id,
      }),
    };
    await del(`/admin/participants/external/${participantUUID}`, req);
    getParticipants();
  }

  async function importBlob() {
    for (let i = 0; i < loadBlob.length; i++) {
      console.log(loadBlob[i]);
      const internal = async () => {
        const Navn = loadBlob[i].first_name + ' ' + loadBlob[i].last_name;
        const req = {
          body: JSON.stringify({
            Navn,
          }),
        };
        await post('/admin/participants/external', req);
      };
      await internal();
      setImportProcess(`${i + 1} / ${loadBlob.length}`);
    }
    getParticipants();
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
