import { StateCreator } from 'zustand/vanilla';

import { trpc } from '@/libs/trpc';
import { EducationStore } from '@/store/education/store';
import { setNamespace } from '@/utils/storeDebug';

import type { EducationStoreState } from '../../initialState';

const n = setNamespace('education-progress');

export interface EducationProgressAction {
    /**
     * 标记课程完成
     */
    completeCourse: (courseId: string) => Promise<void>;

    /**
     * 获取课程特定进度
     */
    fetchCourseProgress: (courseId: string) => Promise<void>;

    /**
     * 获取学习统计数据
     */
    fetchLearningStats: () => Promise<void>;

    /**
     * 获取用户进度数据
     */
    fetchUserProgress: () => Promise<void>;

    /**
     * 记录学习活动
     */
    recordStudyActivity: (courseId: string, lessonId: string, timeSpent: number) => Promise<void>;

    /**
     * 设置学习目标
     */
    setLearningGoals: (goals: Partial<EducationStoreState['learningGoals']>) => void;

    /**
     * 更新课程进度
     */
    updateCourseProgress: (courseId: string, lessonId: string, completed: boolean) => Promise<void>;

    /**
     * 更新学习时间
     */
    updateStudyTime: (courseId: string, minutes: number) => Promise<void>;
}

export const educationProgressSlice: StateCreator<
    EducationStore,
    [['zustand/devtools', never]],
    [],
    EducationProgressAction
> = (set, get) => ({
    completeCourse: async (courseId) => {
        try {
            await trpc.education.progress.completeCourse.mutate({ courseId });

            const { courseProgressMap, learningStats } = get();
            const updatedCourseProgress = { ...courseProgressMap };

            if (updatedCourseProgress[courseId]) {
                updatedCourseProgress[courseId].progressPercentage = 100;
            }

            set(
                {
                    courseProgressMap: updatedCourseProgress,
                    learningStats: {
                        ...learningStats,
                        coursesCompleted: learningStats.coursesCompleted + 1,
                    },
                },
                false,
                n('completeCourse/success', courseId),
            );
        } catch (error) {
            console.error('Failed to complete course:', error);
        }
    },

    fetchCourseProgress: async (courseId) => {
        try {
            const progress = await trpc.education.progress.getCourseProgress.query({ courseId });
            const { courseProgressMap } = get();

            set(
                {
                    courseProgressMap: {
                        ...courseProgressMap,
                        [courseId]: progress,
                    },
                },
                false,
                n('fetchCourseProgress/success', courseId),
            );
        } catch (error) {
            console.error('Failed to fetch course progress:', error);
        }
    },

    fetchLearningStats: async () => {
        try {
            const stats = await trpc.education.progress.getLearningStats.query();
            set(
                { learningStats: stats },
                false,
                n('fetchLearningStats/success'),
            );
        } catch (error) {
            console.error('Failed to fetch learning stats:', error);
        }
    },

    fetchUserProgress: async () => {
        const { progressInit, progressLoading } = get();
        if (progressLoading || progressInit) return;

        set({ progressLoading: true }, false, n('fetchUserProgress/start'));

        try {
            const progress = await trpc.education.progress.getUserProgress.query();
            const progressMap = progress.reduce((acc, item) => {
                acc[item.id] = item;
                return acc;
            }, {} as Record<string, any>);

            // Build course progress map
            const courseProgressMap: Record<string, any> = {};
            progress.forEach(item => {
                if (!courseProgressMap[item.courseId]) {
                    courseProgressMap[item.courseId] = {
                        completedLessons: [],
                        courseId: item.courseId,
                        lastAccessedAt: item.updatedAt,
                        progressPercentage: 0,
                        timeSpent: 0,
                        totalLessons: 0,
                    };
                }

                if (item.completed) {
                    courseProgressMap[item.courseId].completedLessons.push(item.lessonId);
                }
                courseProgressMap[item.courseId].timeSpent += item.timeSpent || 0;
            });

            // Calculate progress percentages
            Object.keys(courseProgressMap).forEach(courseId => {
                const courseProgress = courseProgressMap[courseId];
                if (courseProgress.totalLessons > 0) {
                    courseProgress.progressPercentage =
                        (courseProgress.completedLessons.length / courseProgress.totalLessons) * 100;
                }
            });

            set(
                {
                    courseProgressMap,
                    progressInit: true,
                    progressLoading: false,
                    progressMap,
                },
                false,
                n('fetchUserProgress/success'),
            );
        } catch (error) {
            set({ progressLoading: false }, false, n('fetchUserProgress/error', error));
        }
    },

    recordStudyActivity: async (courseId, lessonId, timeSpent) => {
        try {
            await trpc.education.progress.recordActivity.mutate({
                courseId,
                lessonId,
                timeSpent,
            });

            // Update local state
            await get().updateStudyTime(courseId, timeSpent);
        } catch (error) {
            console.error('Failed to record study activity:', error);
        }
    },

    setLearningGoals: (goals) => {
        const currentGoals = get().learningGoals;
        set(
            { learningGoals: { ...currentGoals, ...goals } },
            false,
            n('setLearningGoals', goals),
        );
    },

    updateCourseProgress: async (courseId, lessonId, completed) => {
        try {
            await trpc.education.progress.updateProgress.mutate({
                completed,
                courseId,
                lessonId,
            });

            const { courseProgressMap } = get();
            const updatedCourseProgress = { ...courseProgressMap };

            if (!updatedCourseProgress[courseId]) {
                updatedCourseProgress[courseId] = {
                    completedLessons: [],
                    courseId,
                    lastAccessedAt: new Date().toISOString(),
                    progressPercentage: 0,
                    timeSpent: 0,
                    totalLessons: 0,
                };
            }

            const courseProgress = updatedCourseProgress[courseId];
            if (completed && !courseProgress.completedLessons.includes(lessonId)) {
                courseProgress.completedLessons.push(lessonId);
            } else if (!completed) {
                courseProgress.completedLessons = courseProgress.completedLessons.filter(id => id !== lessonId);
            }

            courseProgress.lastAccessedAt = new Date().toISOString();
            if (courseProgress.totalLessons > 0) {
                courseProgress.progressPercentage =
                    (courseProgress.completedLessons.length / courseProgress.totalLessons) * 100;
            }

            set(
                { courseProgressMap: updatedCourseProgress },
                false,
                n('updateCourseProgress/success', { completed, courseId, lessonId }),
            );
        } catch (error) {
            console.error('Failed to update course progress:', error);
        }
    },

    updateStudyTime: async (courseId, minutes) => {
        try {
            await trpc.education.progress.updateStudyTime.mutate({
                courseId,
                timeSpent: minutes,
            });

            const { courseProgressMap, learningStats } = get();
            const updatedCourseProgress = { ...courseProgressMap };

            if (updatedCourseProgress[courseId]) {
                updatedCourseProgress[courseId].timeSpent += minutes;
            }

            set(
                {
                    courseProgressMap: updatedCourseProgress,
                    learningStats: {
                        ...learningStats,
                        lastStudyDate: new Date().toISOString(),
                        totalTimeSpent: learningStats.totalTimeSpent + minutes,
                    },
                },
                false,
                n('updateStudyTime/success', { courseId, minutes }),
            );
        } catch (error) {
            console.error('Failed to update study time:', error);
        }
    },
});