import React from 'react';
import styled from 'styled-components';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from '../home/Home';
import Admin from '../admin/Admin';
import Validate from '../validate/Validate';

const Wrapper = styled.div`
  margin: 0px;
  width: 100%;
  background-color: #383c3c;
  color: #fff;
  text-align: center;
`;

const MainBody = () => (
  <Wrapper>
    <BrowserRouter>
      <Route exact path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route path="/validate" component={Validate} />
    </BrowserRouter>
  </Wrapper>
);

export default MainBody;
