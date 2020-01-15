import React, { useState, useEffect } from 'react';

import { post } from '../../utils/apiCalls.js';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [status, setStatus] = useState('waiting');

  useEffect(()=>{
    const internal = async () => {
      const token = localStorage.getItem('token');
      const req = {
        body: JSON.stringify({
          token
        })
      };
      const res = await post('/db/getRooms', req);
      const j = await res.json();
      const { status, rooms } = j;
      console.log(j);
      setStatus(status);
      setRooms(rooms);
    };
    internal();
  }, []);

  return (
    <div>
      <h1>Alle rom</h1>
      <p><a href="/admin/newRoom">Legg til nytt</a></p>
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
}

export default Rooms;
