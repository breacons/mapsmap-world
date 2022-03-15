import { Button, Divider, Typography } from 'antd';
import firebase from 'firebase/compat';
import React, { Fragment, useState } from 'react';
import { Field } from 'react-final-form';
import { useSelector } from 'react-redux';
import { isEmpty, isLoaded, useFirebase } from 'react-redux-firebase';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import { Form } from '../../components/Form';
import Input, { Password } from '../../components/Form/Input';
import { validateSchema } from '../../components/Form/validation';
import { PageTitle } from '../../components/Header';
import If from '../../components/If';
import Logo from '../../components/Logo';
import { SpinnerOverlay } from '../../components/SpinnerOverlay';
import { joi } from '../../lib/joi';
import { RootState } from '../../redux/reducers';
import { URL_LANDING, URL_SIGNUP, URL_BOARDS, URL_BOARD } from '../../urls';
import styles from './styles.module.less';

const loginSchema = joi
  .object({
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .required(),
    password: joi.string().required(),
  })
  .unknown(true)
  .required();
const validator = validateSchema(loginSchema);

export const LoginPage = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isLoaded(auth) && !isEmpty(auth)) {
    navigate(URL_BOARDS);
    return null;
  }

  const loginWithFirebase = async ({ email, password }: any) => {
    setError(false);
    setLoading(true);
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      navigate(URL_BOARDS);
    } catch (e) {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <PageTitle title="Log in" />
      <If
        condition={!isLoaded(auth)}
        then={() => <SpinnerOverlay spinning />}
        else={() => (
          <div className={styles.formContainer}>
            <Link to={URL_LANDING}>
              <Logo width={120} className={styles.logo} />
            </Link>
            <Divider />
            <Form
              onSubmit={loginWithFirebase}
              key="edit-contact"
              validator={validator}
              initialValues={{}}
            >
              {({ valid }) => (
                <Fragment>
                  <Field
                    name="email"
                    component={Input}
                    type="text"
                    label="E-mail Address"
                    placeholder="sample@email.com"
                    autoComplete="new-password"
                  />
                  <Field
                    name="password"
                    component={Password}
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                  />
                  <Button
                    disabled={!valid}
                    type="primary"
                    block
                    size="large"
                    htmlType="submit"
                    loading={loading}
                  >
                    <strong>Login to Mapsmap.world</strong>
                  </Button>
                  <If
                    condition={error}
                    then={() => (
                      <Typography.Text className={styles.error}>
                        Unsuccessful login due to invalid credentials.
                      </Typography.Text>
                    )}
                  />
                  <Link to={URL_SIGNUP} className={styles.signUp}>
                    <Button type="link">Don&lsquo;t have an account? Sign up!</Button>
                  </Link>
                </Fragment>
              )}
            </Form>
          </div>
        )}
      />
    </div>
  );
};

export default LoginPage;
