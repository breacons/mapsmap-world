import React, { useEffect, useLayoutEffect, useRef } from 'react';

// import { deleteTopic, renameTopic } from '../../../../service/topics';
// @ts-ignore
import useDimensions from 'react-use-dimensions';

// import * as TopicsAction from '../../../../redux/topic/action';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { Level, Technology, Topic } from '../../../../interfaces/map';
import classNames from 'classnames';

import styles from './TopicItem.module.less';
import EditableTitle from '../../../../components/EditableTitle';
import { removeCurrentlyEditedToId, setCurrentlyEditedTopicId } from '../../../../redux/board';
import { renameTopic } from '../../../../service/topics';
import { useAppDispatch } from '../../../../redux/store';
import { setPosition } from '../../../../redux/positions';
import { Link } from 'react-router-dom';
import { SelectOutlined } from '@ant-design/icons';
import { getNumberOfAreasAndTechnologies } from '../../../../redux/selectors';

interface TopicItemProps {
  topic: Topic;
  index: number;
  isCurrentlyEdited: boolean;
  isSelected: boolean;
  isGhosting: boolean;
  selectionCount: number;
  toggleSelection: (topic: Topic) => void;
  toggleSelectionInGroup: (topic: Topic) => void;
  multiSelectTo: (topic: Topic) => void;
  technology: Technology;
  level: Level;
  researchAreaIndex: number;
  technologyIndex: number;
  levelIndex: number;
}

const keyCodes = {
  enter: 13,
  escape: 27,
  arrowDown: 40,
  arrowUp: 38,
  tab: 9,
};

const primaryButton = 0;

// TODO: delete
export const TopicItem = ({
  topic,
  index,
  isCurrentlyEdited,
  isSelected,
  isGhosting,
  toggleSelection,
  toggleSelectionInGroup,
  multiSelectTo,
  selectionCount,
  technology,
  level,
  levelIndex,
  technologyIndex,
  researchAreaIndex,
}: TopicItemProps) => {
  const dispatch = useAppDispatch();
  // const [ref, { x, y, width }] = useDimensions();

  const nodeRef = useRef<any>();
  const { technologiesCount, researchAreaCount } = useSelector(getNumberOfAreasAndTechnologies());
  // console.log(topic.title, x, y);

  // if (topic.title === 'Topic 3') {
  //   console.log('TopicItem useEffect', topic.title, x, y);
  // }

  useLayoutEffect(() => {
    if (nodeRef && nodeRef.current) {
      const { x, y } = nodeRef.current.getBoundingClientRect();
      dispatch(setPosition({ id: topic.id, x: x + window.scrollX, y: y + window.scrollY }));

      if (topic.title === 'Topic 3') {
        console.log('scroll', window.scrollX, window.scrollY);
      }
    }
  }, [
    nodeRef.current,
    index,
    topic.order,
    technology.order,
    level.order,
    levelIndex,
    technologyIndex,
    researchAreaIndex,
    technologiesCount,
    researchAreaCount,
  ]); // FIXME: change this to index

  // useEffect(() => {
  //   // if (topic.title === 'Topic 3') {
  //   //   console.log('TopicItem useEffect', topic.title, x - window.scrollX, y - window.scrollY);
  //   // }
  //   dispatch(setPosition({ id: topic.id, x, y }));
  // }, [x, y, index, topic.order]);

  const performAction = (event: MouseEvent | KeyboardEvent) => {
    if (wasToggleInSelectionGroupKeyUsed(event)) {
      toggleSelectionInGroup(topic);
      return;
    }

    if (wasMultiSelectKeyUsed(event)) {
      multiSelectTo(topic);
      return;
    }

    toggleSelection(topic);
  };

  const onKeyDown = (
    event: KeyboardEvent,
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot,
  ) => {
    if (event.defaultPrevented) {
      return;
    }

    if (snapshot.isDragging) {
      return;
    }

    if (event.keyCode !== keyCodes.enter) {
      return;
    }

    // we are using the event for selection
    event.preventDefault();

    performAction(event);
  };

  // Using onClick as it will be correctly
  // preventing if there was a drag
  const onClick = (event: any) => {
    if (event.defaultPrevented) {
      return;
    }

    if (event.button !== primaryButton) {
      return;
    }

    // marking the event as used
    event.preventDefault();

    performAction(event);
  };

  const onTouchEnd = (event: any) => {
    if (event.defaultPrevented) {
      return;
    }

    // marking the event as used
    // we would also need to add some extra logic to prevent the click
    // if this element was an anchor
    event.preventDefault();
    toggleSelectionInGroup(topic);
  };

  // Determines if the platform specific toggle selection in group key was used
  const wasToggleInSelectionGroupKeyUsed = (event: MouseEvent | KeyboardEvent) => {
    const isUsingWindows = navigator.platform.indexOf('Win') >= 0;
    return isUsingWindows ? event.ctrlKey : event.metaKey;
  };

  // Determines if the multiSelect key was used
  const wasMultiSelectKeyUsed = (event: MouseEvent | KeyboardEvent) => event.shiftKey;

  return (
    <div ref={nodeRef}>
      <Draggable
        key={topic.id}
        draggableId={topic.id}
        index={index}
        disableInteractiveElementBlocking={false}
      >
        {(provided, snapshot) => {
          const shouldShowSelection: boolean = snapshot.isDragging && selectionCount > 1;
          return (
            <div
              ref={provided.innerRef}
              {...provided.dragHandleProps}
              {...provided.draggableProps}
              onClick={onClick}
              onTouchEnd={onTouchEnd}
              onKeyDown={(event: any) => onKeyDown(event, provided, snapshot)}
              // onDoubleClick={() => alert(JSON.stringify(topic))}
              className={classNames([
                styles.topicItem,
                {
                  [styles.isDragging]: snapshot.isDragging,
                  [styles.isSelected]: isSelected,
                  [styles.isGhosting]: isGhosting,
                },
              ])}
              style={provided.draggableProps.style}
              data-draggable={true}
            >
              <div>
                <EditableTitle
                  isCurrentlyEdited={isCurrentlyEdited}
                  entity={topic}
                  setCurrentlyEditing={(id: string) => dispatch(setCurrentlyEditedTopicId(id))}
                  removeCurrentlyEditing={() => dispatch(removeCurrentlyEditedToId())}
                  renameEntity={(title: string) => {
                    dispatch(renameTopic({ topic, title }));
                  }}
                  deleteEntity={() => {
                    console.warn('deleteEntity not implemented in TopicItem.tsx');

                    // dispatch(deleteTopic({ topic }));
                  }}
                />

                {/*<button*/}
                {/*  onClick={() => {*/}
                {/*    console.warn('deleteTopic not implemented in TopicItem.tsx');*/}

                {/*    // dispatch(deleteTopic({ topic }));*/}
                {/*  }}*/}
                {/*  style={{ border: '1px solid gray', padding: 1 }}*/}
                {/*>*/}
                {/*  -*/}
                {/*</button>*/}
              </div>
              <div className={styles.openIcon}>
                <Link to={`topics/${topic.id}`}>
                  <SelectOutlined />
                </Link>
              </div>
            </div>
          );
        }}
      </Draggable>
    </div>
  );
};

export default TopicItem;
