import React, { Fragment } from 'react';
import styles from './ResearchAreasRow.module.less';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { partition as _partition } from 'lodash';
import { DraggableType } from '../../index';
import classNames from 'classnames';
import { DraggableResearchAreaItem, ResearchAreaItem } from '../ResearchAreaItem';
// import { reorderResearchArea } from '../../../../service/researchAreas';
// import { UNSCHEDULED_ResearchArea_ID } from '../../../../redux/researchArea/reducer';
import { ResearchArea, Technology } from '../../../../interfaces/map';
import { UNSCHEDULED_RESEARCH_AREA_ID } from '../../../../constants/board';
import { reorderResearchArea } from '../../../../service/researchAreas';
import { selectCurrentlyEditedResearchAreaId } from '../../../../redux/board';

interface ResearchAreasRowProps {
  researchAreas: ResearchArea[];
  technologies: Technology[];
}

export const ResearchAreasRow = ({ researchAreas, technologies }: ResearchAreasRowProps) => {
  const dispatch = useDispatch();
  const currentlyEditedId = useSelector(selectCurrentlyEditedResearchAreaId);

  const onDragResearchAreaEnd = (result: DropResult) => {
    const { destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    const researchAreaId = result.draggableId;

    // if (researchAreaId === '') return;

    const destinationIndex = result.destination?.index as number;
    dispatch(reorderResearchArea({ destinationIndex, researchAreaId }));
  };

  const [[unscheduled], scheduled] = _partition(
    researchAreas,
    (researchArea) => researchArea.id === UNSCHEDULED_RESEARCH_AREA_ID,
  );

  return (
    <div className={styles.topContainer}>
      <ResearchAreaItem
        researchArea={unscheduled}
        technologiesForResearchArea={1}
        index={-1}
        isDraggingOver={false}
        isDragging={false}
        currentlyEdited={false}
      />
      <DragDropContext onDragEnd={onDragResearchAreaEnd}>
        <Droppable
          key="steps"
          droppableId="steps"
          type={DraggableType.TECHNOLOGY}
          direction="horizontal"
        >
          {(provided, snapshot) => (
            <div
              className={classNames([
                styles.container,
                {
                  [styles.isDraggingOver]: snapshot.isDraggingOver,
                },
              ])}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {scheduled.map((researchArea, index) => {
                const technologiesForResearchArea = technologies.filter(
                  (technology: Technology) => technology.areaId === researchArea.id,
                ).length;

                return (
                  <DraggableResearchAreaItem
                    researchArea={researchArea}
                    technologiesForResearchArea={technologiesForResearchArea}
                    index={index}
                    key={researchArea.id}
                    isDraggingOver={snapshot.isDraggingOver}
                    currentlyEdited={researchArea.id === currentlyEditedId}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ResearchAreasRow;
