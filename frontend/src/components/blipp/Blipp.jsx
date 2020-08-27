import React, { useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import BlippCheck from './BlippCheck.jsx';
import BlippScreen from './BlippScreen.jsx';

import styled from 'styled-components';

const Wrapper = styled.div`
  max-width: 70em;
  margin: 0 auto;
  z-index: 0;
  background-color: #181b1e;

  color: #fff;
`;

const Blipp = (props) => {
  const [tokenBlob, setTokenBlob] = useState('');
  const [correctToken, setCorrectToken] = useState(false);

  return (
    <Wrapper>
      {!correctToken ? (
        <BlippCheck setTokenBlob={setTokenBlob} setCorrectToken={setCorrectToken} />
      ) : (
        <BlippScreen tokenBlob={tokenBlob} />
      )}
    </Wrapper>
  );
};

export default Blipp;
