import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div``;

const Validate = props => {
  const [status, setStatus] = useState('waiting');

  useEffect(()=>{
    const internal = async ()=> {
      const ha = new URL(window.location.href).searchParams.get('ha');
      const req = {
        method: 'POST',
        body: JSON.stringify({
          hash: ha,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const res = await fetch('db/validering', req);
      const jsoned = await res.json();
      const { status } = jsoned;
      setStatus(status);
    };
    internal();
  }, []);


  if (status === 'succeeded') {
    return (
      <Wrapper>
        <h2>Påmeldingen din har blitt validert!</h2>
      </Wrapper>
    );
  }
  if (status === 'repeat') {
    return (
      <Wrapper>
        <h2>Påmeldingen din har allerede blitt validert</h2>
      </Wrapper>
    );
  }
  if (status === 'failed') {
    return (
      <Wrapper>
        <h2>Kunne ikke validere påmeldingen din</h2>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <h2>Validerer påmelding</h2>
    </Wrapper>
  );
}

export default Validate;
