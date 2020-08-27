import React, { useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import InputField from '../inputs/InputField.jsx';

import { blippGet } from '../../utils/apiCalls.js';

import styled from 'styled-components';

const Wrapper = styled.div`
  max-width: 70em;
  margin: 0 auto;
  padding: 5em;
  z-index: 0;
  background-color: #181b1e;

  color: #fff;
`;

const BlippCheck = (props) => {
  const { setCorrectToken, setTokenBlob } = props;
  let [authToken, setUpdateToken] = useState('');

  async function validateBlipp() {
    try {
      const res = await blippGet(`/check`, authToken);
      if (res.status == 200) {
        let json = await res.json();
        console.log(json);
        setTokenBlob(json);
        setCorrectToken(true);
      } else {
        alert('Wrong token');
      }
      //
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <Wrapper>
      <h2>Skriv inn blipp-token</h2>
      <InputField type="text" label="Token:" val={authToken} updateValue={setUpdateToken} />
      <button type="button" onClick={validateBlipp}>
        Test
      </button>
    </Wrapper>
  );
};

export default BlippCheck;
