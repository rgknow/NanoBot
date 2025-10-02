import { StateCreator } from 'zustand/vanilla';

import { trpc } from '@/libs/trpc';
import { EducationStore } from '@/store/education/store';
import { setNamespace } from '@/utils/storeDebug';

import type { EducationStoreState } from '../../initialState';

const n = setNamespace('education-courses');

export interface EducationCoursesAction {
    /**
     * 清除搜索结果
     */
    clearSearch: () => void;

    /**
     * 注册课程
     */
    enrollCourse: (courseId: string) => Promise<void>;

    /**
     * 获取所有课程
     */
    fetchCourses: () => Promise<void>;

    /**
     * 获取用户已注册的课程
     */
    fetchEnrolledCourses: () => Promise<void>;

    /**
     * 获取推荐课程
     */
    fetchRecommendedCourses: () => Promise<void>;

    /**
     * 搜索课程
     */
    searchCourses: (query: string) => Promise<void>;

    /**
     * 设置当前活动课程
     */
    setActiveCourse: (courseId: string) => void;

    /**
     * 设置课程过滤器
     */
    setCourseFilters: (filters: Partial<EducationStoreState['filters']>) => void;

    /**
     * 取消注册课程
     */
    unenrollCourse: (courseId: string) => Promise<void>;
}

export const educationCoursesSlice: StateCreator<
    EducationStore,
    [['zustand/devtools', never]],
    [],
    EducationCoursesAction
> = (set, get) => ({
    clearSearch: () => {
        set(
            { courseSearchResults: [], searchQuery: '' },
            false,
            n('clearSearch'),
        );
    },

    enrollCourse: async (courseId) => {
        try {
            await trpc.education.courses.enrollCourse.mutate({ courseId });
            const { enrolledCourseIds } = get();

            set(
                { enrolledCourseIds: [...enrolledCourseIds, courseId] },
                false,
                n('enrollCourse/success', courseId),
            );
        } catch (error) {
            console.error('Failed to enroll in course:', error);
        }
    },

    fetchCourses: async () => {
        const { coursesInit, coursesLoading } = get();
        if (coursesLoading || coursesInit) return;

        set({ coursesLoading: true }, false, n('fetchCourses/start'));

        try {
            const courses = await trpc.education.courses.getAllCourses.query();
            const coursesMap = courses.reduce((acc, course) => {
                acc[course.id] = course;
                return acc;
            }, {} as Record<string, any>);

            set(
                {
                    coursesInit: true,
                    coursesLoading: false,
                    coursesMap,
                },
                false,
                n('fetchCourses/success'),
            );
        } catch (error) {
            set({ coursesLoading: false }, false, n('fetchCourses/error', error));
        }
    },

    fetchEnrolledCourses: async () => {
        try {
            const enrollments = await trpc.education.courses.getEnrolledCourses.query();
            const enrolledCourseIds = enrollments.map((enrollment) => enrollment.courseId);

            set(
                { enrolledCourseIds },
                false,
                n('fetchEnrolledCourses/success'),
            );
        } catch (error) {
            console.error('Failed to fetch enrolled courses:', error);
        }
    },

    fetchRecommendedCourses: async () => {
        try {
            const recommendations = await trpc.education.courses.getRecommendedCourses.query();
            const recommendedCourseIds = recommendations.map(course => course.id);

            set(
                { recommendedCourseIds },
                false,
                n('fetchRecommendedCourses/success'),
            );
        } catch (error) {
            console.error('Failed to fetch recommended courses:', error);
        }
    },

    searchCourses: async (query) => {
        if (!query.trim()) {
            set({ courseSearchResults: [], searchQuery: '' }, false, n('searchCourses/clear'));
            return;
        }

        try {
            const results = await trpc.education.courses.searchCourses.query({ query });
            const courseSearchResults = results.map(course => course.id);

            set(
                { courseSearchResults, searchQuery: query },
                false,
                n('searchCourses/success', query),
            );
        } catch (error) {
            console.error('Failed to search courses:', error);
        }
    },

    setActiveCourse: (courseId) => {
        set({ activeCourseId: courseId }, false, n('setActiveCourse', courseId));
    },

    setCourseFilters: (filters) => {
        const currentFilters = get().filters;
        set(
            { filters: { ...currentFilters, ...filters } },
            false,
            n('setCourseFilters', filters),
        );
    },

    unenrollCourse: async (courseId) => {
        try {
            await trpc.education.courses.unenrollCourse.mutate({ courseId });
            const { enrolledCourseIds } = get();

            set(
                { enrolledCourseIds: enrolledCourseIds.filter(id => id !== courseId) },
                false,
                n('unenrollCourse/success', courseId),
            );
        } catch (error) {
            console.error('Failed to unenroll from course:', error);
        }
    },
});