import _ from 'lodash';
import { RootState } from './reducers';
import { firebaseToObject } from '../utils/firebase-transformers';
import { Board, Level, ResearchArea, Technology } from '../interfaces/map';
import { findIndex } from 'lodash-es';

export const getUser = () => (state: RootState) => {
  return state.firebase.profile;
};

export const getTopicById = (topicId: string) => (state: RootState) => {
  const board = state.firebase.ordered.board;

  if (!board) return null;

  const { topics } = firebaseToObject<Board>(board);

  return _.find(topics, (topic) => topic.id === topicId);
};

export const getTechnologyById = (technologyId: string | null | undefined) => (
  state: RootState,
) => {
  if (!technologyId) {
    return null;
  }

  const board = state.firebase.ordered.board;

  if (!board) return null;

  const { technologies } = firebaseToObject<Board>(board);

  return _.find(technologies, (technology) => technology.id === technologyId);
};

export const getResearchAreaById = (areaId: string | null | undefined) => (state: RootState) => {
  if (!areaId) {
    return null;
  }

  const board = state.firebase.ordered.board;

  if (!board) return null;

  const { researchAreas } = firebaseToObject<Board>(board);

  return _.find(researchAreas, (area) => area.id === areaId);
};

export const getTopicsForTechnologyAndLevel = (technologyId: string, levelId: string) => (
  state: RootState,
) => {
  const board = state.firebase.ordered.board;

  if (!board) return [];

  const { topics } = firebaseToObject<Board>(board);

  return _.sortBy(
    _.filter(topics, (topic) => topic.technologyId === technologyId && topic.levelId === levelId),
    'order',
  );
};

export const getTopicsForTechnologyAndLevels = (technologyId: string, levelIds: string[]) => (
  state: RootState,
) => {
  const board = state.firebase.ordered.board;

  if (!board) return [];

  const { topics } = firebaseToObject<Board>(board);

  return _.sortBy(
    _.filter(
      topics,
      (topic) => topic.technologyId === technologyId && levelIds.includes(topic.levelId),
    ),
    'order',
  );
};

export const getTopicsForTechnologiesAndLevel = (technologyIds: string[], levelId: string) => (
  state: RootState,
) => {
  const board = state.firebase.ordered.board;

  if (!board) return [];

  const { topics } = firebaseToObject<Board>(board);

  return _.sortBy(
    _.filter(
      topics,
      (topic) => topic.levelId === levelId && technologyIds.includes(topic.technologyId),
    ),
    'order',
  );
};

export const getAllLevelsSorted = () => (state: RootState): Level[] => {
  const board = state.firebase.ordered.board;

  if (!board) return [];

  const { levels } = firebaseToObject<Board>(board);

  return _.sortBy(levels, 'order');
};

export const getAllTechnologiesSorted = () => (state: RootState): Technology[] => {
  const board = state.firebase.ordered.board;

  if (!board) return [];

  const { technologies } = firebaseToObject<Board>(board);

  return _.sortBy(technologies, 'order');
};

export const getAllResearchAreasSorted = () => (state: RootState): ResearchArea[] => {
  const board = state.firebase.ordered.board;

  if (!board) return [];

  const { researchAreas } = firebaseToObject<Board>(board);

  return _.sortBy(researchAreas, 'order');
};

export const getAllTechnologiesForResearchArea = (areaId: string) => (state: RootState) => {
  const board = state.firebase.ordered.board;

  if (!board) return [];

  const { technologies } = firebaseToObject<Board>(board);

  return _.sortBy(
    _.filter(technologies, (technology) => technology.areaId === areaId),
    'order',
  );
};

export const getLevelIndex = (levelId: string | null | undefined) => (state: RootState) => {
  if (!levelId) {
    return null;
  }

  const levelsSorted = getAllLevelsSorted()(state);

  if (!levelsSorted) {
    return null;
  }

  return _.findIndex(levelsSorted, (level) => level.id === levelId);
};

export const getResearchAreaIndex = (areaId: string | null | undefined) => (state: RootState) => {
  if (!areaId) {
    return null;
  }

  const areasSorted = getAllResearchAreasSorted()(state);

  if (!areasSorted) {
    return null;
  }

  return _.findIndex(areasSorted, (area) => area.id === areaId);
};

export const getNumberOfAreasAndTechnologies = () => (state: RootState) => {
  const areas = getAllResearchAreasSorted()(state);
  const technologies = getAllTechnologiesSorted()(state);

  return { researchAreaCount: areas?.length || 0, technologiesCount: technologies?.length || 0 };
};
