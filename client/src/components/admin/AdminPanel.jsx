import React from 'react';
import styled from 'styled-components';


const UL = styled.ul`
  margin: auto;
  text-align: left;
`;


const AdminPanel = () => (
  <div>
    <h1>Hey there fella, what would you like to do?</h1>
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
    </UL>
  </div>
);

export default AdminPanel;
