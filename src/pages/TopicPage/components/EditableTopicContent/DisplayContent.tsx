import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { Topic } from '../../../../interfaces/map';
import { Button } from 'antd';
import { useCurrentTopicVersion } from '../../../../hooks/use-topics';
import { EditOutlined } from '@ant-design/icons';

interface Props {
  topic: Topic;
  setEditing: (editing: boolean) => void;
  versionId: string;
}

export const DisplayContent = ({ topic, setEditing, versionId }: Props) => {
  const { version } = useCurrentTopicVersion();

  return (
    <div>
      <ReactMarkdown>{version?.content || ''}</ReactMarkdown>
      <Button onClick={() => setEditing(true)}>
        <EditOutlined />
        Edit
      </Button>
    </div>
  );
};
