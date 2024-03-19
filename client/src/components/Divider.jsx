import React from 'react';
import Icon from './Icon';
import './Divider.css';

const Divider = ({ name, code }) => (
  <h3 className="card-divider">
    {name} <Icon code={code} />
  </h3>
);

export default Divider;
