import { Level, ResearchArea, Technology, Topic } from '../../interfaces/map';
import React, { useEffect, useState } from 'react';
import If from '../If';
import { Typography } from 'antd';
import styles from './style.module.less';
import classNames from 'classnames';

interface EditableTitleProps {
  disableEdit?: boolean;
  entity: ResearchArea | Technology | Topic | Level;
  isCurrentlyEdited: boolean;
  // defaultValue: string;
  renameEntity: (title: string) => void;
  deleteEntity: () => void;
  setCurrentlyEditing: (id: string) => void;
  removeCurrentlyEditing: () => void;
  titleClassName?: string;
}
export const EditableTitle = ({
  disableEdit,
  entity,
  isCurrentlyEdited,
  // defaultValue,
  renameEntity,
  deleteEntity,
  setCurrentlyEditing,
  removeCurrentlyEditing,
  titleClassName,
}: EditableTitleProps) => {
  // const dispatch = useDispatch();
  const originalTitle = entity.title;
  const [currentTitle, setCurrentTitle] = useState<string | null>(entity.title);

  useEffect(() => {
    if (!isCurrentlyEdited && currentTitle !== entity.title) {
      finishEditing();
    }
  }, [isCurrentlyEdited]);

  const finishEditing = () => {
    const trimmed = currentTitle?.trim();
    if (entity.title === null && (currentTitle === null || trimmed === '')) {
      deleteEntity();
    } else if (trimmed !== '' && currentTitle !== entity.title) {
      renameEntity(currentTitle as string);
    }
    removeCurrentlyEditing();
  };

  if (disableEdit) {
    return <div>entity.title</div>;
  }

  return (
    <If
      condition={isCurrentlyEdited}
      then={() => (
        <input
          style={{ width: '100%' }}
          defaultValue={entity.title || ''}
          onChange={(event) => setCurrentTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              finishEditing();
            }
            if (event.key === 'Escape') {
              if (originalTitle === null) {
                deleteEntity(); // dispatch(deleteStory({ story }));
              }

              removeCurrentlyEditing(); //dispatch(StoriesAction.removeCurrentlyEditedStoryId());
            }
          }}
          onBlur={() => {
            console.log('onBlur');
            finishEditing();
          }}
          placeholder="Title"
          autoFocus
        />
      )}
      else={() => (
        <span
          onDoubleClick={(event) => {
            setCurrentlyEditing(entity.id); // dispatch(StoriesAction.setCurrentlyEditedStoryId({ storyId: story.id }));

            setCurrentTitle(entity.title);

            event.stopPropagation();
          }}
        >
          {
            <div>
              {/*{shouldShowSelection ? (*/}
              {/*  <div className={styles.selectionCount}>{selectionCount}</div>*/}
              {/*) : null}{' '}*/}
              <span className={classNames([styles.title, titleClassName])}>{entity.title}</span>
            </div>
            // || <span style={{ opacity: 0.2 }}>Unnamed story</span>
          }
        </span>
      )}
    />
  );
};

export default EditableTitle;
