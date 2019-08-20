import React, { Component } from 'react';
import styled from 'styled-components';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from '../home/Home.jsx';
import Admin from '../admin/Admin.jsx';
import Validate from '../validate/Validate.jsx';
  
class MainBody extends Component {
  render() {
    const Wrapper = styled.div`
      margin: 0px;
      width: 100%;
      text-align: center;
    `;

    return (
      <Wrapper>
        <BrowserRouter>
          <Route exact path='/' component={Home} />
          <Route path='/admin' component={Admin} />
          <Route path='/validate' component={Validate} />
        </BrowserRouter>
      </Wrapper>
    );
  }
}

export default MainBody;
