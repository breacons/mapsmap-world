import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Space, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import { PageTitle } from '../../components/Header';
import BoardLayout from '../../components/Layout/BoardLayout';
import BoardSelectList from '../../components/BoardSelectList';
import { URL_CREATE_BOARD } from '../../urls';
import styles from './styles.module.less';

interface Props {}

export const BoardSelectPage = ({}: Props) => {
  return (
    <BoardLayout hideHeaderSelect hideBack>
      <PageTitle title="Maps" />
      <div className={styles.container}>
        <div className={styles.inner}>
          <Typography.Title level={2} style={{ textAlign: 'center' }} className={styles.text}>
            Your maps
          </Typography.Title>
          <Divider className={styles.divider} />
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <BoardSelectList />

            <Link to={URL_CREATE_BOARD}>
              <Button type="default" block size="large" className={styles.button}>
                Create Map
              </Button>
            </Link>
          </Space>
        </div>
      </div>
    </BoardLayout>
  );
};

export default BoardSelectPage;
