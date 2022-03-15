import { DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons';
import { Alert, Comment as CommentComponent, Divider, Tooltip } from 'antd';
import dayjs from 'dayjs';
import firebase from 'firebase/compat';
import _ from 'lodash-es';
import React, { Fragment, useState } from 'react';

import { useBoardMember } from '../../../hooks/use-boards';
import { useUserId } from '../../../hooks/use-user';
import { Comment } from '../../../interfaces/map';
import { User } from '../../../interfaces/user';
import { setEditedComment, setRepliedComment } from '../../../redux/comments';
import { useAppDispatch } from '../../../redux/store';
import Description from '../../Description';
import If from '../../If';
import UserAvatar from '../../UserAvatar';
import UserDetailsTooltip from '../../UserDetailsTooltip';
import styles from './styles.module.less';

interface OneCommentProps {
  comment: Comment;
  path: string;
}

const OneComment = ({ comment, path }: OneCommentProps) => {
  const dispatch = useAppDispatch();
  const { member } = useBoardMember(comment.authorId);
  const userId = useUserId();
  const [showReplies, setShowReplies] = useState(false);

  const voteOnComment = async (direction: 'up' | 'down') => {
    const votePath = `${path}/${direction === 'up' ? 'upvotes' : 'downvotes'}`;
    const removePath = `${path}/${direction !== 'up' ? 'upvotes' : 'downvotes'}/${userId}`;

    await firebase
      .database()
      .ref(votePath)
      .update({ [userId]: true });
    await firebase.database().ref(removePath).remove();
  };

  return (
    <CommentComponent
      actions={[
        <Tooltip key="comment-basic-like" title="Like">
          <span onClick={() => voteOnComment('up')}>
            {comment.upvotes && userId in comment.upvotes ? <LikeFilled /> : <LikeOutlined />}
            <span className={styles.commentAction}>
              {Object.keys(comment.upvotes || {}).length}
            </span>
          </span>
        </Tooltip>,
        <Tooltip key="comment-basic-dislike" title="Dislike">
          <span onClick={() => voteOnComment('down')}>
            {comment.downvotes && userId in comment.downvotes ? (
              <DislikeFilled />
            ) : (
              <DislikeOutlined />
            )}
            <span className={styles.commentAction}>
              {Object.keys(comment.downvotes || {}).length}
            </span>
          </span>
        </Tooltip>,
        comment.replies && (
          <span key="open replies" onClick={() => setShowReplies(!showReplies)}>
            {showReplies ? 'Hide replies' : 'Show replies'}
          </span>
        ),
        <span
          key="comment-nested-reply-to"
          onClick={() => {
            dispatch(setRepliedComment({ ...comment, path }));
            setShowReplies(true);
          }}
        >
          Reply to
        </span>,
        comment.authorId === userId && (
          <span
            key="comment-nested-edited"
            onClick={() => {
              dispatch(setEditedComment({ ...comment, path }));
            }}
          >
            Edit
          </span>
        ),
      ]}
      author={
        <Fragment>
          <UserDetailsTooltip member={member} />
          <Divider type="vertical" />
          {dayjs.unix(comment.time).format('YYYY-MM-DD HH:mm')}
          <br />
        </Fragment>
      }
      avatar={<UserAvatar user={member as User} />}
      content={<Description text={comment.content} fullHeight />}
    >
      <If
        condition={comment.replies && showReplies}
        then={() =>
          _.sortBy(Object.values(comment.replies), 'time')
            .reverse()
            .map((reply) => (
              <OneComment comment={reply} key={reply.id} path={`${path}/replies/${reply.id}`} />
            ))
        }
      />
    </CommentComponent>
  );
};

interface Props {
  comments: Record<string, Comment> | undefined;
  startPath: string;
}

export const CommentsDisplay = ({ comments, startPath }: Props) => {
  if (!comments) {
    return <Alert type="info" message="Nobody posted comments here." />;
  }

  return (
    <Fragment>
      {_.sortBy(Object.values(comments), 'time')
        .reverse()
        .map((comment) => (
          <OneComment comment={comment} key={comment.id} path={`${startPath}/${comment.id}`} />
        ))}
    </Fragment>
  );
};

export default CommentsDisplay;
