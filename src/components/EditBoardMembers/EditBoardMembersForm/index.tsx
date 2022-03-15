import { Alert, Button, Divider, List, Space, Tag } from 'antd';
import firebase from 'firebase/compat';
import React, { Fragment, useState } from 'react';
import { Field } from 'react-final-form';

import { useBoardMembers, useBoardById } from '../../../hooks/use-boards';
import { useIsAdminByBoardId, useUserId } from '../../../hooks/use-user';
import { joi } from '../../../lib/joi';
import { Form } from '../../Form';
import Input from '../../Form/Input';
import { validateSchema } from '../../Form/validation';
import If from '../../If';
import { SectionTitle } from '../../SectionTitle';
import UserAvatar from '../../UserAvatar';
import { User } from '../../../interfaces/user';

interface Props {
  boardId: string;
}

const addUserSchema = joi
  .object({
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .required(),
  })
  .unknown(true)
  .required();
const validator = validateSchema(addUserSchema);

export const AddNewUser = ({ boardId }: { boardId: string }) => {
  const [errorText, setErrorText] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkUserExists = async (values: any) => {
    setLoading(true);
    setErrorText(null);
    setSuccess(false);

    const userRef = await firebase
      .database()
      .ref('users')
      .orderByChild('email')
      .equalTo(values.email)
      .once('value');
    const user = userRef.val();
    if (user) {
      const memberId = Object.keys(user)[0];
      const userData: User = user[memberId];

      if (userData.boardIds && boardId in userData.boardIds) {
        setErrorText('The user is already part of this board.');
        setLoading(false);
        return;
      }

      const boardPath = `boards/${boardId}/memberIds/${memberId}`;
      await firebase.database().ref(boardPath).set(true);

      const userPath = `users/${memberId}/boardIds/${boardId}`;
      await firebase.database().ref(userPath).set(true);
      setSuccess(true);
    } else {
      setErrorText('User with this email address was not found.');
    }

    setLoading(false);
  };

  return (
    <Fragment>
      <Form
        onSubmit={checkUserExists}
        key="edit-contact"
        validator={validator}
        initialValues={{}}
        preventPrompt
      >
        {({ valid, pristine }) => (
          <Fragment>
            <Field
              name="email"
              component={Input}
              type="text"
              label="E-mail Address"
              placeholder="sample@email.com"
            />
            <Space direction="vertical" size={24}>
              <If
                condition={errorText}
                then={() => <Alert message={errorText} type="error" showIcon />}
              />
              <If
                condition={success}
                then={() => (
                  <Alert
                    message="User was successfully invited to the board."
                    type="success"
                    showIcon
                  />
                )}
              />
              <Button
                disabled={!valid || pristine}
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
              >
                Verify user
              </Button>
            </Space>
          </Fragment>
        )}
      </Form>
    </Fragment>
  );
};

export const EditBoardMembersForm = ({ boardId }: Props) => {
  const { members } = useBoardMembers();
  const { board } = useBoardById(boardId);
  const { isAdmin } = useIsAdminByBoardId({ boardId });
  const userId = useUserId();

  const removeMemberFromBoard = async (memberId: string) => {
    const boardPath = `boards/${boardId}/memberIds/${memberId}`;
    await firebase.database().ref(boardPath).remove();

    const userPath = `users/${memberId}/boardIds/${boardId}`;
    await firebase.database().ref(userPath).remove();
  };

  const changeMemberAdmin = async (memberId: string, admin: boolean) => {
    if (admin) {
      const adminPath = `boards/${boardId}/adminIds/${memberId}`;
      await firebase.database().ref(adminPath).set(true);
    } else {
      const adminPath = `boards/${boardId}/adminIds/${memberId}`;
      await firebase.database().ref(adminPath).remove();
    }
  };

  const isAdminMember = (memberId: string) => Object.keys(board?.adminIds || {}).includes(memberId);

  return (
    <div>
      <SectionTitle>Board Members</SectionTitle>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={Object.keys(board?.memberIds || {})}
        renderItem={(memberId) => {
          const member = members.find((m: any) => m.id === memberId) as User;

          if (!member) {
            return null;
          }

          return (
            <List.Item
              actions={[
                <If
                  key="remove"
                  condition={isAdmin && userId !== member.id}
                  then={() => (
                    <Button onClick={() => removeMemberFromBoard(member.id)} type="link">
                      Remove from board
                    </Button>
                  )}
                />,
                <If
                  key="promote-revoke"
                  condition={userId === board?.ownerId && memberId !== board?.ownerId}
                  then={() => (
                    <If
                      condition={isAdminMember(member.id)}
                      then={() => (
                        <Button onClick={() => changeMemberAdmin(member.id, false)} type="link">
                          Revoke admin rights
                        </Button>
                      )}
                      else={() => (
                        <Button onClick={() => changeMemberAdmin(member.id, true)} type="link">
                          Promote to admin
                        </Button>
                      )}
                    />
                  )}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={<UserAvatar user={member} />}
                title={
                  <Space direction="horizontal" size={22}>
                    <span>
                      {member.firstName} {member.lastName}
                    </span>
                    <span>
                      <If condition={member.id === userId} then={() => <Tag>You 👋</Tag>} />
                      <If
                        condition={member.id === board?.ownerId}
                        then={() => <Tag>Board Owner</Tag>}
                      />
                      <If
                        condition={isAdminMember(member.id)}
                        then={() => <Tag>Board Admin</Tag>}
                      />
                    </span>
                  </Space>
                }
                description={
                  <Fragment>
                    Mapsmap User
                    {/*{member?.type} <Divider type="vertical" /> TODO*/}
                    {/*{`${member.role} @ ${member.organisation}`}*/}
                  </Fragment>
                }
              />
            </List.Item>
          );
        }}
      />
      <If
        condition={isAdmin}
        then={() => (
          <Fragment>
            <SectionTitle>Invite Member</SectionTitle>
            <AddNewUser boardId={boardId} />
          </Fragment>
        )}
      />
    </div>
  );
};

export default EditBoardMembersForm;
