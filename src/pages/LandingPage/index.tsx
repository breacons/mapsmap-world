import { Button, Col, Image, Layout, Row, Typography } from 'antd';
import React from 'react';

import { PageTitle } from '../../components/Header';
import BoardLayout from '../../components/Layout/BoardLayout';
// import landingImage from './images/landing.png-';
import landingScreen from './images/landing.png';
import styles from './styles.module.less';
import Logo from '../../components/Logo';
import { Link } from 'react-router-dom';

interface Props {}

export const LandingPage = ({}: Props) => {
  return (
    <BoardLayout hideHeaderSelect={true} hideBack>
      <div className={styles.page}>
        <PageTitle title={'Welcome'} />
        <Layout.Content className={styles.container}>
          <Row>
            <Col span={9}>
              {/*<Logo width={130}/>*/}
              {/*<Image preview={false} src={landingImage} width={320} />*/}
              <Typography.Title level={1} className={styles.title}>
                Start building the future of research!
              </Typography.Title>
              <Link to="/boards">
                <Button type="primary" size="large" className={styles.cta}>
                  Get started
                </Button>
              </Link>
              {/*  Digital collaborative conservation planning platform.*/}
              {/*</Typography.Title>*/}
            </Col>
            <Col span={15}>
              <Image
                preview={false}
                src={landingScreen}
                style={{ width: '100%' }}
                className={styles.screenshot}
              />
            </Col>
          </Row>
        </Layout.Content>
      </div>
    </BoardLayout>
  );
};

export default LandingPage;
