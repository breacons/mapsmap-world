import { Avatar, Badge, Button, Divider, Dropdown, Layout, Menu, Space } from 'antd';
import classNames from 'classnames';
import firebase from 'firebase/compat';
import React, { Fragment, PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty, isLoaded } from 'react-redux-firebase';
import { Link } from 'react-router-dom';

import { RootState } from '../../../redux/reducers';
import { URL_LANDING, URL_LOGIN, URL_BOARDS } from '../../../urls';
import If from '../../If';
import Logo from '../../Logo';
import BoardItem from '../../BoardItem';
import BoardSelectList from '../../BoardSelectList';
import UserAvatar from '../../UserAvatar';
import styles from './Landing.module.less';
import { useNavigate } from 'react-router';
import { useCurrentBoard } from '../../../hooks/use-boards';
import { ArrowLeftOutlined, BellOutlined } from '@ant-design/icons';

const { Header } = Layout;

interface Props {
  title?: string;
  hideHeaderSelect?: boolean;
  hideLogo?: boolean;
  hideBack?: boolean;
  showExport?: boolean;
}

export default function BoardLayout(props: PropsWithChildren<Props>) {
  const profile = useSelector((state: RootState) => state.firebase.profile);
  const navigate = useNavigate();
  const { board } = useCurrentBoard();

  const handleSignOut = async () => {
    await firebase.auth().signOut();
    navigate(URL_LANDING, { replace: true });
  };

  return (
    // <BaseLayout className={styles.layout}>
    <Fragment>
      <Header className={classNames([styles.container, styles.header])}>
        <div className={styles.headerLeft}>
          <If
            condition={!props.hideBack}
            then={() => (
              <>
                <Link to={'/boards'}>
                  <Space direction="horizontal" size={16} className={styles.backLink}>
                    <ArrowLeftOutlined style={{ fontSize: 20 }} />
                    <strong>Back to maps</strong>
                  </Space>
                </Link>
                <Divider type="vertical" className={styles.headerDivider} />
              </>
            )}
          />

          <If
            condition={!props.hideLogo}
            then={() => (
              <>
                <Link to={URL_LANDING} className={styles.logoContainer}>
                  <Logo width={44} />
                </Link>
              </>
            )}
          />
          <If
            condition={!props.hideHeaderSelect}
            then={() => (
              <Fragment>
                <Divider type="vertical" className={styles.headerDivider} />
                <Dropdown placement="bottomLeft" overlay={<BoardSelectList hideMembers />}>
                  <div>
                    <BoardItem board={board} hideMembers />
                  </div>
                </Dropdown>
              </Fragment>
            )}
          />
        </div>

        <div>
          <If condition={props.showExport} then={() => <Button>Import / Export</Button>} />

          <If
            condition={!isEmpty(profile)}
            then={() => (
              <Link to={URL_BOARDS}>
                <Dropdown
                  placement="bottomRight"
                  arrow
                  overlay={
                    <Menu style={{ zIndex: 9999999 }}>
                      <Menu.Item>
                        <Link to={URL_BOARDS}>Maps</Link>
                      </Menu.Item>
                      <Menu.Item>
                        <Link to={URL_BOARDS}>Profile</Link>
                      </Menu.Item>
                      <Menu.Item>
                        <span onClick={handleSignOut}>Sign Out</span>
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button type="link" className={styles.userName}>
                    <Space direction="horizontal" size={8}>
                      <UserAvatar user={profile} />
                      <strong>
                        {profile.firstName} {profile.lastName}
                      </strong>
                    </Space>
                  </Button>
                </Dropdown>
              </Link>
            )}
            else={() => (
              <Link to={isEmpty(profile) ? URL_LOGIN : URL_BOARDS}>
                <Button type="primary" className={styles.signInButton} loading={!isLoaded(profile)}>
                  {isEmpty(profile) ? 'Log in' : 'Dashboard'}
                </Button>
              </Link>
            )}
          />
        </div>
      </Header>
      {props.children}
    </Fragment>
  );
}
