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
  const [newTokenparallel, setNewTokenparallel] = useState(0);

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

  async function newparallel() {
    const req = {
      body: JSON.stringify({
        parallelNo: newTokenparallel,
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
                <td>parallel</td>
              </tr>
            </thead>
            <tbody>
              {tokens.map((blippToken) => {
                return (
                  <tr>
                    <td>
                      <code>{blippToken.Token}</code>
                    </td>
                    <td>{blippToken.parallel}</td>
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
            <i>parallel 0 betyr at token gjelder for events som varer over alle paralleler</i>
          </p>
          <div>
            <h2>Ny token</h2>
            <InputField type="number" label="parallel: " val={newTokenparallel} updateValue={setNewTokenparallel} />
            <button type="button" onClick={newparallel}>
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
