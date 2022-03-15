import { isEmpty, isLoaded, useFirebaseConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import { Topic } from '../interfaces/map';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';

export const useTopic = (boardId: string, topicId: string) => {
  useFirebaseConnect([
    {
      path: `boards/${boardId}/topics/${topicId}`,
      storeAs: `topics/${topicId}`,
    },
  ]);

  const topic = useSelector(
    (state: RootState) => ((state.firebase.data.topics || {})[topicId] as unknown) as Topic,
  );

  return { topic, isEmpty: isEmpty(topic), isLoaded: isLoaded(topic) };
};

export const useCurrentTopicVersion = () => {
  const { boardId, topicId, versionId } = useParams();
  const { topic, isLoaded, isEmpty } = useTopic(boardId as string, topicId as string);

  const currentVersionId = useMemo(() => {
    if (!topic) {
      return '';
    }

    return versionId || topic.mainVersionId;
  }, [topic, versionId]);

  if (!topic || !topic.versions) {
    return { topic, version: null, isEmpty, isLoaded };
  }

  const version = topic.versions[currentVersionId];
  return { topic, version, isEmpty, isLoaded };
};
