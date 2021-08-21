import {configureStore} from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import schemaReducer from './modules/schema';
import dropdownReducer from './modules/dropdown';
import openapi from './modules/openapi';

const defaultStoreObject = {
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([thunkMiddleware]),
  devTools: true,
};

const schemaStoreObject = {
  ...defaultStoreObject,
  reducer: {
    schema: schemaReducer,
    dropdown: dropdownReducer,
  },
};

export const schemaStore = configureStore(schemaStoreObject);
export const responseStore = configureStore(schemaStoreObject);
export const openapiStore = configureStore({
  ...defaultStoreObject,
  reducer: {openapi},
});
