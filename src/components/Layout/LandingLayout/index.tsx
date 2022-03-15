import { Button, Col, Dropdown, Image, Layout, Menu, Row, Typography } from 'antd';
import classNames from 'classnames';
import firebase from 'firebase/compat';
// import Link from 'next/link';
import React, { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty, isLoaded } from 'react-redux-firebase';
import { Link, useNavigate } from 'react-router-dom';

import { RootState } from '../../../redux/reducers';
import { URL_ADMIN, URL_ADMIN_LOGIN, URL_LANDING } from '../../../urls';
import If from '../../If';
import { BaseLayout } from '../BaseLayout';
import styles from './Landing.module.less';
import logo from './logo.svg';

const { Content, Footer, Header } = Layout;

interface Props {
  title?: string;
}

export default function LandingLayout(props: PropsWithChildren<Props>) {
  const profile = useSelector((state: RootState) => state.firebase.profile);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await firebase.auth().signOut();
    navigate(URL_LANDING);
  };

  return (
    <BaseLayout className={styles.layout}>
      {/*<Header className={classNames([styles.container, styles.header])}>*/}
      {/*  <Link to="/" className={styles.logoContainer}>*/}
      {/*    /!*<Button type="link">*!/*/}
      {/*    <Image src={logo} preview={false} width={280} className={styles.logo} />*/}
      {/*    /!*</Button>*!/*/}
      {/*  </Link>*/}
      {/*  <If*/}
      {/*    condition={!isEmpty(profile)}*/}
      {/*    then={() => (*/}
      {/*      <Link to={URL_ADMIN}>*/}
      {/*        <Dropdown*/}
      {/*          placement="bottomRight"*/}
      {/*          arrow*/}
      {/*          overlay={*/}
      {/*            <Menu>*/}
      {/*              <Menu.Item>*/}
      {/*                <span onClick={handleSignOut}>Sign Out</span>*/}
      {/*              </Menu.Item>*/}
      {/*            </Menu>*/}
      {/*          }*/}
      {/*        >*/}
      {/*          <Button type="link" className={styles.userName}>*/}
      {/*            {profile.firstName}*/}
      {/*          </Button>*/}
      {/*        </Dropdown>*/}
      {/*      </Link>*/}
      {/*    )}*/}
      {/*    else={() => (*/}
      {/*      <Link to={URL_ADMIN_LOGIN}>*/}
      {/*        <Button type="primary" className={styles.signInButton} loading={!isLoaded(profile)}>*/}
      {/*          {isLoaded(profile) && 'Organiser Platform'}*/}
      {/*        </Button>*/}
      {/*      </Link>*/}
      {/*    )}*/}
      {/*  />*/}
      {/*</Header>*/}
      <Content className={classNames([styles.container, styles.content])}>{props.children}</Content>
      {/*<Footer className={classNames([styles.footer])}>*/}
      {/*  <div className={styles.container}>*/}
      {/*    <Link to="/">*/}
      {/*      <Image src={logo} preview={false} width={160} className={styles.logo} />*/}
      {/*    </Link>*/}
      {/*    <Row gutter={24}>*/}
      {/*      <Col xs={24} sm={12} md={8}>*/}
      {/*        <Typography.Title level={3}>*/}
      {/*          <strong>About</strong>*/}
      {/*        </Typography.Title>*/}
      {/*        <Typography.Link className={styles.footerLink}>*/}
      {/*          How it Get Lucky works?*/}
      {/*        </Typography.Link>*/}
      {/*        <Typography.Link className={styles.footerLink}>Team</Typography.Link>*/}
      {/*        <Typography.Link className={styles.footerLink}>Contact</Typography.Link>*/}
      {/*      </Col>*/}
      {/*      <Col xs={24} sm={12} md={8}>*/}
      {/*        <Typography.Title level={3}>*/}
      {/*          <strong>Legal</strong>*/}
      {/*        </Typography.Title>*/}
      {/*        <Typography.Link className={styles.footerLink}>Terms and Conditions</Typography.Link>*/}
      {/*        <Typography.Link className={styles.footerLink}>Data Protection</Typography.Link>*/}
      {/*        <Typography.Link className={styles.footerLink}>GDPR</Typography.Link>*/}
      {/*      </Col>*/}
      {/*      <Col xs={24} sm={12} md={8}>*/}
      {/*        <Typography.Title level={3}>*/}
      {/*          <strong>Support</strong>*/}
      {/*        </Typography.Title>*/}
      {/*        <Typography.Link className={styles.footerLink}>Contact us by e-mail</Typography.Link>*/}
      {/*        <Typography.Link className={styles.footerLink}>Facebook</Typography.Link>*/}
      {/*        <Typography.Link className={styles.footerLink}>Instagram</Typography.Link>*/}
      {/*        <Typography.Link className={styles.footerLink}>Twitter</Typography.Link>*/}
      {/*      </Col>*/}
      {/*    </Row>*/}
      {/*  </div>*/}
      {/*</Footer>*/}
    </BaseLayout>
  );
}
