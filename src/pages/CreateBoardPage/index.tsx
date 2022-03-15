import { Button, Divider, Typography } from 'antd';
import dayjs from 'dayjs';
import firebase from 'firebase/compat';
import React, { Fragment, useState } from 'react';
import { Field } from 'react-final-form';
import { nanoid } from 'nanoid';

import { Form } from '../../components/Form/Form';
import Input from '../../components/Form/Input';
import { validateSchema } from '../../components/Form/validation';
import { PageTitle } from '../../components/Header';
import { useUserId } from '../../hooks/use-user';
import { Board } from '../../interfaces/map';
import { joi } from '../../lib/joi';
import { getBoardDetailsUrl } from '../../urls';
import styles from './styles.module.less';
import { useNavigate } from 'react-router';
import BoardLayout from '../../components/Layout/BoardLayout';

interface Props {}

const schema = joi
  .object({
    title: joi.string().required(),
  })
  .unknown(true)
  .required();
const validator = validateSchema(schema);

export const CreateBoardPage = ({}: Props) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = useUserId();

  const onSubmit = async (values: any) => {
    const id = nanoid();
    const final: Partial<Board> = {
      ...values,
      time: dayjs().unix(),
      id,
      ownerId: userId,
      adminIds: {
        [userId]: true,
      },
      memberIds: {
        [userId]: true,
      },
    };

    setLoading(true);
    const boardPath = `boards/${id}`;
    await firebase.database().ref(boardPath).update(final);

    const userPath = `users/${userId}/boardIds`;
    await firebase
      .database()
      .ref(userPath)
      .update({ [id]: true });
    setLoading(false);

    navigate(getBoardDetailsUrl(id), { replace: true });
  };

  return (
    <BoardLayout hideHeaderSelect>
      <PageTitle title="Create Map" />
      <div className={styles.container}>
        <div className={styles.inner}>
          <Typography.Title level={2} style={{ textAlign: 'center' }} className={styles.text}>
            Create Map
          </Typography.Title>
          <Divider className={styles.divider} />

          <Form
            onSubmit={onSubmit}
            key="edit-board"
            validator={validator}
            initialValues={{}}
            preventPrompt
          >
            {({ valid, pristine }) => (
              <Fragment>
                <Field
                  name="title"
                  component={Input}
                  type="text"
                  label="Board Name"
                  placeholder="Our new board"
                  className={styles.text}
                />
                <Button
                  disabled={!valid || pristine}
                  type="primary"
                  block
                  size="large"
                  htmlType="submit"
                  loading={loading}
                  className={styles.button}
                >
                  Create Map
                </Button>
              </Fragment>
            )}
          </Form>
        </div>
      </div>
    </BoardLayout>
  );
};

export default CreateBoardPage;
