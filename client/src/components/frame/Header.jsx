import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100wv;
  height: 7em;
  background-color: black;
`;

const P = styled.p`
  margin-top: 0px;
  color: white;
`;

const Header = () => (
  <Wrapper>
    <P>Tik tok lol</P>
  </Wrapper>
);


export default Header;
