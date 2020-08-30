import React, { useState, useEffect } from 'react';

import { get } from '../../../utils/apiCalls.js';

const Events = (props) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const internal = async () => {
      await get('/admin/events')
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('something went wrong');
          }
        })
        .then((events) => setEvents(events));
    };
    internal();
  }, []);
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
              <td>
                <a href={`/admin/event?id=${ArrangementID}`}>Mer info</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Vil du lage et nytt arrangement, kan du gjøre det <a href="/admin/newEvent">her</a>
      </p>
    </div>
  );
};

export default Events;
