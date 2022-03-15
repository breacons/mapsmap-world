import { FirebaseReducer, firebaseReducer } from 'react-redux-firebase';
import { combineReducers } from 'redux';
import { User } from '../interfaces/user';
import { Board, Topic } from '../interfaces/map';
import comments, { CommentsState } from './comments';

import boardReducer, { BoardState } from './board';
import positionsReducer, { PositionsState } from './positions';

interface Schema {
  boards: Record<string, Board>;
  board: Board;
  selectedBoard: Board;
  topics: Record<string, Topic>;
  users: Record<string, User>;
}

export interface RootState {
  firebase: FirebaseReducer.Reducer<User, Schema>;
  board: BoardState;
  positions: PositionsState;
  comments: CommentsState;
}

export const rootReducer = combineReducers<RootState>({
  firebase: firebaseReducer,
  board: boardReducer,
  positions: positionsReducer,
  comments,
});
