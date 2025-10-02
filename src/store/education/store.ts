// sort-imports-ignore
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { EducationStoreState, initialState } from './initialState';
import { EducationCoursesAction, educationCoursesSlice } from './slices/courses/action';
import { EducationProgressAction, educationProgressSlice } from './slices/progress/action';
import { EducationAchievementsAction, educationAchievementsSlice } from './slices/achievements/action';
import { EducationRAGAction, educationRAGSlice } from './slices/rag/action';

export interface EducationStoreAction
    extends EducationCoursesAction,
    EducationProgressAction,
    EducationAchievementsAction,
    EducationRAGAction { }

export type EducationStore = EducationStoreAction & EducationStoreState;

//  ===============  聚合 createStoreFn ============ //

const createStore: StateCreator<EducationStore, [['zustand/devtools', never]]> = (...params) => ({
    ...initialState,

    ...educationCoursesSlice(...params),
    ...educationProgressSlice(...params),
    ...educationAchievementsSlice(...params),
    ...educationRAGSlice(...params),
});

//  ===============  实装 useStore ============ //

const devtools = createDevtools('education');

export const useEducationStore = createWithEqualityFn<EducationStore>()(
    subscribeWithSelector(devtools(createStore)),
    shallow,
);