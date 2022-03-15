import { UserOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';

import EditBoardMembersForm from './EditBoardMembersForm';

interface Props {
  id: string;
}

export const EditSpaceMembers = ({ id }: Props) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <Modal
        visible={showModal}
        onOk={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
        width={780}
        okText="Finish"
        centered
      >
        <EditBoardMembersForm boardId={id} />
      </Modal>
      <Button
        onClick={() => setShowModal(true)}
        icon={<UserOutlined style={{ color: 'black' }} />}
        shape="circle"
      />
    </div>
  );
};

export default EditSpaceMembers;
