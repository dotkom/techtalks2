import React, { useState, useEffect } from 'react';

import { get, post } from '../../utils/apiCalls.js';

import styled from 'styled-components';

const Wrapper = styled.div`
  max-width: 70em;
  margin: 0 auto;
  padding: 5em;
  z-index: 0;
  background-color: #181b1e;

  color: #fff;
`;

const BlippInput = styled.input`
  background-color: #080b0e;
  min-width: 20em;
  min-height: 2.5em;
  font-size: 2em;
  font-family: monospace;
  color: #f89934;
  border: 1px solid #00b8b2;
`;

const LoadingIndicatorWrapper = styled.div``;

const CancelButton = styled.div`
  background-color: #080b0e;
  border: 1px solid #b80062;
  font-size: 2em;

  min-width: 5em;
  mar-width: 50em;
  min-height: 1.5em;
  text-align: left;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);

  padding: 0.5em;

  flex-grow: 1;

  margin: 0.5em;

  :hover {
    border: 1px solid #f89934;
    cursor: pointer;
  }

  p {
    vartical-align: middle;
  }
`;

const ParticipantContainer = styled.div`
  background-color: #080b0e;
  border: 1px solid #00b8b2;
  font-size: 2em;

  min-width: 5em;
  min-height: 1.5em;
  text-align: left;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);

  padding: 0.5em;

  flex-grow: 1;

  margin: 0.5em;

  :hover {
    border: 1px solid #f89934;
    cursor: pointer;
  }

  p {
    vartical-align: middle;
  }
`;

const ParticipantList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const BlippScreen = (props) => {
  const { tokenBlob } = props;

  let [currentNfcID, setCurrentNfcID] = useState('');
  let [loading, setLoading] = useState(false);
  let [currentUser, setCurrentUser] = useState(null);
  let [success, setSuccess] = useState(false);

  let [participants, setParticipants] = useState([]);

  async function validateNfc() {
    let res = await get(`/blipp/nfc/${currentNfcID}`, tokenBlob.Token);
    let js = await res.json();
    setCurrentUser(js);
    console.log(js);
    if (typeof js.ParticipantName !== 'undefined') {
      triggerPassingCreation(js);
    } else {
      setLoading(false);
    }
  }

  function resetState() {
    setSuccess(false);
    setCurrentUser(null);
    setCurrentNfcID('');
    setLoading(false);
  }

  let handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      console.log('do validate');
      setLoading(true);
      validateNfc();
    }
  };

  function updateNames() {
    const internal = async () => {
      const res = await get('/blipp/participants', props.tokenBlob.Token);
      let p = await res.json();
      p = p.map((participant) => {
        let parts = participant.split(' ');
        parts = parts.map((part) => {
          return part.length == 0 ? part : part[0].toUpperCase() + part.slice(1);
        });

        return parts.join(' ');
      });
      setParticipants(p.sort());
    };
    internal();
  }
  useEffect(() => {
    updateNames();
  }, [props]);

  function revertToStart() {
    setCurrentUser(null);
    setCurrentNfcID('');
    setLoading(false);
  }

  async function triggerPassingCreation(userObj) {
    setLoading(true);
    const req = {
      body: JSON.stringify({
        userName: userObj.ParticipantName,
      }),
    };
    const res = await get(`/blipp/passing/${currentNfcID}`, req, tokenBlob.Token);
    if (res.status !== 200) {
      alert('Failed to register attendance, contact staff');
      setLoading(false);
      setCurrentUser(null);
      setCurrentNfcID(null);
    } else {
      setSuccess(true);
    }
  }

  async function setMapping(userName) {
    setLoading(true);
    const req = {
      body: JSON.stringify({
        userName,
      }),
    };
    const res = await post(`/blipp/nfc/${currentNfcID}`, req, tokenBlob.Token);
    if (res.status !== 200) {
      alert('Failed to create mapping...');
      setCurrentUser(null);
      setCurrentNfcID('');
      setLoading(false);
    } else {
      let userObj = currentUser;
      userObj.ParticipantName = userName;
      triggerPassingCreation(userObj);
    }
  }

  let LoadingIndicator = (
    <LoadingIndicatorWrapper>
      <p>
        <b>Please wait...</b>
      </p>
    </LoadingIndicatorWrapper>
  );

  return (
    <Wrapper>
      <h2>Parallell {tokenBlob.Paralell}</h2>
      {success ? (
        <div>
          <h2>Velkommen!</h2>
          <ParticipantContainer
            onClick={() => {
              resetState();
            }}
          >
            <p>Ny scan</p>
          </ParticipantContainer>
        </div>
      ) : loading ? (
        LoadingIndicator
      ) : currentUser == null ? (
        <BlippInput
          type="text"
          hint="NFC-ID"
          onChange={(e) => setCurrentNfcID(e.target.value)}
          value={currentNfcID}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <div>
          <h3>Velkommen til Tech Talks. Velg navnet ditt i listen under.</h3>
          <CancelButton onClick={revertToStart}>
            <p>Angre</p>
          </CancelButton>
          <ParticipantList>
            {participants.map((part) => {
              return (
                <ParticipantContainer
                  onClick={() => {
                    setMapping(part.toLowerCase());
                  }}
                >
                  <p>{part}</p>
                </ParticipantContainer>
              );
            })}
          </ParticipantList>
        </div>
      )}
    </Wrapper>
  );
};

export default BlippScreen;
