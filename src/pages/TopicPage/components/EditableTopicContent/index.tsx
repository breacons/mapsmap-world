import * as React from 'react';
import { Topic } from '../../../../interfaces/map';
import { useState } from 'react';
import If from '../../../../components/If';
import { EditContent } from './EditContent';
import { DisplayContent } from './DisplayContent';
import { Button } from 'antd';

interface Props {
  topic: Topic;
  versionId: string;
}

export const EditableTopicContent = ({ topic, versionId }: Props) => {
  const [isEditing, setEditing] = useState(false);

  return (
    <div>
      <If
        condition={isEditing}
        then={() => <EditContent topic={topic} setEditing={setEditing} versionId={versionId} />}
        else={() => (
          <span style={{ textAlign: 'justify' }}>
            <DisplayContent topic={topic} setEditing={setEditing} versionId={versionId} />
          </span>
        )}
      />
    </div>
  );
};
