import { sortBy as _sortBy } from 'lodash';
import { v4 as uuid } from 'uuid';

export const journeys = [
  {
    id: uuid(),
    title: 'First Journey',
    order: 1,
  },
  {
    id: uuid(),
    title: 'Second Journey',
    order: 2,
  },
  {
    id: uuid(),
    title: 'Third Journey',
    order: 3,
  },
];

export const releases = [
  {
    id: uuid(),
    title: 'First release',
    order: 1,
  },
  {
    id: uuid(),
    title: 'Second release',
    order: 2,
  },
  {
    id: uuid(),
    title: 'Third release',
    order: 3,
  },
];

export const steps = [
  {
    id: uuid(),
    title: 'First technology',
    journeyId: journeys[0].id,
    order: 1,
  },
  {
    id: uuid(),
    title: 'Second technology',
    journeyId: journeys[0].id,
    order: 2,
  },
  {
    id: uuid(),
    title: 'Third technology',
    journeyId: journeys[0].id,
    order: 3,
  },
  {
    id: uuid(),
    title: 'Fourth technology',
    journeyId: journeys[0].id,
    order: 4,
  },
  {
    id: uuid(),
    title: 'First technology 2',
    journeyId: journeys[1].id,
    order: 1,
  },
  {
    id: uuid(),
    title: 'Second technology 2',
    journeyId: journeys[1].id,
    order: 1,
  },
];

export const stories = [
  {
    id: uuid(),
    title: 'First story in first technology and first release',
    stepId: steps[0].id,
    releaseId: releases[0].id,
    order: 1,
  },
  {
    id: uuid(),
    title: 'Second story in first technology and first release',
    stepId: steps[0].id,
    releaseId: releases[0].id,
    order: 2,
  },
  {
    id: uuid(),
    title: 'Third story in first technology and first release',
    stepId: steps[0].id,
    releaseId: releases[0].id,
    order: 3,
  },
  {
    id: uuid(),
    title: 'First story in first technology and second release',
    stepId: steps[0].id,
    releaseId: releases[1].id,
    order: 1,
  },
  {
    id: uuid(),
    title: 'Second story in first technology and second release',
    stepId: steps[0].id,
    releaseId: releases[1].id,
    order: 2,
  },
  {
    id: uuid(),
    title: 'Third story in first technology and second release',
    stepId: steps[0].id,
    releaseId: releases[1].id,
    order: 3,
  },
  {
    id: uuid(),
    title: 'First story in second technology and first release',
    stepId: steps[1].id,
    releaseId: releases[0].id,
    order: 1,
  },
  {
    id: uuid(),
    title: 'First story in third technology and first release',
    releaseId: releases[0].id,
    stepId: steps[2].id,
    order: 1,
  },
  {
    id: uuid(),
    title: 'First story in first technology and second release',
    stepId: steps[4].id,
    releaseId: releases[0].id,
    order: 1,
  },
  {
    id: uuid(),
    title: 'Second story in first technology and second release',
    stepId: steps[4].id,
    releaseId: releases[0].id,
    order: 2,
  },
  {
    id: uuid(),
    title: 'Third story in first technology and second release',
    stepId: steps[4].id,
    releaseId: releases[0].id,
    order: 3,
  },
  {
    id: uuid(),
    title: 'First story in first technology and second release',
    stepId: steps[5].id,
    releaseId: releases[1].id,
    order: 1,
  },
  {
    id: uuid(),
    title: 'Second story in first technology and second release',
    stepId: steps[5].id,
    releaseId: releases[1].id,
    order: 2,
  },
  {
    id: uuid(),
    title: 'Third story in first technology and second release',
    stepId: steps[5].id,
    releaseId: releases[1].id,
    order: 3,
  },
  {
    id: uuid(),
    title: 'Third story in first technology and second release',
    stepId: steps[2].id,
    releaseId: releases[2].id,
    order: 3,
  },
];

export const getStepsForJourney = (journeyId: string, sort = true) => {
  const filteredSteps = steps.filter((step: any) => step.journeyId === journeyId);

  if (sort) {
    return _sortBy(filteredSteps, ['order']);
  }

  return filteredSteps;
};

export const getStoriesForStep = (stepId: string, sort = true) => {
  const filteredStories = stories.filter((story: any) => story.stepId === stepId);

  if (sort) {
    return _sortBy(filteredStories, ['order']);
  }

  return filteredStories;
};

export const getStoriesForStepAndRelease = (stepId: string, releaseId: string, sort = true) => {
  const filteredStories = stories.filter(
    (story: any) => story.stepId === stepId && story.releaseId === releaseId,
  );

  if (sort) {
    return _sortBy(filteredStories, ['order']);
  }

  return filteredStories;
};

export const getJourneys = (sort = true) => {
  if (sort) {
    _sortBy(journeys, ['order']);
  }

  return journeys;
};

export const getReleases = (sort = true) => {
  if (sort) {
    _sortBy(releases, ['order']);
  }

  return releases;
};
