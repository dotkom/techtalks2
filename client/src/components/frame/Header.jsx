import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100wv;
  height: 15em;
  background-color: black;
`;

const Img = styled.img`
  margin-top: 0px;
  max-height: 100%;
`;

const Header = () => (
  <Wrapper>
    <Img src='/logo.svg' />
  </Wrapper>
);


export default Header;
