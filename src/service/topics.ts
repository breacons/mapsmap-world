import _ from 'lodash';
// import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';
import firebase from 'firebase/compat';
import { Backing, Milestone, Project, Topic, TopicVersion } from '../interfaces/map';
// import { Dispatch } from '../../redux/action';
// import { getTopicsForTechnologyAndLevel, getTopicById } from '../../redux/topic';
// import * as TopicsAction from '../../redux/topic/action';
// import { monday } from '../../App';
// import { createItem, deleteItem, renameItem, updateItem } from '../monday/items';
// import { getConfiguration } from '../../redux/configuration';
import { UNSCHEDULED_LEVEL_ID, UNSCHEDULED_TECHNOLOGY_ID } from '../constants/board';
import { RootState } from '../redux/reducers';
import { Dispatch } from '@reduxjs/toolkit';
import { getTopicById, getTopicsForTechnologyAndLevel, getUser } from '../redux/selectors';
import { setCurrentlyEditedTopicId } from '../redux/board';
import dayjs from 'dayjs';
// import { UNSCHEDULED_LEVEL_ID } from '../../redux/level/reducer';
// import { UNSCHEDULED_TECHNOLOGY_ID } from '../../redux/technology/reducer';

export const TEMPORARY_PREFIX = 'TEMPORARY';
//
export interface MoveTopicProps {
  topicId: string;
  destinationTechnologyId: string;
  destinationLevelId: string;
  destinationIndex: number;
}

export const moveTopic = ({
  destinationLevelId,
  destinationTechnologyId,
  destinationIndex,
  topicId,
}: MoveTopicProps) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();

    const topicsAtDestination = getTopicsForTechnologyAndLevel(
      destinationTechnologyId,
      destinationLevelId,
    )(state);

    // const topic = getTopicById(topicId)(state);

    const lower = destinationIndex === 0 ? 0 : topicsAtDestination[destinationIndex - 1].order;
    const upper =
      destinationIndex === topicsAtDestination.length
        ? (_.last(topicsAtDestination)?.order || 0) + 1
        : topicsAtDestination[destinationIndex].order;

    const order = (lower + upper) / 2;

    const boardId = state.board.boardId;

    const path = `boards/${boardId}/topics/${topicId}`;
    await firebase
      .database()
      .ref(path)
      .update({ order, levelId: destinationLevelId, technologyId: destinationTechnologyId });
  };
};

