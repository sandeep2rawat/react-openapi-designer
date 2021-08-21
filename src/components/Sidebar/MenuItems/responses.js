import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from './base';

const Responses = (props) => {
  return (
    <>
      <MenuItem icon="folder-open" label="Responses" />
      {Object.keys(props.responses).map((response, i) => (
        <MenuItem
          icon="exchange"
          inner
          label={props.responses[response].title || response}
          onClick={() => props.onClick({itemPath: {response}})}
          key={i}
        />
      ))}
    </>
  );
};

Responses.propTypes = {
  responses: PropTypes.object,
  onClick: PropTypes.func,
};

export default Responses;
