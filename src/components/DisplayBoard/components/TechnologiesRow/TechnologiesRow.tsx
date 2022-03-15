import React from 'react';
import styles from './TechnologiesRow.module.less';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

import { DraggableType } from '../../index';
import { ResearchArea } from '../../../../interfaces/map';
import { DraggableTechnologyItem, TechnologyItem } from '../TechnologyItem';
import classNames from 'classnames';
import { useGetAllTechnologiesForResearchArea } from '../../../../hooks/use-boards';
import { selectCurrentlyEditedTechnologyId } from '../../../../redux/board';
import { UNSCHEDULED_RESEARCH_AREA_ID } from '../../../../constants/board';
import {
  createTechnology,
  moveTechnology,
  reorderTechnology,
} from '../../../../service/technologies';

interface TechnologiesForResearchAreaProps {
  researchArea: ResearchArea;
}

const TechnologiesForResearchArea = ({ researchArea }: TechnologiesForResearchAreaProps) => {
  const dispatch = useDispatch();
  const technologiesForResearchArea = useGetAllTechnologiesForResearchArea(researchArea.id);
  const currentlyEditedTechnologyId = useSelector(selectCurrentlyEditedTechnologyId);

  if (researchArea.id === UNSCHEDULED_RESEARCH_AREA_ID) {
    const technology = technologiesForResearchArea[0];
    return (
      <div className={styles.unscheduledTechnologyContainer}>
        <TechnologyItem
          technology={technology}
          isDragging={false}
          isCurrentlyEdited={false}
          disableEdit
        />
      </div>
    );
  }

  return (
    <Droppable
      key={researchArea.id}
      droppableId={researchArea.id}
      type={DraggableType.TECHNOLOGY}
      direction="horizontal"
    >
      {(provided, snapshot) => (
        <div
          className={classNames([
            styles.technologiesForResearchAreaContainer,
            {
              [styles.isDraggingOver]: snapshot.isDraggingOver,
            },
          ])}
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {technologiesForResearchArea.map((technology, index) => (
            <DraggableTechnologyItem
              key={technology.id}
              technology={technology}
              index={index}
              isCurrentlyEdited={technology.id === currentlyEditedTechnologyId}
            />
          ))}
          {provided.placeholder}
          <div
            onClick={() => {
              dispatch(createTechnology({ researchAreaId: researchArea.id }));
            }}
            className={styles.addButton}
          >
            +
          </div>
        </div>
      )}
    </Droppable>
  );
};

interface TechnologiesRowProps {
  researchAreas: ResearchArea[];
}

export const TechnologiesRow = ({ researchAreas }: TechnologiesRowProps) => {
  const dispatch = useDispatch();

  const onDragTechnologyEnd = (result: DropResult) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    const technologyId = result.draggableId;
    const destinationIndex = result.destination?.index as number;

    const destinationResearchAreaId = destination.droppableId;
    const sourceResearchAreaId = source.droppableId;

    if (sourceResearchAreaId !== destinationResearchAreaId) {
      dispatch(moveTechnology({ destinationIndex, destinationResearchAreaId, technologyId }));
    } else {
      dispatch(reorderTechnology({ destinationIndex, destinationResearchAreaId, technologyId }));
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragTechnologyEnd}>
        <div className={styles.container}>
          {researchAreas.map((researchArea, index) => (
            <TechnologiesForResearchArea key={researchArea.id} researchArea={researchArea} />
          ))}
        </div>
      </DragDropContext>
    </>
  );
};

export default TechnologiesRow;
