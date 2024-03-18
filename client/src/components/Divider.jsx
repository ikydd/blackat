import React from 'react';
import Icon from './Icon';
import './Divider.css';

const Divider = ({ name, code }) => (
  <h2 className="card-divider">
    {name} <Icon code={code} />
  </h2>
);

export default Divider;
