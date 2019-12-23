import React from 'react';
import styled from 'styled-components';

const NavbarWrapper = styled.nav`
  margin: 0px 0px 100px;
  flex: 1;
  background-color: #383c3c;
  z-index: 0;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
`;

const Knapp = styled.div`
  display: inline-block;
  font-size: 1.2em;
  padding: 1.5em;
  z-index: 1;
  &:hover {
    text-decoration: white underline;
    background-color: rgba(255,255,255,0.1);
  }
`;
const NavbarText = styled.h1`
  color: white;
  margin-top: 0px;
  margin-bottom: 0px;
  font-size: 1.5em;
  text-align: center;
`;

const Navbar = () => {
  const NavOptions = [
    {
      id: 'program',
      name: 'Program'
    },
    {
      id: 'paamelding',
      name: 'Påmelding'
    },
    {
      id: 'about',
      name: 'Om Arrangementet'
    }
  ];
  return (
    <NavbarWrapper>
      {NavOptions.map(({id,name})=><a key={id} href={`#${id}`}><Knapp><NavbarText>{name}</NavbarText></Knapp></a>)}
    </NavbarWrapper>
  );
};


export default Navbar;
