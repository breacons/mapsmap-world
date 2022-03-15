import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { actionTypes } from 'react-redux-firebase';

import { firebaseConfig } from '../config';
import { rootReducer } from './reducers';

const rrfConfig = {
  userProfile: 'users',
};
const fb = firebase.initializeApp(firebaseConfig);

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [actionTypes.LOGIN],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
};
