import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100wv;
  height: 15em;
  background-color: #383c3c;
`;

const Logo = styled.img`
  margin-top: 0px;
  width: 100%;
  max-height: 100%;
`;

const Header = () => (
  <Wrapper>
    <Logo src='/logo.svg' />
  </Wrapper>
);


export default Header;
