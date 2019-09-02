import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      status: 'waiting'
    }

  }

  async componentDidMount() {
    const token = localStorage.getItem('token');
    const req = {
      method: 'POST',
      body: JSON.stringify({
        token,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const res = await fetch('/db/allEvents', req);
    const j = await res.json();
    const { status, events } = j;
    this.setState({
      status,
      events
    });
  }

  render() {
    const { status, events } = this.state;
    if (status === 'denied') {
      return <Redirect to='/admin' />;
    }
    return (
      <div>
        <h1>Alle arrangementer</h1>
        <table>
          <thead>
            <tr>
              <th>ArrangementID</th>
              <th>Dato</th>
              <th>Påmeldte</th>
              <th>Mer info</th>
            </tr>
          </thead>
          <tbody>
            {
              events.map(({ArrangementID, Dato, AntallPåmeldte, AntallPlasser}) => (
                <tr key={ArrangementID}>
                  <td>{ArrangementID}</td>
                  <td>{new Date(Dato).toLocaleDateString()}</td>
                  <td>{`${AntallPåmeldte}/${AntallPlasser}`}</td>
                  <td><a href={`/admin/event?id=${ArrangementID}`}>Mer info</a></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default Events;
