import React from 'react';
import styled from 'styled-components';

import Header from './components/frame/Header';
import MainBody from './components/frame/MainBody';
import Footer from './components/frame/Footer';

const Wrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  z-index: -100;
  background-color: #383c3c; 
  background-size: 100%;
  background-repeat: repeat-y;

  image-rendering: crisp-edges;
  margin: 0px;
  font-family: 'Roboto', sans-serif;
  font-size: 1em;
`;


function App() {
  return (
    <Wrapper>
      <Header />
      <MainBody />
      <Footer />
    </Wrapper>
  );
}

export default App;
