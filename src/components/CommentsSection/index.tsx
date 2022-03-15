import React from 'react';

import { Comment } from '../../interfaces/map';
import { SectionTitle } from '../SectionTitle';
import CommentsDisplay from './CommentsDisplay';
import styles from './styles.module.less';
import WriteComment from './WriteComment';

interface Props {
  comments: Record<string, Comment> | undefined;
  startPath: string;
}

export const CommentsSection = ({ comments, startPath }: Props) => {
  return (
    <div>
      <div className={styles.titleRow}>
        <SectionTitle>Comments</SectionTitle>
        <WriteComment rootPath={startPath} />
      </div>
      <div className={styles.display}>
        <CommentsDisplay comments={comments} startPath={startPath} />
      </div>
    </div>
  );
};

export default CommentsSection;
