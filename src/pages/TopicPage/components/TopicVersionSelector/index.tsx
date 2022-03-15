import { Button, Divider, Dropdown, Input, Menu, Select, Space, Tag, Typography } from 'antd';
import * as React from 'react';
import { Topic } from '../../../../interfaces/map';
import { useAppDispatch } from '../../../../redux/store';
import { forkTopicVersion, mainMainTopicVersion } from '../../../../service/topics';
import { useNavigate } from 'react-router-dom';
import If from '../../../../components/If';
import {
  BranchesOutlined,
  CaretDownOutlined,
  DownOutlined,
  ForkOutlined,
  TagOutlined,
} from '@ant-design/icons';

import styles from './styles.module.less';

const { Option } = Select;

interface Props {
  topic: Topic;
  versionId: string;
}

export const TopicVersionSelector = ({ topic, versionId }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const forkVersion = async () => {
    const newVersionId = await dispatch(
      forkTopicVersion({ topic: topic, fromVersionId: versionId }),
    );

    // TODO: notification
    navigate(`/boards/${topic.boardId}/topics/${topic.id}/versions/${newVersionId}`);
  };

  const makeMainVersion = async () => {
    const newVersionId = await dispatch(mainMainTopicVersion({ topic: topic, versionId }));
    navigate(`/boards/${topic.boardId}/topics/${topic.id}/versions/${newVersionId}`);
  };

  const selectVersion = (value: string) => {
    navigate(`/boards/${topic.boardId}/topics/${topic.id}/versions/${value}`);
  };

  return (
    <div className={styles.topicToolbar}>
      <Space direction="horizontal" size={24}>
        <Dropdown
          overlay={
            <Menu style={{ width: 240, maxHeight: 220, overflow: 'scroll' }}>
              <div className={styles.menuTitleContainer}>
                <Typography.Text strong>Switch versions</Typography.Text>
              </div>
              <Divider className={styles.topDivider} />

              <div className={styles.searchVersionContainer}>
                <Input placeholder="Find version" />
              </div>
              <Divider className={styles.bottomDivider} />
              {Object.values(topic.versions || {}).map((version) => (
                <Menu.Item key={version.id} onClick={() => selectVersion(version.id)}>
                  <div className={styles.versionMenuItem}>
                    <strong>{version.id.substring(0, 6)}</strong>
                    <If condition={version.mainVersion} then={() => <Tag>main</Tag>} />
                  </div>
                </Menu.Item>
              ))}
            </Menu>
          }
          placement="bottomLeft"
          arrow
        >
          <Button>
            <Space direction="horizontal" size={8}>
              <BranchesOutlined />

              <If
                condition={topic.mainVersionId === versionId}
                then={() => <strong>main</strong>}
                else={() => <strong>{versionId.substring(0, 6)}</strong>}
              />
              <CaretDownOutlined style={{ fontSize: 12 }} />
            </Space>
          </Button>
        </Dropdown>
        {/*<Space direction="horizontal" size={8}>*/}
        {/*  <BranchesOutlined />*/}
        {/*  <span>*/}
        {/*    <strong>{Object.keys(topic.versions || {}).length}</strong> versions*/}
        {/*  </span>*/}
        {/*</Space>*/}
        {/*<Space direction="horizontal" size={8}>*/}
        {/*  <TagOutlined />*/}
        {/*  <span>*/}
        {/*    <strong>{4}</strong> tags*/}
        {/*  </span>*/}
        {/*</Space>*/}
      </Space>
      <Space direction="horizontal" size={16}>
        <If
          condition={topic.mainVersionId !== versionId}
          then={() => <Button onClick={makeMainVersion}>Make main</Button>}
        />
        <Button onClick={forkVersion} type="primary">
          <ForkOutlined /> Fork
        </Button>
      </Space>
    </div>
  );
};
