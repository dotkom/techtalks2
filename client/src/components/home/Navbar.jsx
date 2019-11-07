import React from 'react';
import styled from 'styled-components';

const NavbarWrapper = styled.div`
  margin: 0px;
  width: 100%;
  background-color: blue;
  z-index: 0;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
`;
const Knapp = styled.div`
  display: inline-block;
  margin: 0px 1.5em;
  z-index: 1;
  &:hover {
    text-decoration: white underline;
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
      {NavOptions.map(({id,name})=><a href={`#${id}`}><Knapp><NavbarText>{name}</NavbarText></Knapp></a>)}
    </NavbarWrapper>
  );
};


export default Navbar;
