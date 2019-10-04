import React from 'react';
import styled from 'styled-components';

import Header from './components/frame/Header';
import MainBody from './components/frame/MainBody';
import Footer from './components/frame/Footer';

const Wrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: lightgrey;
  z-index: -100;
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
