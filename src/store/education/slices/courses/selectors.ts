import type { EducationStoreState } from '../../initialState';

/**
 * 获取当前活动课程
 */
const activeCourse = (s: EducationStoreState) => {
    if (!s.activeCourseId) return undefined;
    return s.coursesMap[s.activeCourseId];
};

/**
 * 获取所有课程列表
 */
const coursesList = (s: EducationStoreState) => Object.values(s.coursesMap);

/**
 * 获取已注册的课程列表
 */
const enrolledCourses = (s: EducationStoreState) =>
    s.enrolledCourseIds.map(id => s.coursesMap[id]).filter(Boolean);

/**
 * 获取推荐课程列表
 */
const recommendedCourses = (s: EducationStoreState) =>
    s.recommendedCourseIds.map(id => s.coursesMap[id]).filter(Boolean);

/**
 * 获取搜索结果课程列表
 */
const searchResultCourses = (s: EducationStoreState) =>
    s.courseSearchResults.map(id => s.coursesMap[id]).filter(Boolean);

/**
 * 检查用户是否已注册某个课程
 */
const isEnrolledInCourse = (courseId: string) => (s: EducationStoreState) =>
    s.enrolledCourseIds.includes(courseId);

/**
 * 根据分类筛选课程
 */
const coursesByCategory = (category: string) => (s: EducationStoreState) =>
    Object.values(s.coursesMap).filter(course => course?.category === category);

/**
 * 根据难度筛选课程
 */
const coursesByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced') => (s: EducationStoreState) =>
    Object.values(s.coursesMap).filter(course => course?.difficulty === difficulty);

/**
 * 获取免费课程
 */
const freeCourses = (s: EducationStoreState) =>
    Object.values(s.coursesMap).filter(course => course?.isFree === true);

/**
 * 获取付费课程
 */
const paidCourses = (s: EducationStoreState) =>
    Object.values(s.coursesMap).filter(course => course?.isFree === false);

/**
 * 获取课程统计信息
 */
const coursesStats = (s: EducationStoreState) => ({
    total: Object.keys(s.coursesMap).length,
    enrolled: s.enrolledCourseIds.length,
    recommended: s.recommendedCourseIds.length,
    searchResults: s.courseSearchResults.length,
});

export const educationCoursesSelectors = {
    activeCourse,
    coursesList,
    enrolledCourses,
    recommendedCourses,
    searchResultCourses,
    isEnrolledInCourse,
    coursesByCategory,
    coursesByDifficulty,
    freeCourses,
    paidCourses,
    coursesStats,
};