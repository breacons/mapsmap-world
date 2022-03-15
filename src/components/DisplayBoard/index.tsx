import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { DragDropContext, DraggableLocation, DragStart, DropResult } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import If from '../../components/If';
// @ts-ignore
import useDimensions from 'react-use-dimensions';

import { LevelRow } from './components/LevelRow';
import { multiSelectTo as multiSelect } from '../../utils/multi-drag';
import { TechnologiesRow } from './components/TechnologiesRow';
import { ResearchAreasRow } from './components/ResearchAreasRow';
import { Board, Level, ResearchArea, Technology, Topic } from '../../interfaces/map';
import { moveTopic, reorderTopic } from '../../service/topics';
import { createLevel } from '../../service/levels';
import {
  getAllLevelsSorted,
  getAllResearchAreasSorted,
  getAllTechnologiesSorted,
} from '../../redux/selectors';
import { createResearchArea } from '../../service/researchAreas';
import { Dependencies } from './components/Dependencies';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export const columnWidth = 200;
export const rowHeight = 80;
export const margin = 14;
export const addWidth = 20;

export enum DraggableType {
  TOPIC = 'TOPIC',
  TECHNOLOGY = 'TECHNOLOGY',
  RESEARCH_AREA = 'RESEARCH_AREA',
  LEVEL = 'LEVEL',
}

interface Props {
  board: Board;
}

