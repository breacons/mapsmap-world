import { useSelector } from 'react-redux';

import { RootState } from '../redux/reducers';
import { User } from '../interfaces/user';
import { useBoardById, useCurrentBoard } from './use-boards';
import { useMemo } from 'react';

export const useUserId = () => {
  const { uid } = useSelector((state: RootState) => state.firebase.auth);
  return uid;
};

export const useProfile = (): User => {
  return (useSelector((state: RootState) => state.firebase.profile) as unknown) as User;
};

export const useAuth = () => {
  return useSelector((state: RootState) => state.firebase.auth);
};

export const useIsAdmin = () => {
  const userId = useUserId();
  const { board, isLoaded } = useCurrentBoard();

  const isAdmin = useMemo(() => {
    if (userId && board) {
      return Object.keys(board.adminIds || {}).includes(userId);
    }

    return false;
  }, [userId, board]);

  return {
    isAdmin,
    isLoaded,
  };
};

export const useIsAdminByBoardId = ({ boardId }: { boardId: string }) => {
  const userId = useUserId();
  const { board, isLoaded } = useBoardById(boardId);

  const isAdmin = useMemo(() => {
    if (userId && board) {
      return Object.keys(board.adminIds || {}).includes(userId);
    }

    return false;
  }, [userId, board]);

  return {
    isAdmin,
    isLoaded,
  };
};
