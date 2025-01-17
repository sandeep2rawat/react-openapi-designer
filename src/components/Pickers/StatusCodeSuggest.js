import React from 'react';
import PropTypes from 'prop-types';
import {nodeOperations} from '../../datasets/tree';
import {trim} from 'lodash';
import {getValueFromStore, usePatchOperation} from '../../utils/selectors';
import {statusCodes} from '../../datasets/http';
import {Select} from '@blueprintjs/select';
import {Button, MenuItem, Position} from '@blueprintjs/core';

// bc = allStatusCodes
const items = Object.keys(statusCodes).map((e) => ({
  statusCode: parseInt(e),
  description: statusCodes[e],
}));

const filterStatusCodes = (e, t, n, r) => {
  const i = t.description.toLowerCase();
  const o = e.toLowerCase();

  if (r) {
    return o === i;
  } else {
    return `${t.statusCode}: ${i}`.includes(o);
  }
};

const itemRenderer = (e, {handleClick, modifiers}) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }

  const r = `${e.statusCode}: ${e.description}`;

  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      onClick={handleClick}
      text={r}
      key={e.statusCode}
    />
  );
};

const StatusCodeSuggest = ({
  relativeJsonPath,
  valueInPath,
  onPatch,
  codes,
  activeCodeIndex,
}) => {
  const handlePatch = usePatchOperation();
  const currentCode = getValueFromStore(relativeJsonPath, valueInPath);
  const [original, setOriginal] = React.useState(currentCode);
  return (
    <Select
      items={items}
      itemPredicate={filterStatusCodes}
      itemRenderer={itemRenderer}
      noResults={<MenuItem disabled={true} text="No results." />}
      onItemSelect={(i) => {
        const code = String(i.statusCode);

        if (trim(code) === '') {
          handlePatch(nodeOperations.Remove);
        } else {
          handlePatch(nodeOperations.Replace, code);
        }

        if (onPatch) {
          onPatch(code, original);
        }

        setOriginal(code);

        if (!items.includes(i)) {
          items.push(i);
        }
      }}
      itemDisabled={(e) => !!codes.includes(String(e.statusCode))}
      inputProps={{
        placeholder: 'Filter or add code...',
      }}
      resetOnClose={true}
      popoverProps={{
        position: Position.BOTTOM_RIGHT,
      }}
      createNewItemFromQuery={(e) => ({
        statusCode: Number(e) ? Number(e) : e,
        description: '(Custom Code)',
      })}
      createNewItemRenderer={(e, t, n) => {
        if (e.match(/^\d{3}$/)) {
          return (
            <MenuItem
              icon="add"
              text={'Create ' + e}
              active={t}
              onClick={n}
              shouldDismissPopover={false}
            />
          );
        }
      }}>
      <Button text={codes[activeCodeIndex]} rightIcon="double-caret-vertical" />
    </Select>
  );
};

StatusCodeSuggest.propTypes = {
  relativeJsonPath: PropTypes.array,
  valueInPath: PropTypes.bool,
  onPatch: PropTypes.func,
  codes: PropTypes.array,
  activeCodeIndex: PropTypes.any,
};

export default StatusCodeSuggest;
