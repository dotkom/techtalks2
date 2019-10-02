import React from 'react';

const DropdownMenu = props => (
  <select value={props.value} onChange={e => props.onChange(e.target.value)}>
    <option value={props.defaultValue}>{props.defaultOption}</option>
    {
      props.options.map((option, index) => <option key={index} value={option[props.valueField]}>{option[props.displayField]}</option>)
    }
  </select>
);

export default DropdownMenu;