// export interface MoveTopicsProps {
//   topics: Topic[];
//   destinationTechnologyId: string;
//   destinationLevelId: string;
//   destinationIndex: number;
// }
//
// export const moveTopics = ({
//   destinationLevelId,
//   destinationTechnologyId,
//   destinationIndex,
//   topics,
// }: MoveTopicsProps) => {
//   return async (dispatch: Dispatch, getState: () => RootState) => {
//     const topicsAtDestination = getTopicsForTechnologyAndLevel(
//       destinationTechnologyId,
//       destinationLevelId,
//     )(getState());
//
//     const lower = destinationIndex === 0 ? 0 : topicsAtDestination[destinationIndex - 1].order;
//     const upper =
//       destinationIndex === topicsAtDestination.length
//         ? (_.last(topicsAtDestination)?.order || 0) + 1
//         : topicsAtDestination[destinationIndex].order;
//
//     // const order = (lower + upper) / 2;
//     const difference = upper - lower;
//     const incrementer = difference / (topics.length + 1);
//
//     const configuration = getConfiguration(getState());
//     topics.forEach((topic, index) => {
//       const order = lower + (index + 1) * incrementer;
//
//       // FIXME: create one single action
//       dispatch(
//         TopicsAction.updateSucceed({
//           ...topic,
//           levelId: destinationLevelId,
//           technologyId: destinationTechnologyId,
//           order,
//         }),
//       );
//
//       const values = {
//         [configuration.columns.topicsOrderColumnId]: order,
//         [configuration.columns.technologyColumnId]:
//           destinationTechnologyId === UNSCHEDULED_TECHNOLOGY_ID
//             ? {}
//             : { item_ids: [parseInt(destinationTechnologyId, 10)] },
//         [configuration.columns.levelColumnId]:
//           destinationLevelId === UNSCHEDULED_LEVEL_ID
//             ? {}
//             : { item_ids: [parseInt(destinationLevelId, 10)] },
//       };
//
//       // updateItem(configuration.boards.topicsBoardId, topic.id, values);
//     });
//   };
// };
//
export const reorderTopic = ({
  destinationIndex,
  destinationTechnologyId,
  destinationLevelId,
  topicId,
}: MoveTopicProps) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const topicsAtDestination = getTopicsForTechnologyAndLevel(
      destinationTechnologyId,
      destinationLevelId,
    )(state);

    const topic = getTopicById(topicId)(state);
    const currentIndex = _.findIndex(topicsAtDestination, (topic) => topic.id === topicId);

    if (currentIndex === destinationIndex) return;

    let lower = 0;
    let upper = 0;

    if (currentIndex < destinationIndex) {
      // MOVING DOWN THE LIST
      lower = topicsAtDestination[destinationIndex].order;

      if (destinationIndex === topicsAtDestination.length - 1) {
        upper = (_.last(topicsAtDestination)?.order || 0) + 1;
      } else {
        upper = topicsAtDestination[destinationIndex + 1].order;
      }
    }

    if (currentIndex > destinationIndex) {
      // MOVING UP THE LIST
      if (destinationIndex === 0) {
        lower = 0;
      } else {
        lower = topicsAtDestination[destinationIndex - 1].order;
      }

      upper = topicsAtDestination[destinationIndex].order;
    }

    const order = (lower + upper) / 2;

    const boardId = state.board.boardId;

    const path = `boards/${boardId}/topics/${topicId}`;
    await firebase.database().ref(path).update({ order });
  };
};
//
// export interface ReorderTopicsProps {
//   topics: Topic[];
//   destinationTechnologyId: string;
//   destinationLevelId: string;
//   destinationIndex: number;
//   draggedTopicId: string;
// }
//
// export const reorderTopics = ({
//   destinationIndex,
//   destinationTechnologyId,
//   destinationLevelId,
//   topics,
//   draggedTopicId,
// }: ReorderTopicsProps) => {
//   return async (dispatch: Dispatch, getState: () => RootState) => {
//     const topicsAtDestination = getTopicsForTechnologyAndLevel(
//       destinationTechnologyId,
//       destinationLevelId,
//     )(getState());
//
//     const topic = getTopicById(draggedTopicId)(getState());
//     const currentIndex = _.findIndex(topicsAtDestination, (topic) => topic.id === draggedTopicId);
//
//     if (currentIndex === destinationIndex) return;
//
//     let lower = 0;
//     let upper = 0;
//
//     if (currentIndex < destinationIndex) {
//       // MOVING DOWN THE LIST
//       lower = topicsAtDestination[destinationIndex].order;
//
//       if (destinationIndex === topicsAtDestination.length - 1) {
//         upper = (_.last(topicsAtDestination)?.order || 0) + 1;
//       } else {
//         upper = topicsAtDestination[destinationIndex + 1].order;
//       }
//     }
//
//     if (currentIndex > destinationIndex) {
//       // MOVING UP THE LIST
//       if (destinationIndex === 0) {
//         lower = 0;
//       } else {
//         lower = topicsAtDestination[destinationIndex - 1].order;
//       }
//
//       upper = topicsAtDestination[destinationIndex].order;
//     }
//
//     // const order = (lower + upper) / 2;
//
//     const difference = upper - lower;
//     const incrementer = difference / (topics.length + 1);
//     const configuration = getConfiguration(getState());
//
//     topics.forEach((topic, index) => {
//       const order = lower + (index + 1) * incrementer;
//       // FIXME: create one single action
//       dispatch(
//         TopicsAction.updateSucceed({
//           ...topic,
//           levelId: destinationLevelId,
//           technologyId: destinationTechnologyId,
//           order,
//         }),
//       );
//
//       const values = {
//         [configuration.columns.topicsOrderColumnId]: order,
//         [configuration.columns.technologyColumnId]:
//           destinationTechnologyId === UNSCHEDULED_TECHNOLOGY_ID
//             ? {}
//             : { item_ids: [parseInt(destinationTechnologyId, 10)] },
//         [configuration.columns.levelColumnId]:
//           destinationLevelId === UNSCHEDULED_LEVEL_ID
//             ? {}
//             : { item_ids: [parseInt(destinationLevelId, 10)] },
//       };
//
//       // updateItem(configuration.boards.topicsBoardId, topic.id, values);
//     });
//   };
// };

