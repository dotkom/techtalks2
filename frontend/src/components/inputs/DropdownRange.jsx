import React from 'react';

const DropdownRange = props => {
  const { from, to, prefix, suffix, defaultValue, defaultName, onChange, value } = props;
  const options = [];
  for(let i = from; i <= to; i++) {
    options.push((
      <option key={i} value={i}>{prefix}{i}{suffix}</option>
    ));
  }
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      { defaultValue !== undefined ? (
      <option value={defaultValue}>{defaultName || defaultValue}</option>
      ): null}
      {
        options
      }
    </select>
  );
}

export default DropdownRange;
