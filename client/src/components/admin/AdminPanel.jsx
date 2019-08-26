import React, { Component } from 'react';

class AdminPanel extends Component {
  render() {
    return (
      <div>
        <h1>Hey there fella, what would you like to do?</h1>
        <ul>
          <li>
            <a href="/admin/companies">Se selskaper</a>
          </li>
          <li>
            <a href="/admin/events">Se arrangementer</a>
          </li>
        </ul>
      </div>
    );
  }
}

export default AdminPanel;
