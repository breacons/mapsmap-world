import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useCurrentBoard } from '../../hooks/use-boards';
import { DisplayBoard } from '../../components/DisplayBoard';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAppDispatch } from '../../redux/store';
import { setBoardId } from '../../redux/board';
import BoardLayout from '../../components/Layout/BoardLayout';
import { SpinnerOverlay } from '../../components/SpinnerOverlay';
import { Board } from '../../interfaces/map';
import If from '../../components/If';
import { PageTitle } from '../../components/Header';

export const BoardPage = () => {
  const { boardId } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setBoardId(boardId as string));
  }, [boardId]);

  const { board } = useCurrentBoard();

  return (
    <>
      <BoardLayout hideHeaderSelect showExport>
        <PageTitle title={board?.title || ''} />
        <SpinnerOverlay spinning={!board} />
        <If condition={board} then={() => <DisplayBoard board={board as Board} />} />
      </BoardLayout>
    </>
  );
};
