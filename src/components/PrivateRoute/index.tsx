import React from 'react';
import { useSelector } from 'react-redux';
import { isEmpty, isLoaded } from 'react-redux-firebase';
import { Navigate, Route, useLocation } from 'react-router-dom';

import { RootState } from '../../redux/reducers';
import { SpinnerOverlay } from '../SpinnerOverlay';
import { useNavigate } from 'react-router';
import { URL_LOGIN } from '../../urls';

export default function PrivateRoute({ children, ...rest }: any) {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const location = useLocation();

  if (!isLoaded(auth)) {
    return <SpinnerOverlay spinning />;
  }

  // if (!(isLoaded(auth) && !isEmpty(auth))) {
  //   navigate('/', { state: { from: location } });
  // }

  // return <Route {...rest} element={children} />;

  return isLoaded(auth) && !isEmpty(auth) ? children : <Navigate to={URL_LOGIN} state={location} />;
}
