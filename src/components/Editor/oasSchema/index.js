import React from 'react';
import PropTypes from 'prop-types';
import {StoresContext} from '../../Context';
import RootSchema from './root';

const Schema = ({relativeJsonPath}) => {
  const stores = React.useContext(StoresContext);
  const {activeSourceNodeId} = stores.uiStore;
  const schemaCollection = stores.oasSchemaCollection;
  const storeId = relativeJsonPath
    ? [activeSourceNodeId, ...relativeJsonPath].join('/')
    : activeSourceNodeId;
  const store = schemaCollection.lookup(storeId, {
    id: storeId,
    relativeJsonPath,
    sourceNodeId: activeSourceNodeId,
  });

  return <RootSchema store={store} stores={stores} />;
};

Schema.propTypes = {
  relativeJsonPath: PropTypes.array,
};

export default Schema;
