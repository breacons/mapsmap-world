import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Topic } from '../../interfaces/map';
import { RootState } from '../reducers';

export interface BoardState {
  // selectedTopics: Topic[];
  // draggingTopicId: string | null;
  boardId: string | null;
  currentlyEditedStoryId: string | null;
  currentlyEditedTechnologyId: string | null;
  currentlyEditedResearchAreaId: string | null;
}

const initialState: BoardState = {
  boardId: null,
  currentlyEditedStoryId: null,
  currentlyEditedTechnologyId: null,
  currentlyEditedResearchAreaId: null,
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    // TODO: selecting, draggingg
    setBoardId: (state, action: PayloadAction<string>) => {
      state.boardId = action.payload;
    },

    setCurrentlyEditedTopicId: (state, action: PayloadAction<string>) => {
      state.currentlyEditedStoryId = action.payload;
    },
    removeCurrentlyEditedToId: (state) => {
      state.currentlyEditedStoryId = null;
    },
    setCurrentlyEditedTechnologyId: (state, action: PayloadAction<string>) => {
      state.currentlyEditedTechnologyId = action.payload;
    },
    removeCurrentlyEditedTechnologyId: (state) => {
      state.currentlyEditedTechnologyId = null;
    },
    setCurrentlyEditedResearchAreaId: (state, action: PayloadAction<string>) => {
      state.currentlyEditedResearchAreaId = action.payload;
    },
    removeCurrentlyEditedResearchAreaId: (state) => {
      state.currentlyEditedResearchAreaId = null;
    },
  },
});

export const selectBoardId = (state: RootState) => state.board.boardId;

export const selectCurrentlyEditedStoryId = (state: RootState) =>
  state.board.currentlyEditedStoryId;
export const selectCurrentlyEditedTechnologyId = (state: RootState) =>
  state.board.currentlyEditedTechnologyId;
export const selectCurrentlyEditedResearchAreaId = (state: RootState) =>
  state.board.currentlyEditedResearchAreaId;

export const {
  setBoardId,
  setCurrentlyEditedTopicId,
  removeCurrentlyEditedToId,
  setCurrentlyEditedTechnologyId,
  removeCurrentlyEditedTechnologyId,
  setCurrentlyEditedResearchAreaId,
  removeCurrentlyEditedResearchAreaId,
} = boardSlice.actions;

export default boardSlice.reducer;
