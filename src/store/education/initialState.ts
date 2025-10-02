// sort-imports-ignore
import { EducationCoursesState, initialCoursesState } from './slices/courses/initialState';
import { EducationProgressState, initialProgressState } from './slices/progress/initialState';
import { EducationAchievementsState, initialAchievementsState } from './slices/achievements/initialState';
import { EducationRAGState, initialRAGState } from './slices/rag/initialState';

export type EducationStoreState = EducationCoursesState &
    EducationProgressState &
    EducationAchievementsState &
    EducationRAGState;

export const initialState: EducationStoreState = {
    ...initialCoursesState,
    ...initialProgressState,
    ...initialAchievementsState,
    ...initialRAGState,
};