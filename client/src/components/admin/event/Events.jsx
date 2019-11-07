import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

const Events = props => {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('waiting');

  useEffect(() => {
    const internal = async () => {
      const token = localStorage.getItem('token');
      const req = {
        method: 'POST',
        body: JSON.stringify({
          token,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const res = await fetch('/db/allEvents', req);
      const j = await res.json();
      const { status, events } = j;
      setEvents(events);
      setStatus(status);
    };
    internal();
  })
  if (status === 'denied') {
    return <Redirect to="/admin" />;
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
          {events.map(({ ArrangementID, Dato, AntallPåmeldte, AntallPåmeldteTotal, AntallPlasser }) => (
            <tr key={ArrangementID}>
              <td>{ArrangementID}</td>
              <td>{new Date(Dato).toLocaleDateString()}</td>
              <td>{`${AntallPåmeldte} (${AntallPåmeldteTotal})/${AntallPlasser}`}</td>
                <td><a href={`/admin/event?id=${ArrangementID}`}>Mer info</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Events;