interface CreateTopicProps {
  levelId: string;
  technologyId: string;
}

export const createTopic = ({ levelId, technologyId }: CreateTopicProps) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const boardId = state.board.boardId as string;
    const topicsAtDestination = getTopicsForTechnologyAndLevel(technologyId, levelId)(state);
    const order = (_.last(topicsAtDestination)?.order || 0) + 1;

    const versionId = nanoid();

    const topicId = nanoid();
    const topic: Topic = {
      boardId,
      id: topicId,
      title: 'Topic',
      levelId: levelId,
      technologyId: technologyId,
      order,
      mainVersionId: versionId,
      versions: {
        [versionId]: {
          content: '',
          id: versionId,
          mainVersion: true,
          milestones: {},
          projects: {},
        },
      },
    };

    const path = `boards/${boardId}/topics/${topicId}`;
    await firebase.database().ref(path).update(topic);

    dispatch(setCurrentlyEditedTopicId(topicId));
  };
};

interface DeleteTopicProps {
  topic: Topic;
}

export const deleteTopic = ({ topic }: DeleteTopicProps) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const boardId = state.board.boardId;

    const path = `boards/${boardId}/topics/${topic.id}`;
    await firebase.database().ref(path).remove();
  };
};

interface RenameTopicProps {
  topic: Topic;
  title: string;
}

export const renameTopic = ({ topic, title }: RenameTopicProps) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const boardId = state.board.boardId;

    const path = `boards/${boardId}/topics/${topic.id}`;
    await firebase.database().ref(path).update({ title });
  };
};

interface UpdateTopic {
  topic: Topic;
}

export const updateTopic = ({ topic }: UpdateTopic) => {
  return async () => {
    const path = `boards/${topic.boardId}/topics/${topic.id}`;
    await firebase.database().ref(path).update(topic);
  };
};

interface UpdateTopicVersion {
  topic: Topic;
  versionId: string;
  version: TopicVersion;
}

export const updateTopicVersion = ({ topic, versionId, version }: UpdateTopicVersion) => {
  return async () => {
    const path = `boards/${topic.boardId}/topics/${topic.id}/versions/${versionId}`;
    await firebase.database().ref(path).update(version);
  };
};

interface ForkTopicVersion {
  topic: Topic;
  fromVersionId: string;
}

export const forkTopicVersion = ({ topic, fromVersionId }: ForkTopicVersion) => {
  return async () => {
    const versionId = nanoid();
    const path = `boards/${topic.boardId}/topics/${topic.id}/versions/${versionId}`;

    if (!topic.versions) return;

    // TODO: check if everything has to be copied
    const version = { ...topic.versions[fromVersionId], id: versionId, mainVersion: false };
    await firebase.database().ref(path).set(version);

    return versionId;
  };
};

interface MakeMainVersion {
  topic: Topic;
  versionId: string;
}

export const mainMainTopicVersion = ({ topic, versionId }: MakeMainVersion) => {
  return async () => {
    const path = `boards/${topic.boardId}/topics/${topic.id}/versions/${versionId}`;

    const oldMainVersion = topic.mainVersionId;

    await firebase.database().ref(path).update({ mainVersion: true });

    const oldPath = `boards/${topic.boardId}/topics/${topic.id}/versions/${oldMainVersion}`;
    await firebase.database().ref(oldPath).update({ mainVersion: false });

    const topicPath = `boards/${topic.boardId}/topics/${topic.id}`;
    await firebase.database().ref(topicPath).update({ mainVersionId: versionId });

    return versionId;
  };
};

