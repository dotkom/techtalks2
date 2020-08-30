import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { post } from '../../utils/apiCalls.js';

const Wrapper = styled.div`
  max-width: 70em;
  margin: 0 auto;
  z-index: 0;
  background-color: #181b1e;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);

  color: #fff;
`;

const Validate = (props) => {
  const [status, setStatus] = useState('waiting');

  useEffect(() => {
    const internal = async () => {
      const ha = new URL(window.location.href).searchParams.get('ha');
      const req = {
        body: JSON.stringify({
          hash: ha,
        }),
      };
      await post(`/events/validering`, req).then((response) => {
        if (response.ok) {
          setStatus('success');
        }
      });
    };
    internal();
  }, []);

  if (status === 'success') {
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
  if (status === 'full') {
    return (
      <Wrapper>
        <h2>Arrangementet er dessverre fullt</h2>
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
};

export default Validate;
