import React from 'react';
import styled from 'styled-components';


const Wrapper = styled.footer`
  margin-top: 2rem;
  width: 100%;
`;

const P = styled.p`
  text-align: center;
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
