import { Divider, Tooltip, Typography } from 'antd';
import React from 'react';

import { User } from '../../interfaces/user';
import UserAvatar from '../UserAvatar';
import styles from './styles.module.less';

interface Props {
  member?: User | null;
}

export const UserDetailsTooltip = ({ member }: Props) => {
  if (!member) {
    return null;
  }
  return (
    // <Tooltip
    //   title={
    //     <span>
    //       <UserAvatar user={member as User} />
    //       <br />
    //       <Typography.Title level={5} className={styles.name}>
    //         {member?.firstName + ' ' + member?.lastName}
    //       </Typography.Title>
    //       <Divider className={styles.divider} />
    //       <Typography.Text className={styles.text}>
    //         <strong>Mapsmap User</strong>
    //       </Typography.Text>
    //       {/*<br />*/}
    //       {/*<Typography.Text className={styles.text}>{member?.organisation}</Typography.Text>*/}
    //     </span>
    //   }
    // >
    <>{member?.firstName + ' ' + member?.lastName}</>
    // </Tooltip>
  );
};

export default UserDetailsTooltip;
