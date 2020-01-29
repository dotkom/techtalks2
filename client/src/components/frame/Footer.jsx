import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100wv;
  padding: 1em;
`;

const P = styled.p`
  /* width: 400px; */
  text-align: center;
  max-width: 100%;
  color: white;
`;

const Footer = () => (
  <Wrapper>
      <P>Tech Talks - et arrangement i regi av EKSKURSJONSKOMMITEEN ONLINE.</P>
      <P>Orgnr. 920 939 627</P>
      <P>ekskom@online.ntnu.no</P>
      <P>Bedriftskontakt: bedriftskontakt@online.ntnu.no</P>
  </Wrapper>
);

export default Footer;
