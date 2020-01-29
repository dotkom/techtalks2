import React from 'react';
import styled from 'styled-components';

import Header from './components/frame/Header';
import MainBody from './components/frame/MainBody';
import Footer from './components/frame/Footer';

const Wrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  z-index: -100;
  background-color: #488582; 
  background-size: 100%;
  background-repeat: repeat-y;
  position: absolute;
  image-rendering: crisp-edges;
  margin: 0px;
  font-family: 'Roboto', sans-serif;
  font-size: 1em;
  background-image: url("/dots.svg");
  background-repeat: repeat;
`;

const BallContainer = styled.svg`
position: absolute;
  z-index:-1;
  top: -75em;
  left: 50%;
  width: 100%;
  height: 200em;
  transform: translate(-50%, -50%);
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
      <FancyLines src="/fancyLines.svg" />
      <Header />
      <MainBody />
      <Footer />
    </Wrapper>
  );
}

export default App;
