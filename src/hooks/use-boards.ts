import { useParams } from 'react-router-dom';
import { isEmpty, isLoaded, useFirebaseConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import { useMemo } from 'react';
import { firebaseToArray, firebaseToObject } from '../utils/firebase-transformers';
import { Board, ResearchArea } from '../interfaces/map';
import _ from 'lodash';
import { useUserId } from './use-user';
import { User } from '../interfaces/user';

export const useBoards = () => {
  const userId = useUserId();
  useFirebaseConnect([
    { path: 'boards', queryParams: [`orderByChild=memberIds/${userId}`, 'equalTo=true'] },
  ]);
  const boards = useSelector((state: RootState) => state.firebase.ordered.boards);

  const transformed: any = useMemo(() => firebaseToArray(Object.values(boards || {})), [boards]);

  return {
    boards: transformed,
    isLoaded: isLoaded(boards),
    isEmpty: isEmpty(boards),
  };
};

export const useBoardMembers = () => {
  useFirebaseConnect([
    {
      path: 'users',
      // queryParams: [`orderByChild=spaceIds/${id}`, 'equalTo=true'],
      // storeAs: 'users',
    },
  ]);

  const users = useSelector((state: RootState) => state.firebase.ordered.users);

  const transformed: any = useMemo(() => {
    const asArray = firebaseToArray(users);

    return asArray;
  }, [users]);

  return {
    members: transformed,
    isLoaded: isLoaded(users),
    isEmpty: isEmpty(users),
  };
};

export const useBoardMember = (id: string) => {
  const { members, ...rest } = useBoardMembers();

  const member = useMemo(() => {
    if (members) {
      return members.find((user: User) => user.id === id);
    }

    return null;
  }, [members, id]);

  return {
    member,
    ...rest,
  };
};

export const useCurrentBoard = () => {
  const { boardId } = useParams();

  useFirebaseConnect([
    {
      path: `boards/${boardId}`,
      storeAs: 'board',
    },
  ]);

  const currentBoard = useSelector((state: RootState) => state.firebase.ordered.board);

  const board = useMemo(() => {
    if (currentBoard) {
      const transformed = firebaseToObject<Board>(currentBoard);

      return {
        ...transformed,
        researchAreas: Object.values(transformed.researchAreas || {}),
        technologies: Object.values(transformed.technologies || {}),
        topics: Object.values(transformed.topics || {}),
        levels: Object.values(transformed.levels || {}),
      };
    }

    return null;
  }, [currentBoard]);

  return { board, isEmpty: isEmpty(currentBoard), isLoaded: isLoaded(currentBoard) };
};

export const useBoardById = (boardId: string) => {
  useFirebaseConnect([
    {
      path: `boards/${boardId}`,
      storeAs: 'selectedBoard',
    },
  ]);

  const currentBoard = useSelector((state: RootState) => state.firebase.ordered.selectedBoard);

  const board = useMemo(() => {
    if (currentBoard) {
      const transformed = firebaseToObject<Board>(currentBoard);

      return {
        ...transformed,
      };
    }

    return null;
  }, [currentBoard, boardId]);

  return { board, isEmpty: isEmpty(currentBoard), isLoaded: isLoaded(currentBoard) };
};

// TODO: useMemo
export const useGetAllTechnologiesForArea = (areaId: string) => {
  const { board } = useCurrentBoard();

  if (!board) return [];

  return _.sortBy(
    _.filter(board.technologies, (technology) => technology.areaId === areaId),
    'order',
  );
};

export const useGetTopicsForTechnologyAndLevel = (technologyId: string, levelId: string) => {
  const { board } = useCurrentBoard();

  if (!board) return [];

  return _.sortBy(
    _.filter(
      board.topics,
      (topic) => topic.technologyId === technologyId && topic.levelId === levelId,
    ),
    'order',
  );
};

export const useGetAllTechnologiesForResearchArea = (researchAreaId: string) => {
  const { board } = useCurrentBoard();

  if (!board) return [];

  return _.sortBy(
    _.filter(board.technologies, (technologyId) => technologyId.areaId === researchAreaId),
    'order',
  );
};

export const useTopicCountForLevel = (levelId: string) => {
  const { board } = useCurrentBoard();

  if (!board) return 0;

  return _.filter(board.topics, (topic) => topic.levelId === levelId).length;
};
