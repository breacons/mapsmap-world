import { Alert, Menu } from 'antd';
import React from 'react';

import BoardItem from '../BoardItem';
import { SpinnerOverlay } from '../SpinnerOverlay';
import styles from './styles.module.less';
import { useBoards } from '../../hooks/use-boards';
import { Board } from '../../interfaces/map';

interface Props {
  hideMembers?: boolean;
}

export const BoardSelectList = ({ hideMembers = false }: Props) => {
  const { boards, isLoaded, isEmpty } = useBoards();

  if (!isLoaded) {
    return <SpinnerOverlay spinning />;
  }

  if (isEmpty && isLoaded) {
    return (
      <Alert
        message="You don't have access to any boards yet."
        description="Get invited or creat a new one!"
        type="info"
        showIcon
      />
    );
  }

  return (
    <Menu className={styles.container}>
      {boards.map((board: Board) => (
        <Menu.Item key={board.id}>
          <BoardItem board={board} hideMembers={hideMembers} />
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default BoardSelectList;
