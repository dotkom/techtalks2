import React from 'react';
import styled from 'styled-components';

import Header from './components/frame/Header';
import MainBody from './components/frame/MainBody';
import Footer from './components/frame/Footer';

const Wrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  z-index: -100;
  background-color: #292929; 
  background-size: 100%;
  background-repeat: repeat-y;
  position: absolute;
  image-rendering: crisp-edges;
  margin: 0px;
  font-family: 'Roboto', sans-serif;
  font-size: 1em;
  overflow: hidden;

`;

const BallContainer = styled.img`
  position: absolute;
  z-index:-1;
  width: 100%;
`;

const FancyLines = styled.img`
  width: 100%;
  bottom: 10em;
  position: absolute;
  z-index: -1;
`;


function App() {
  return (
    <Wrapper>
      <BallContainer src="/triangle.svg" />
      <Header />
      <MainBody />
      <Footer />
    </Wrapper>
  );
}

export default App;
