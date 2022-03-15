import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Topic } from '../../interfaces/map';
import { RootState } from '../reducers';

export type PositionsState = Record<string, { x: number; y: number }>;

const initialState: PositionsState = {};

export const positionsSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {
    // TODO: selecting, draggingg
    setPosition: (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
      state[action.payload.id] = { x: action.payload.x, y: action.payload.y };
    },
  },
});

export const selectPositions = (state: RootState) => state.positions;
export const selectPositionById = (id: string) => (state: RootState) => state.positions[id];

export const { setPosition } = positionsSlice.actions;

export default positionsSlice.reducer;
