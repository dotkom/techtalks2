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

const BlippTokens = (props) => {
  const [tokens, setTokens] = useState([]);
  const [newTokenParalell, setNewTokenParalell] = useState(0);

  function getTokens() {
    const internal = async () => {
      get('/admin/blipp/tokens')
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong');
          }
        })
        .then((tokens) => setTokens(tokens));
    };
    internal();
  }
  useEffect(() => {
    getTokens();
  }, [props]);

  async function deleteToken(blippToken) {
    await del(`/admin/blipp/tokens/${blippToken}`);
    getTokens();
  }

  async function newParalell() {
    const req = {
      body: JSON.stringify({
        paralellNo: newTokenParalell,
      }),
    };
    await post(`/admin/blipp/tokens`, req);
    getTokens();
  }

  return (
    <div>
      <button type="button" onClick={props.toggleBlippTokens}>{`${
        props.showBlippTokens ? 'Skjul' : 'Vis'
      } blipp-tokens`}</button>
      {props.showBlippTokens ? (
        <div>
          <Table>
            <thead>
              <tr>
                <td>Token</td>
                <td>Paralell</td>
              </tr>
            </thead>
            <tbody>
              {tokens.map((blippToken) => {
                return (
                  <tr>
                    <td>
                      <code>{blippToken.Token}</code>
                    </td>
                    <td>{blippToken.Paralell}</td>
                    <td>
                      <button
                        onClick={() => {
                          deleteToken(blippToken.Token);
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
          <p>
            <i>Paralell 0 betyr at token gjelder for events som varer over alle paraleller</i>
          </p>
          <div>
            <h2>Ny token</h2>
            <InputField type="number" label="Paralell: " val={newTokenParalell} updateValue={setNewTokenParalell} />
            <button type="button" onClick={newParalell}>
              Lagre
            </button>
          </div>
        </div>
      ) : (
        <br />
      )}
    </div>
  );
};

export default BlippTokens;
