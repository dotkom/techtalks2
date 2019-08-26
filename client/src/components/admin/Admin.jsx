import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import Companies from './Companies';
import NewCompany from './NewCompany';
import Events from './Events';
import NewEvent from './NewEvent';

const EventDetails = () => <h1>Detailed info on the event</h1>;

class Admin extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Route path="/admin/" exact component={AdminLogin} />
          <Route path="/admin/main" component={AdminPanel} />
          <Route path="/admin/companies" component={Companies} />
          <Route path="/admin/newCompany" component={NewCompany} />
          <Route path="/admin/events" component={Events} />
          <Route path="/admin/newEvent" component={NewEvent} />
          <Route path="/admin/eventDetails" component={EventDetails} />
        </BrowserRouter>
      </div>
    );
  }
}

export default Admin;
