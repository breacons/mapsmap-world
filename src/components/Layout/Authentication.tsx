import { Button, Col, Image, Layout, Row } from 'antd';
import classNames from 'classnames';
// import Head from 'next/head';
// import Link from 'next/link';
import { PropsWithChildren } from 'react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import If from '../If';
import styles from './Authentication.module.less';
import { BaseLayout } from './BaseLayout';

interface Props {
  cover: string;
  title?: string;
}

const { Content, Header } = Layout;

export default function AuthenticationLayout(props: PropsWithChildren<Props>): JSX.Element {
  return (
    <BaseLayout className={styles.layout}>
      {/*<Head>*/}
      {/*  <title>{props.title}</title>*/}
      {/*</Head>*/}
      <Header className={classNames([styles.container, styles.header])}>
        <Link to="/">
          <Image src="/landing/logo.svg" preview={false} width={60} className={styles.logo} />
        </Link>
        <Link to="/">
          <Button type="default" size="large" className={styles.signInButton}>
            <FormattedMessage defaultMessage="Vissza a főoldalra" id="Header.ToLading" />
          </Button>
        </Link>
      </Header>
      <Content className={styles.container}>
        <Row className={styles.row} align="middle" justify="space-around" gutter={16}>
          <Col xs={24} sm={12} className={styles.imageContainer}>
            <If
              condition={props.cover}
              then={() => (
                <Row align="middle" justify="center" className={styles.imageRow}>
                  <Col>
                    <img alt="Cover" className={styles.image} src={props.cover} />
                  </Col>
                </Row>
              )}
            />
          </Col>
          <Col xs={24} sm={12} className={styles.contentContainer}>
            <div className={styles.content}>{props.children}</div>
          </Col>
        </Row>
      </Content>
    </BaseLayout>
  );
}
