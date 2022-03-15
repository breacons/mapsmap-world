import classnames from 'classnames';
import React, { Fragment } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import { Level, Technology, Id, Topic } from '../../../../interfaces/map';
// import { createTopic } from '../../../../service/topics';
import { DraggableType } from '../../index';
import styles from './styles.module.less';
import { TopicItem } from '../TopicItem';
import classNames from 'classnames';
import { useGetTopicsForTechnologyAndLevel } from '../../../../hooks/use-boards';
import { selectCurrentlyEditedStoryId } from '../../../../redux/board';
import { createTopic } from '../../../../service/topics';

interface TopicsAreaProps {
  technology: Technology;
  level: Level;
  selectedTopics: Topic[];
  draggingTopicId?: Id | null;
  toggleSelection: (topic: Topic) => void;
  toggleSelectionInGroup: (topic: Topic) => void;
  multiSelectTo: (topic: Topic) => void;
  researchAreaIndex: number;
  technologyIndex: number;
  levelIndex: number;
}

// type TaskIdMap = {
//   [taskId: string]: true;
// };

// TODO: check this
// const getSelectedMap = memoizeOne((selectedTopics: Topic[]) =>
//     selectedTopics.reduce((previous: TaskIdMap, current: Id): TaskIdMap => {
//     previous[current] = true;
//     return previous;
//   }, {}),
// );

export const TopicsArea = ({
  technology,
  level,
  selectedTopics,
  draggingTopicId,
  toggleSelection,
  toggleSelectionInGroup,
  multiSelectTo,
  researchAreaIndex,
  technologyIndex,
  levelIndex,
}: TopicsAreaProps) => {
  const dispatch = useDispatch();
  const topics = useGetTopicsForTechnologyAndLevel(technology.id, level.id);
  const currentlyEditedTopicId = useSelector(selectCurrentlyEditedStoryId);

  return (
    <Droppable
      key={`${technology.id}#${level.id}`}
      droppableId={`${technology.id}#${level.id}`}
      type={DraggableType.TOPIC}
    >
      {(provided, snapshot) => (
        <Fragment>
          <div
            // style={{ backgroundColor: 'blue' }}
            className={classNames([
              styles.topicsArea,
              { [styles.isDraggingOver]: snapshot.isDraggingOver },
            ])}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {topics.map((topic, index) => {
              const isSelected = _.includes(selectedTopics, topic); // FIXME: possible error
              const isGhosting =
                isSelected && Boolean(draggingTopicId) && draggingTopicId !== topic.id;

              return (
                <TopicItem
                  key={topic.id}
                  topic={topic}
                  index={index}
                  isCurrentlyEdited={topic.id === currentlyEditedTopicId}
                  isSelected={isSelected}
                  isGhosting={isGhosting}
                  selectionCount={selectedTopics.length}
                  toggleSelection={toggleSelection}
                  toggleSelectionInGroup={toggleSelectionInGroup}
                  multiSelectTo={multiSelectTo}
                  technology={technology}
                  level={level}
                  researchAreaIndex={researchAreaIndex}
                  technologyIndex={technologyIndex}
                  levelIndex={levelIndex}
                />
              );
            })}
            {provided.placeholder}
            <div
              className={classnames([
                styles.newTopic,
                { [styles.isDragging]: snapshot.isDraggingOver },
              ])}
              onClick={() => {
                dispatch(createTopic({ technologyId: technology.id, levelId: level.id }));
              }}
            ></div>
          </div>
        </Fragment>
      )}
    </Droppable>
  );
};

export default TopicsArea;
