import React from 'react';

const InputField = props => {
  const { label, id, val, type, disabled, updateValue } = props;
  if (type === 'textarea') {
    return (
      <div>
        <label htmlFor={id}>
          <span>{label}</span>
          <textarea onChange={e => updateValue(e.target.value)} id={id} value={val} disabled={disabled} />
        </label>
      </div>
    );
  }
  return (
    <div>
      <label htmlFor={id}>
        <span>{label}</span>
        <input key={id} type={type} onChange={e => updateValue(e.target.value)} id={id} value={val} disabled={disabled} />
      </label>
    </div>
  );
}

export default InputField;
