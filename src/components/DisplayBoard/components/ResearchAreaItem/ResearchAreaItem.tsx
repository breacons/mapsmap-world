import React from 'react';
import { columnWidth, margin } from '../../index';
import { Draggable } from 'react-beautiful-dnd';

import styles from './ResearchAreaItem.module.less';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
// import { createResearchArea, deleteResearchArea } from '../../../../service/researchAreas';
import If from '../../../../components/If';
import { ResearchArea } from '../../../../interfaces/map';
import { UNSCHEDULED_RESEARCH_AREA_ID } from '../../../../constants/board';
import { createResearchArea, renameResearchArea } from '../../../../service/researchAreas';
import {
  removeCurrentlyEditedResearchAreaId,
  removeCurrentlyEditedTechnologyId,
  setCurrentlyEditedResearchAreaId,
  setCurrentlyEditedTechnologyId,
} from '../../../../redux/board';
import { renameTechnology } from '../../../../service/technologies';
import EditableTitle from '../../../EditableTitle';

interface ResearchAreaItemProps {
  draggableProps?: any;
  researchArea: ResearchArea;
  isDragging: boolean;
  isDraggingOver: boolean;
  technologiesForResearchArea: number;
  index: number;
  ref?: any;
  currentlyEdited: boolean;
}

export const ResearchAreaItem = ({
  draggableProps,
  researchArea,
  isDragging,
  technologiesForResearchArea,
  index,
  isDraggingOver,
  currentlyEdited,
}: ResearchAreaItemProps) => {
  if (!researchArea) {
    return null;
  }
  const dispatch = useDispatch();
  return (
    <>
      <div
        className={classNames([
          styles.researchAreaItem,
          {
            [styles.isDraggingOver]: isDragging,
          },
        ])}
        {...draggableProps}
      >
        <EditableTitle
          isCurrentlyEdited={currentlyEdited}
          entity={researchArea}
          setCurrentlyEditing={(id) => dispatch(setCurrentlyEditedResearchAreaId(id))}
          removeCurrentlyEditing={() => dispatch(removeCurrentlyEditedResearchAreaId())}
          renameEntity={(title) => {
            dispatch(renameResearchArea({ researchArea: researchArea, title }));
          }}
          deleteEntity={() => {
            console.warn('deleteStep not implemented in DraggableTechnologyItem.tsx');
            // dispatch(deleteStep({ technology: technology }));
          }}
          titleClassName={styles.title}
        />
        {/*<If*/}
        {/*  condition={researchArea.id !== UNSCHEDULED_RESEARCH_AREA_ID}*/}
        {/*  then={() => (*/}
        {/*    <button*/}
        {/*      onClick={() => {*/}
        {/*        console.warn('deleteResearchArea not implemented in ResearchAreaItem.tsx');*/}

        {/*        // dispatch(deleteResearchArea({ researchArea: researchArea }));*/}
        {/*      }}*/}
        {/*      style={{ border: '1px solid gray', padding: 1 }}*/}
        {/*    >*/}
        {/*      -*/}
        {/*    </button>*/}
        {/*  )}*/}
        {/*/>*/}
      </div>
      <If
        condition={researchArea.id !== UNSCHEDULED_RESEARCH_AREA_ID}
        then={() => (
          <>
            <div
              onClick={() => {
                dispatch(createResearchArea({ destinationIndex: index + 1 }));
              }}
              className={styles.addButton}
            >
              +
            </div>

            <div
              className={classNames([styles.spacing, { [styles.isDraggingOver]: isDraggingOver }])}
              style={{
                width:
                  (technologiesForResearchArea - 1) * columnWidth +
                  technologiesForResearchArea * margin +
                  margin,
              }}
            />
          </>
        )}
      />
    </>
  );
};

interface DraggableResearchAreaItemProps {
  researchArea: ResearchArea;
  technologiesForResearchArea: number;
  index: number;
  isDraggingOver: boolean;
  currentlyEdited: boolean;
}

export const DraggableResearchAreaItem = ({
  researchArea,
  technologiesForResearchArea,
  index,
  isDraggingOver,
  currentlyEdited,
}: DraggableResearchAreaItemProps) => {
  const dispatch = useDispatch();

  return (
    <>
      <Draggable
        key={researchArea.id}
        draggableId={researchArea.id}
        index={index}
        isDragDisabled={researchArea.id === UNSCHEDULED_RESEARCH_AREA_ID}
      >
        {(provided, snapshot) => (
          <>
            <ResearchAreaItem
              draggableProps={{
                ref: provided.innerRef,
                ...provided.dragHandleProps,
                ...provided.draggableProps,
                style: provided.draggableProps.style,
              }}
              researchArea={researchArea}
              isDragging={snapshot.isDragging}
              isDraggingOver={isDraggingOver}
              technologiesForResearchArea={technologiesForResearchArea}
              index={index}
              currentlyEdited={currentlyEdited}
            />
          </>
        )}
      </Draggable>
    </>
  );
};

export default DraggableResearchAreaItem;
