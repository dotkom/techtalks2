import React from 'react';
import styled from 'styled-components';

const UL = styled.ul`
  margin: auto;
  text-align: left;
`;

const AdminPanel = () => (
  <div>
    <h1>Congratulations, hacker! You now have full control of the Tech Talks site! what would you like to do?</h1>
    <UL>
      <li>
        <a href="/admin/companies">Se selskaper</a>
      </li>
      <li>
        <a href="/admin/events">Se arrangementer</a>
      </li>
      <li>
        <a href="/admin/rooms">Se rom</a>
      </li>
      <li>
        <a href="https://i.kym-cdn.com/photos/images/newsfeed/000/771/614/c2d.jpg">Explode</a>
      </li>
    </UL>
  </div>
);

export default AdminPanel;
