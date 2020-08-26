import React from 'react';
import styled from 'styled-components';

const SexyInput = styled.input`
  width: 100%;
  height: 2em;
  box-sizing : border-box;
`;

const InputField = props => {
  const { label, id, val, type, disabled, updateValue } = props;
  if (type === 'textarea') {
    return (
      <div>
        <label htmlFor={id}>
          <p>{label}</p>
        </label>
          <textarea onChange={e => updateValue(e.target.value)} id={id} value={val} disabled={disabled} />
      </div>
    );
  }
  return (
    <div>
      <label htmlFor={id}>
        <p>{label}</p>
      </label>
        <SexyInput key={id} type={type} onChange={e => updateValue(type === "checkbox" ? e.target.checked : e.target.value)} id={id} value={val} disabled={disabled} />
    </div>
  );
}

export default InputField;
