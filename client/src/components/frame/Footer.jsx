import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.footer`
  margin-top: 2rem;
  width: 100%;
  display: block;
`;

const P = styled.p`
  text-align: center;
`;

const A = styled.a`
  text-align: center;
  /*display: block;*/
`;

const Footer = () => (
  <Wrapper>
    <P>Tech Talks - et arrangement i regi av Ekskursjonskomitenn Online.</P>
    <P>Orgnr. 920 939 627</P>
    <P>
      <A href="mailto: ekskom@online.ntnu.no">ekskom@online.ntnu.no</A>
    </P>
    <P>
      Bedriftskontakt: <A href="mailto: bedriftskontakt@online.ntnu.no">bedriftskontakt@online.ntnu.no</A>
    </P>
  </Wrapper>
);

export default Footer;
