import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { get } from '../../../utils/apiCalls.js';

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

const ScanContainer = styled.div`
  border: 1px solid #00b8b2;

  i {
    font-size: 0.7em;
  }
`;

function UserScanHistory(scan) {
  return (
    <ScanContainer>
      <p>Parallell {scan.ParalellNo}</p>
      <p>{scan.ScanTime}</p>
      <p>
        <i>{scan.UUID}</i>
      </p>
    </ScanContainer>
  );
}

const ScanStatus = (props) => {
  const [users, setUsers] = useState([]);

  function getTokens() {
    const internal = async () => {
      await get('/admin/participants/scanStatus')
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong');
          }
        })
        .then((users) => setUsers(users));
    };
    internal();
  }
  useEffect(() => {
    getTokens();
  }, [props]);

  return (
    <div>
      <button type="button" onClick={props.toggleScanStatus}>{`${
        props.showScanStatus ? 'Skjul' : 'Vis'
      } scanne-status`}</button>
      {props.showScanStatus ? (
        <div>
          <Table>
            <thead>
              <tr>
                <td>Navn</td>
                <td>Scanninger</td>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr>
                    <td>
                      <code>{user.name}</code>
                    </td>
                    <td>
                      {user.scans.length == 0
                        ? null
                        : user.scans.map((scan) => {
                            return UserScanHistory(scan);
                          })}
                      <i>{user.scans.length} scanninger</i>
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

export default ScanStatus;