interface SetDependenciesToTopic {
  topic: Topic;
  dependencies: string[];
  dependencyType: string;
}

export const setDependenciesToTopic = ({
  topic,
  dependencies,
  dependencyType,
}: SetDependenciesToTopic) => {
  return async () => {
    const dependencyArray = dependencies.map((id) => ({ id }));
    const dependencyObject = _.keyBy(dependencyArray, 'id');

    const path = `boards/${topic.boardId}/topics/${topic.id}/${dependencyType}`;
    await firebase.database().ref(path).set(dependencyObject);

    const oldDependencies = Object.keys((topic as any)[dependencyType] || {});

    const dependenciesToRemove = oldDependencies.filter((d: string) => !dependencies.includes(d));
    const dependenciesToAdd = dependencies.filter((d: string) => !oldDependencies.includes(d));

    const removePromises = dependenciesToRemove.map((id: string) => {
      const path = `boards/${topic.boardId}/topics/${id}/${
        dependencyType === 'dependentOn' ? 'requiredBy' : 'dependentOn'
      }/${topic.id}`;

      firebase.database().ref(path).remove();
    });

    const addPromises = dependenciesToAdd.map((id: string) => {
      const path = `boards/${topic.boardId}/topics/${id}/${
        dependencyType === 'dependentOn' ? 'requiredBy' : 'dependentOn'
      }/${topic.id}`;

      firebase.database().ref(path).set({ id: topic.id });
    });

    await Promise.all([...removePromises, ...addPromises]);
  };
};

interface UpdateMilestone {
  topic: Topic;
  version: TopicVersion;
  milestone: Milestone;
}

export const updateMilestone = ({ topic, version, milestone }: UpdateMilestone) => {
  return async () => {
    const path = `boards/${topic.boardId}/topics/${topic.id}/versions/${version.id}/milestones/${milestone.id}`;
    await firebase.database().ref(path).update(milestone);
  };
};

// TODO: deleteMilestone

interface DeleteMilestone {
  topic: Topic;
  version: TopicVersion;
  milestone: Milestone;
}

export const deleteMilestone = ({ topic, version, milestone }: DeleteMilestone) => {
  return async () => {
    const path = `boards/${topic.boardId}/topics/${topic.id}/versions/${version.id}/milestones/${milestone.id}`;
    await firebase.database().ref(path).remove();
  };
};

interface UpdateProject {
  topic: Topic;
  version: TopicVersion;
  project: Project;
}

export const updateProject = ({ topic, version, project }: UpdateProject) => {
  return async () => {
    const path = `boards/${topic.boardId}/topics/${topic.id}/versions/${version.id}/projects/${project.id}`;
    await firebase.database().ref(path).update(project);
  };
};

interface SubmitDonation {
  topic: Topic;
  version: TopicVersion;
  project: Project;
  amount: number;
}

export const submitDonation = ({ topic, version, project, amount }: SubmitDonation) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const profile = getUser()(getState());

    const backingId = nanoid();

    const backing: Backing = {
      id: backingId,
      userName: profile.firstName + ' ' + profile.lastName,
      amount,
      userId: profile.id,
      time: dayjs().unix(),
    };

    const path = `boards/${topic.boardId}/topics/${topic.id}/versions/${version.id}/projects/${project.id}/backings/${backingId}`;
    await firebase.database().ref(path).update(backing);

    const projectPath = `boards/${topic.boardId}/topics/${topic.id}/versions/${version.id}/projects/${project.id}`;
    await firebase
      .database()
      .ref(projectPath)
      .update({ raisedFunding: (project.raisedFunding || 0) + amount });
  };
};

interface FollowProject {
  project: Project;
  follow: boolean;
}

export const followProject = ({ project, follow }: FollowProject) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const profile = getUser()(getState());
    const path = `users/${profile.id}/followedProjects/${project.id}`;

    if (follow) {
      return await firebase.database().ref(path).update({ id: project.id });
    } else {
      return await firebase.database().ref(path).remove();
    }
  };
};
