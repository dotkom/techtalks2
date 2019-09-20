import React from 'react';
import styled from 'styled-components';

import Header from './components/frame/Header';
import MainBody from './components/frame/MainBody';
import Footer from './components/frame/Footer';

function App() {
  const Wrapper = styled.div`
    width: 100%;
    min-height: 100%;
  `;
  return (
    <Wrapper>
      <Header />
      <MainBody />
      <Footer />
    </Wrapper>
  );
}

export default App;
