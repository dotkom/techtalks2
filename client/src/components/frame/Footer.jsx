import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100px;
  background-color: gray;
`;

const P = styled.p`
  margin: auto;
  width: 400px;
  max-width: 100%;
`;

class Footer extends Component {
  render() {
    return (
      <Wrapper>
        <P>
          Organisasjonsnavn <b>Ekskursjonskomiteen Online</b>
          <br/>
          Orgnr. <b>920 939 627</b>
          <br />
          Epost <b>ekskom@online.ntnu.no</b>
        </P>
      </Wrapper>
    );
  }
}

export default Footer;
