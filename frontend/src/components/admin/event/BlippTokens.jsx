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

  function updateTokens() {
    const internal = async () => {
      const token = localStorage.getItem('token');
      const { id } = props;
      const req = {
        body: JSON.stringify({
          token,
          id,
        }),
      };
      const res = await post('/db/blippTokens', req);
      const p = await res.json();
      setTokens(p);
    };
    internal();
  }
  useEffect(() => {
    updateTokens();
  }, [props]);

  async function deleteToken(blippToken) {
    console.log(blippToken);
    const token = localStorage.getItem('token');
    const req = {
      body: JSON.stringify({
        token,
        blippToken,
      }),
    };
    const res = await post(`/db/blippTokens/delete`, req);
    updateTokens();
  }

  async function newParalell() {
    const token = localStorage.getItem('token');
    const req = {
      body: JSON.stringify({
        token,
        paralellNo: newTokenParalell,
      }),
    };
    const res = await post(`/db/blippTokens/create`, req);
    updateTokens();
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
