import React from 'react';
import { Link } from 'react-router-dom';

import { Board } from '../../interfaces/map';
import { getBoardDetailsUrl } from '../../urls';
import EditBoardMembers from '../EditBoardMembers';
import If from '../If';
import styles from './styles.module.less';

interface Props {
  board: Board | null;
  hideMembers?: boolean;
}

export const BoardItem = ({ board, hideMembers }: Props) => {
  if (!board) {
    return null;
  }
  return (
    <div className={styles.row}>
      <div className={styles.headerLeft}>
        <div className={styles.boardLogo}>🗺</div>
        <div className={styles.boardName}>
          <Link to={getBoardDetailsUrl(board.id)}>{board?.title}</Link>
        </div>
      </div>
      <If condition={!hideMembers} then={() => <EditBoardMembers id={board.id} />} />
    </div>
  );
};

export default BoardItem;
