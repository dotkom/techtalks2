import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100wv;
  height: 20em;
  margin: auto;
  max-width: 70em;
  background-color: #181B1E;
  z-index:10;
`;

const Logo = styled.img`
  margin-top: 0px;
  width: 100%;
  max-height: 100%;
  background-color: #181B1E;
`;

const Header = () => (
  <Wrapper>
    <Logo src='/logo.svg' />
  </Wrapper>
);


export default Header;