export const DisplayBoard = ({ board }: Props) => {
  // const researchAreas = useSelector(getAllJourneysSorted());
  // const levels = useSelector(getAllReleasesSorted());
  // const technologies = useSelector(getAllStepsSorted());

  const researchAreas: ResearchArea[] = useSelector(getAllResearchAreasSorted());
  const levels: Level[] = useSelector(getAllLevelsSorted());
  const technologies: Technology[] = useSelector(getAllTechnologiesSorted());

  const [ref, { x, y, width, height }] = useDimensions();

  const dispatch = useDispatch();

  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [draggingTopicId, setDraggingTopicId] = useState<string | null>(null);

  const onDragStart = (start: DragStart) => {
    const id: string = start.draggableId;
    // const selected = selectedTopicIds.find((taskId: Id): boolean => taskId === id);
    const selected = _.find(selectedTopics, (topic: Topic) => id === topic.id);

    // if dragging an item that is not selected - unselect all items
    if (!selected) {
      unselectAll();
    }

    setDraggingTopicId(start.draggableId);
  };

  const onDragEnd = (result: DropResult) => {
    const destination = result.destination;
    const source: DraggableLocation = result.source;

    if (!destination || result.reason === 'CANCEL') {
      setDraggingTopicId(null);
      return;
    }

    if (selectedTopics.length <= 1) {
      onSingleTopicDragEnd(result);
    } else {
      onMultiTopicDragEnd(result);
    }

    unselectAll();
    setDraggingTopicId(null);
    return;
  };

  const onWindowKeyDown = (event: any) => {
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === 'Escape') {
      unselectAll();
    }
  };

  const onWindowClick = (event: any) => {
    if (event.defaultPrevented) {
      return;
    }
    unselectAll();
  };

  const onWindowTouchEnd = (event: any) => {
    if (event.defaultPrevented) {
      return;
    }
    unselectAll();
  };

  const toggleSelection = (topic: Topic) => {
    // const selectedTaskIds: Id[] = selectedTopicIds; // TODO task-topic
    const wasSelected: boolean = _.includes(selectedTopics, topic);

    const newTopics: Topic[] = (() => {
      // Task was not previously selected
      // now will be the only selected item
      if (!wasSelected) {
        return [topic];
      }

      // Task was part of a selected group
      // will now become the only selected item
      // TODO: not sure about this
      if (selectedTopics.length > 1) {
        return [topic];
      }

      // task was previously selected but not in a group
      // we will now clear the selection
      return [];
    })();

    setSelectedTopics(newTopics);
  };

  const toggleSelectionInGroup = (topic: Topic) => {
    // const selectedTaskIds: Id[] = selectedTopicIds;
    const index: number = selectedTopics.indexOf(topic);

    // if not selected - add it to the selected items
    if (index === -1) {
      setSelectedTopics([...selectedTopics, topic]);
      return;
    }

    // it was previously selected and now needs to be removed from the group
    const shallow: Topic[] = [...selectedTopics];
    shallow.splice(index, 1);

    setSelectedTopics(shallow);
  };

  // This behaviour matches the MacOSX finder selection
  const multiSelectTo = (newTopic: Topic) => {
    const updated = multiSelect(selectedTopics, newTopic, technologies, levels); // TODO: entities

    if (updated == null) {
      return;
    }

    setSelectedTopics(updated);
  };

  const unselect = () => {
    unselectAll();
  };

  const unselectAll = () => {
    setSelectedTopics([]);
  };

  useEffect(() => {
    window.addEventListener('click', onWindowClick);
    window.addEventListener('keydown', onWindowKeyDown);
    window.addEventListener('touchend', onWindowTouchEnd);

    return () => {
      window.removeEventListener('click', onWindowClick);
      window.removeEventListener('keydown', onWindowKeyDown);
      window.removeEventListener('touchend', onWindowTouchEnd);
    };
  }, []);

  const onMultiTopicDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    const topicId = result.draggableId;
    const [destinationStepId, destinationLevelId] = destination.droppableId.split('#');
    const [sourceStepId, sourceReleaseId] = source.droppableId.split('#');
    const destinationIndex = result.destination?.index as number;

    if (destinationStepId !== sourceStepId || destinationLevelId !== sourceReleaseId) {
      console.warn('moveTopics not implemented in DisplayBoard.tsx');
      // dispatch(
      //   moveTopics({
      //     destinationLevelId,
      //     destinationStepId,
      //     destinationIndex,
      //     topics: selectedTopics,
      //   }),
      // );
    } else {
      console.warn('reorderTopics not implemented in DisplayBoard.tsx');

      // dispatch(
      //   reorderTopics({
      //     destinationLevelId,
      //     destinationStepId,
      //     destinationIndex,
      //     draggedTopicId: topicId,
      //     topics: selectedTopics,
      //   }),
      // );
    }
  };

  const onSingleTopicDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    const topicId = result.draggableId;
    const [destinationTechnologyId, destinationLevelId] = destination.droppableId.split('#');
    const [sourceTechnologyId, sourceLevelId] = source.droppableId.split('#');
    const destinationIndex = result.destination?.index as number;

    if (destinationTechnologyId !== sourceTechnologyId || destinationLevelId !== sourceLevelId) {
      dispatch(
        moveTopic({ destinationLevelId, destinationTechnologyId, destinationIndex, topicId }),
      );
    } else {
      dispatch(
        reorderTopic({ destinationLevelId, destinationTechnologyId, destinationIndex, topicId }),
      );
    }
  };

  return (
    <>
      <div ref={ref} id="board">
        <If
          condition={researchAreas.length > 0}
          then={() => (
            <ResearchAreasRow researchAreas={researchAreas} technologies={technologies} />
          )}
          else={() => (
            <div style={{ marginTop: 94, marginLeft: 16 }}>
              <Button
                type="primary"
                onClick={() => {
                  dispatch(createResearchArea({ destinationIndex: 1 }));
                }}
              >
                Add the first research area
              </Button>
            </div>
          )}
        />

        <TechnologiesRow researchAreas={researchAreas} />
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: 64 }}>
          <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {levels.map((level, index) => (
                <LevelRow
                  key={level.id}
                  level={level}
                  researchAreas={researchAreas}
                  draggingTopicId={draggingTopicId}
                  selectedTopics={selectedTopics}
                  toggleSelection={toggleSelection}
                  toggleSelectionInGroup={toggleSelectionInGroup}
                  multiSelectTo={multiSelectTo}
                  levelsCount={levels.length}
                  index={index}
                  width={width}
                />
              ))}
              <If
                condition={researchAreas.length > 0}
                then={() => (
                  <Button
                    onClick={() => {
                      dispatch(createLevel({ destinationIndex: levels.length }));
                    }}
                    type="default"
                    style={{ width: 200, margin: 12 }}
                    icon={<PlusOutlined />}
                  >
                    New level
                  </Button>
                )}
              />
            </div>
          </DragDropContext>
        </div>
      </div>
      <Dependencies topics={board.topics} width={width} height={height} />
    </>
  );
};

export default DisplayBoard;
