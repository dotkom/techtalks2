import React from 'react';
import styled from 'styled-components';

const NavbarWrapper = styled.div`
  margin: 0px;
  width: 100%;
  height: 35px;
  background-color: blue;
`,
Knapp = styled.div`
  display: inline-block;
  margin: 0px 25px;
`,
NavbarText = styled.h1`
  color: white;
  margin-top: 0px;
  margin-bottom: 0px;
  font-size: 25px;
  text-align: center;
`;

const Navbar = () => (
  <NavbarWrapper>
    <a href="#about">
      <Knapp>
        <NavbarText>Om Arrangementet</NavbarText>
      </Knapp>
    </a>
    <a href="#program">
      <Knapp>
        <NavbarText>Program</NavbarText>
      </Knapp>
    </a>
    <a href="#paamelding">
      <Knapp>
        <NavbarText>Påmelding</NavbarText>
      </Knapp>
    </a>
  </NavbarWrapper>
);


export default Navbar;
