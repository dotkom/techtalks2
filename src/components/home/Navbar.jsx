import React from 'react';
import styled from 'styled-components';

const NavbarWrapper = styled.nav`
  background-color: #181b1e;
  z-index: 0;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
`;

const NavbarA = styled.a`
  flex-grow: 1;
  flex-basis: 0;
`;

const Knapp = styled.div`
  display: inline-block;
  font-size: 1.2em;
  padding: 1em;
  z-index: 1;
  &:hover {
    /*text-decoration: white underline;*/
    background-color: rgba(255, 255, 255, 0.1);
  }
`;
const NavbarText = styled.h1`
  color: white;
  margin-top: 0px;
  margin-bottom: 0px;
  font-size: 1.1em;
  text-align: center;
  font-weight: 900;
`;

const Navbar = () => {
  const NavOptions = [
    {
      id: 'program',
      name: 'Program',
    },
    {
      id: 'paamelding',
      name: 'Påmelding',
    },
    {
      id: 'about',
      name: 'Om arrangementet',
    },
  ];
  return (
    <NavbarWrapper>
      {NavOptions.map(({ id, name }) => (
        <NavbarA key={id} href={`#${id}`}>
          <Knapp>
            <NavbarText>{name}</NavbarText>
          </Knapp>
        </NavbarA>
      ))}
    </NavbarWrapper>
  );
};

export default Navbar;
