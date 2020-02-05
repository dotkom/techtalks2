import React from 'react';
import styled from 'styled-components';

import Content from './components/frame/Content';
import Footer from './components/frame/Footer';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 70rem;
  margin: 0 auto;
`;

function App() {
  return (
    <Wrapper>
      <Content />
      <Footer />
    </Wrapper>
  );
}

export default App;
