import _ from 'lodash';

import { RootState } from '../redux/reducers';
import { getAllTechnologiesForResearchArea } from '../redux/selectors';
import firebase from 'firebase/compat';
import { nanoid } from 'nanoid';
import { Dispatch } from '@reduxjs/toolkit';
import { Technology } from '../interfaces/map';

export interface MoveTechnologyProps {
  technologyId: string;
  destinationIndex: number;
  destinationResearchAreaId: string;
}

export const moveTechnology = ({
  destinationIndex,
  technologyId,
  destinationResearchAreaId,
}: MoveTechnologyProps) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const technologiesAtDestination = getAllTechnologiesForResearchArea(destinationResearchAreaId)(
      state,
    );

    const lower =
      destinationIndex === 0 ? 0 : technologiesAtDestination[destinationIndex - 1].order;
    const upper =
      destinationIndex === technologiesAtDestination.length
        ? (_.last(technologiesAtDestination)?.order || 0) + 1
        : technologiesAtDestination[destinationIndex].order;

    const order = (lower + upper) / 2;

    const boardId = state.board.boardId;
    const path = `boards/${boardId}/technologies/${technologyId}`;
    await firebase.database().ref(path).update({ order, areaId: destinationResearchAreaId });
  };
};

export const reorderTechnology = ({
  destinationIndex,
  technologyId,
  destinationResearchAreaId,
}: MoveTechnologyProps) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const technologiesAtDestination = getAllTechnologiesForResearchArea(destinationResearchAreaId)(
      state,
    );

    const currentIndex = _.findIndex(
      technologiesAtDestination,
      (technology) => technology.id === technologyId,
    );

    if (currentIndex === destinationIndex) return;

    let lower = 0;
    let upper = 0;

    if (currentIndex < destinationIndex) {
      // MOVING DOWN THE LIST
      lower = technologiesAtDestination[destinationIndex].order;

      if (destinationIndex === technologiesAtDestination.length - 1) {
        upper = (_.last(technologiesAtDestination)?.order || 0) + 1;
      } else {
        upper = technologiesAtDestination[destinationIndex + 1].order;
      }
    }

    if (currentIndex > destinationIndex) {
      // MOVING UP THE LIST
      if (destinationIndex === 0) {
        lower = 0;
      } else {
        lower = technologiesAtDestination[destinationIndex - 1].order;
      }

      upper = technologiesAtDestination[destinationIndex].order;
    }

    const order = (lower + upper) / 2;

    const boardId = state.board.boardId;
    const path = `boards/${boardId}/technologies/${technologyId}`;
    await firebase.database().ref(path).update({ order });
  };
};

interface CreateTechnologyProps {
  researchAreaId: string;
}

export const createTechnology = ({ researchAreaId }: CreateTechnologyProps) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const technologiesAtDestination = getAllTechnologiesForResearchArea(researchAreaId)(state);
    const order = (_.last(technologiesAtDestination)?.order || 0) + 2;

    const boardId = state.board.boardId;

    const technologyId = nanoid();
    const technology = {
      id: technologyId,
      title: 'Technology',
      areaId: researchAreaId,
      order,
    };

    const path = `boards/${boardId}/technologies/${technologyId}`;
    await firebase.database().ref(path).update(technology);
  };
};

// interface DeleteTechnologyProps {
//   technology: Technology;
// }
//
// export const deleteTechnology = ({ technology }: DeleteTechnologyProps) => {
//   return async (dispatch: Dispatch<Story>, getState: () => State) => {
//     const includedStories = getAllStoriesForTechnology(technology.id, false)(getState());
//
//     includedStories.forEach((story) => dispatch(deleteStory({ story })));
//
//     dispatch(TechnologiesAction.deleteSucceed(technology));
//     await deleteItem(technology.id);
//   };
// };

interface RenameTechnologyProps {
  technology: Technology;
  title: string;
}

export const renameTechnology = ({ technology, title }: RenameTechnologyProps) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const boardId = state.board.boardId;

    const path = `boards/${boardId}/technologies/${technology.id}`;
    await firebase.database().ref(path).update({ title });
  };
};
