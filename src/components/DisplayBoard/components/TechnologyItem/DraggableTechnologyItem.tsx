import React from 'react';
import { useDispatch } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
// import { deleteStep, renameStep } from '../../../../service/technologies';
// import { Step } from '../../../../interfaces';
import styles from './TechnologyItem.module.less';
import classNames from 'classnames';
import If from '../../../../components/If';
import EditableTitle from '../../../../components/EditableTitle';
import { Technology } from '../../../../interfaces/map';
import {
  removeCurrentlyEditedTechnologyId,
  setCurrentlyEditedTechnologyId,
} from '../../../../redux/board';
import { UNSCHEDULED_TECHNOLOGY_ID } from '../../../../constants/board';
import { renameTechnology } from '../../../../service/technologies';

interface StepItemProps {
  draggableProps?: any;
  isDragging: boolean;
  technology: Technology;
  isCurrentlyEdited: boolean;
  disableEdit?: boolean;
}

export const TechnologyItem = ({
  draggableProps,
  isDragging,
  technology,
  isCurrentlyEdited,
  disableEdit,
}: StepItemProps) => {
  const dispatch = useDispatch();
  return (
    <div
      className={classNames([
        styles.technologyItem,
        {
          [styles.isDraggingOver]: isDragging,
        },
      ])}
      {...draggableProps}
    >
      <EditableTitle
        isCurrentlyEdited={isCurrentlyEdited}
        entity={technology}
        setCurrentlyEditing={(id) => dispatch(setCurrentlyEditedTechnologyId(id))}
        removeCurrentlyEditing={() => dispatch(removeCurrentlyEditedTechnologyId())}
        renameEntity={(title) => {
          dispatch(renameTechnology({ technology: technology, title }));
        }}
        deleteEntity={() => {
          console.warn('deleteStep not implemented in DraggableTechnologyItem.tsx');
          // dispatch(deleteStep({ technology: technology }));
        }}
      />
      {/*<If*/}
      {/*  condition={technology.id !== UNSCHEDULED_TECHNOLOGY_ID}*/}
      {/*  then={() => (*/}
      {/*    <button*/}
      {/*      onClick={() => {*/}
      {/*        console.warn('deleteStep not implemented in DraggableTechnologyItem.tsx');*/}

      {/*        // dispatch(deleteStep({ technology: technology }));*/}
      {/*      }}*/}
      {/*      style={{ border: '1px solid gray', padding: 1 }}*/}
      {/*    >*/}
      {/*      -*/}
      {/*    </button>*/}
      {/*  )}*/}
      {/*/>*/}
    </div>
  );
};

interface DraggableTechnologyItemProps {
  technology: Technology;
  index: number;
  isCurrentlyEdited: boolean;
}

export const DraggableTechnologyItem = ({
  technology,
  index,
  isCurrentlyEdited,
}: DraggableTechnologyItemProps) => {
  return (
    <Draggable key={technology.id} draggableId={technology.id} index={index}>
      {(provided, snapshot) => (
        <TechnologyItem
          draggableProps={{
            ref: provided.innerRef,
            ...provided.dragHandleProps,
            ...provided.draggableProps,
            style: provided.draggableProps.style,
          }}
          isDragging={snapshot.isDragging}
          technology={technology}
          isCurrentlyEdited={isCurrentlyEdited}
        />
      )}
    </Draggable>
  );
};

export default DraggableTechnologyItem;
