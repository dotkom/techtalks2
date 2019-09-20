import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import AdminLogin from './AdminLogin.jsx';
import AdminPanel from './AdminPanel.jsx';
import Companies from './Companies.jsx';
import NewCompany from './NewCompany.jsx'; 
import Events from './Events.jsx';
import NewEvent from './NewEvent.jsx';
import Event from './Event.jsx';


class Admin extends Component {
  render() {
    const U = new URL(window.location.href);
    const params = U.searchParams;
    return (
      <div>
        <BrowserRouter>
          <Route path='/admin/' exact component={AdminLogin} />
          <Route path='/admin/main' component={AdminPanel} />
          <Route path='/admin/companies' component={Companies} />
          <Route path='/admin/newCompany' component={NewCompany} />
          <Route path='/admin/events' component={Events} />
          <Route path='/admin/newEvent' component={NewEvent} />
          <Route path='/admin/event' component={() => <Event id={params.get('id')} />} />
        </BrowserRouter>
      </div>
    );
  }
}

export default Admin;
