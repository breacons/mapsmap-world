import _ from 'lodash';
import { getAllLevelsSorted } from '../redux/selectors';
import { nanoid } from 'nanoid';
import firebase from 'firebase/compat';
import { RootState } from '../redux/reducers';
import { Dispatch } from '@reduxjs/toolkit';
import { Level } from '../interfaces/map';
//
export interface MoveLevelProps {
  level: Level;
  destinationIndex: number;
}

export const reorderLevel = ({ destinationIndex, level }: MoveLevelProps) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const boardId = state.board.boardId;
    const levels = getAllLevelsSorted()(state);
    // const level = getLevelById(levelId)(getState());

    const currentIndex = _.findIndex(levels, (r) => r.id === level.id);

    if (currentIndex === destinationIndex) return;

    let lower = 0;
    let upper = 0;

    if (currentIndex < destinationIndex) {
      // MOVING RIGHT THE LIST
      lower = levels[destinationIndex].order;

      if (destinationIndex === levels.length - 1) {
        upper = (_.last(levels)?.order || 0) + 1;
      } else {
        upper = levels[destinationIndex + 1].order;
      }
    }

    if (currentIndex > destinationIndex) {
      // MOVING LEFT THE LIST
      if (destinationIndex === 0) {
        lower = 0;
      } else {
        lower = levels[destinationIndex - 1].order;
      }

      upper = levels[destinationIndex].order;
    }

    const order = (lower + upper) / 2;

    const path = `boards/${boardId}/levels/${level.id}`;
    await firebase.database().ref(path).update({ order });
  };
};

interface CreateLevelProps {
  destinationIndex: number;
}

export const createLevel = ({ destinationIndex }: CreateLevelProps) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const boardId = state.board.boardId;

    const levels: Level[] = getAllLevelsSorted()(state);

    let order = 1;
    if (levels.length > 0) {
      const lower = destinationIndex === 0 ? 0 : levels[destinationIndex - 1].order;
      const upper =
        destinationIndex === levels.length
          ? (_.last(levels)?.order || 0) + 2
          : levels[destinationIndex].order;
      order = (lower + upper) / 2;
    }

    const title = 'Brand New Level';

    const levelId = nanoid();
    const level = {
      id: levelId,
      title: null,
      order,
    };

    const path = `boards/${boardId}/levels/${levelId}`;
    await firebase.database().ref(path).update(level);
  };
};
