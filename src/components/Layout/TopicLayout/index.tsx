import { Button, Col, Dropdown, Image, Input, Layout, Menu, Row, Space, Typography } from 'antd';
import classNames from 'classnames';
import firebase from 'firebase/compat';
// import Link from 'next/link';
import React, { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty, isLoaded } from 'react-redux-firebase';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { RootState } from '../../../redux/reducers';
import { URL_ADMIN, URL_ADMIN_LOGIN, URL_LANDING } from '../../../urls';
import If from '../../If';
import { BaseLayout } from '../BaseLayout';
import styles from './Landing.module.less';
import logo from './logo.svg';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';

const { Content, Footer, Header } = Layout;

interface Props {
  title?: string;
  backTo: 'map' | 'topic';
}

export function TopicLayout(props: PropsWithChildren<Props>) {
  const { boardId, topicId } = useParams();

  const profile = useSelector((state: RootState) => state.firebase.profile);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await firebase.auth().signOut();
    navigate(URL_LANDING);
  };

  return (
    <BaseLayout className={styles.layout}>
      <div className={styles.header}>
        <Link
          to={
            props.backTo === 'map' ? `/boards/${boardId}` : `/boards/${boardId}/topics/${topicId}`
          }
        >
          <Space direction="horizontal" size={16} className={styles.backLink}>
            <ArrowLeftOutlined style={{ fontSize: 20 }} />
            <strong>Back to {props.backTo}</strong>
          </Space>
        </Link>
        <Space direction="horizontal" size={16} className={styles.backLink}>
          <Input placeholder="  Search" prefix={<SearchOutlined style={{ fontSize: 20 }} />} />
        </Space>
      </div>
      <Content className={classNames([styles.container, styles.content])}>{props.children}</Content>
    </BaseLayout>
  );
}

export default TopicLayout;
