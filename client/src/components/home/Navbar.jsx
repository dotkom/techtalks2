import React, { Component } from 'react';
import styled from 'styled-components';

class Navbar extends Component {
  render() {
    const Navbar = styled.div`
      margin: 0px;
      width: 100%;
      height: 35px;
      background-color: blue;
    `;
    const Knapp = styled.div`
      display: inline-block;
      margin: 0px 25px;
    `;
    const NavbarText = styled.h1`
      color: white;
      margin-top: 0px;
      margin-bottom: 0px;
      font-size: 25px;
      text-align: center;
    `;
    return (
      <Navbar>
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
      </Navbar>
    );
  }
}

export default Navbar;
