import React, { useState, useEffect } from 'react';

import { get } from '../../utils/apiCalls.js';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  //const [_, setStatus] = useState('waiting');

  useEffect(() => {
    const internal = async () => {
      await get('/admin/rooms')
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong');
          }
        })
        .then(({ rooms }) => setRooms(rooms));
    };
    internal();
  }, []);

  return (
    <div>
      <h1>Alle rom</h1>
      <p>
        <a href="/admin/newRoom">Legg til nytt</a>
      </p>
      <table>
        <thead>
          <tr>
            <th>Navn</th>
            <th>Bygning</th>
            <th>MazemapURL</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((rom, index) => (
            <tr key={index}>
              <td>{rom.Navn}</td>
              <td>{rom.Bygning}</td>
              <td>
                <a href={rom.MazemapURL}>{rom.MazemapURL}</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Rooms;
