import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import AdminLogin from './AdminLogin.jsx';
import AdminPanel from './AdminPanel.jsx';
import Companies from './company/Companies.jsx';
import NewCompany from './company/NewCompany.jsx'; 
import Events from './event/Events.jsx';
import NewEvent from './event/NewEvent.jsx';
import Event from './event/Event.jsx';
import NewProgramEvent from './event/NewProgramEvent.jsx';
import ImportCompany from './company/ImportCompany.jsx';
import Rooms from './Rooms.jsx'
import NewRoom from './NewRoom.jsx'


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
          <Route path='/admin/importCompany' component={ImportCompany} />
          <Route path='/admin/events' component={Events} />
          <Route path='/admin/newEvent' component={NewEvent} />
          <Route path='/admin/event' component={() => <Event id={params.get('id')} />} />
          <Route path='/admin/newProgramEvent' component={() => <NewProgramEvent arrangementID={params.get('id')} />} />
          <Route path='/admin/rooms' component={Rooms} />
          <Route path='/admin/newRoom' component={NewRoom} />
        </BrowserRouter>
      </div>
    );
  }
}

export default Admin;
