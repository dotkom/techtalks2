import React, { Component } from 'react';
import styled from 'styled-components';

class Header extends Component {
  render() {
    const Wrapper = styled.div`
      width: 100%;
      height: 100px;
    `;
    return (
      <Wrapper>
        <p>Tik tok lol</p>
      </Wrapper>
    );
  }
}

export default Header;
