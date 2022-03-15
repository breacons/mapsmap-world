import _ from 'lodash';

import { RootState } from '../redux/reducers';
import { getAllResearchAreasSorted, getResearchAreaById } from '../redux/selectors';
import firebase from 'firebase/compat';
import { nanoid } from 'nanoid';
import { UNSCHEDULED_RESEARCH_AREA_ID } from '../constants/board';
import { Dispatch } from '@reduxjs/toolkit';
import { ResearchArea, Technology } from '../interfaces/map';

export interface MoveResearchAreaProps {
  researchAreaId: string;
  destinationIndex: number;
}

export const reorderResearchArea = ({
  destinationIndex,
  researchAreaId,
}: MoveResearchAreaProps) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const researchAreas = getAllResearchAreasSorted()(state).filter(
      (researchArea) => researchArea.id !== UNSCHEDULED_RESEARCH_AREA_ID,
    );
    const researchArea = getResearchAreaById(researchAreaId)(state);

    const currentIndex = _.findIndex(
      researchAreas,
      (researchArea) => researchArea.id === researchAreaId,
    );

    if (currentIndex === destinationIndex) return;

    let lower = 0;
    let upper = 0;

    if (currentIndex < destinationIndex) {
      // MOVING RIGHT THE LIST
      lower = researchAreas[destinationIndex].order;

      if (destinationIndex === researchAreas.length - 1) {
        upper = (_.last(researchAreas)?.order || 0) + 1;
      } else {
        upper = researchAreas[destinationIndex + 1].order;
      }
    }

    if (currentIndex > destinationIndex) {
      // MOVING LEFT THE LIST
      if (destinationIndex === 0) {
        lower = 0;
      } else {
        lower = researchAreas[destinationIndex - 1].order;
      }

      upper = researchAreas[destinationIndex].order;
    }

    const order = (lower + upper) / 2;

    const boardId = state.board.boardId;
    const path = `boards/${boardId}/researchAreas/${researchAreaId}`;
    await firebase.database().ref(path).update({ order });
  };
};

interface CreateResearchAreaProps {
  destinationIndex: number;
}

export const createResearchArea = ({ destinationIndex }: CreateResearchAreaProps) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const researchAreas = getAllResearchAreasSorted()(state);

    let order = 1;
    if (researchAreas.length > 0) {
      const lower = destinationIndex === 0 ? 0 : researchAreas[destinationIndex - 1].order;
      const upper =
        destinationIndex === researchAreas.length
          ? (_.last(researchAreas)?.order || 0) + 2
          : researchAreas[destinationIndex].order;
      order = (lower + upper) / 2;
    }

    const areaId = nanoid();
    const area = {
      id: areaId,
      title: 'Research Area',
      order,
    };

    const boardId = state.board.boardId;
    const path = `boards/${boardId}/researchAreas/${areaId}`;
    await firebase.database().ref(path).update(area);
  };
};

// interface DeleteResearchAreaProps {
//   researchArea: ResearchArea;
// }
//
// export const deleteResearchArea = ({ researchArea }: DeleteResearchAreaProps) => {
//   return async (dispatch: Dispatch, getState: () => State) => {
//     const includedSteps = getAllStepsForResearchArea(researchArea.id, false)(getState());
//
//     includedSteps.forEach((step) => dispatch(deleteStep({ step })));
//
//     dispatch(ResearchAreasAction.deleteSucceed(researchArea));
//     await deleteItem(researchArea.id);
//   };
// };

interface RenameResearchAreaProps {
  researchArea: ResearchArea;
  title: string;
}

export const renameResearchArea = ({ researchArea, title }: RenameResearchAreaProps) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const boardId = state.board.boardId;

    const path = `boards/${boardId}/researchAreas/${researchArea.id}`;
    await firebase.database().ref(path).update({ title });
  };
};
