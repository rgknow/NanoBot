import type { EducationStoreState } from '../../initialState';

/**
 * 获取课程进度
 */
const courseProgress = (courseId: string) => (s: EducationStoreState) =>
    s.courseProgressMap[courseId];

/**
 * 获取课程进度百分比
 */
const courseProgressPercentage = (courseId: string) => (s: EducationStoreState) =>
    s.courseProgressMap[courseId]?.progressPercentage || 0;

/**
 * 检查课程是否完成
 */
const isCourseCompleted = (courseId: string) => (s: EducationStoreState) =>
    s.courseProgressMap[courseId]?.progressPercentage === 100;

/**
 * 检查课程是否已开始
 */
const isCourseStarted = (courseId: string) => (s: EducationStoreState) =>
    s.courseProgressMap[courseId]?.completedLessons.length > 0;

/**
 * 获取已完成的课程列表
 */
const completedCourses = (s: EducationStoreState) =>
    Object.values(s.courseProgressMap).filter(progress => progress.progressPercentage === 100);

/**
 * 获取进行中的课程列表
 */
const inProgressCourses = (s: EducationStoreState) =>
    Object.values(s.courseProgressMap).filter(
        progress => progress.progressPercentage > 0 && progress.progressPercentage < 100
    );

/**
 * 获取总学习时间
 */
const totalStudyTime = (s: EducationStoreState) => s.learningStats.totalTimeSpent;

/**
 * 获取学习统计数据
 */
const learningStats = (s: EducationStoreState) => s.learningStats;

/**
 * 获取学习目标
 */
const learningGoals = (s: EducationStoreState) => s.learningGoals;

/**
 * 计算今日学习进度
 */
const dailyProgress = (s: EducationStoreState) => {
    const { learningGoals, learningStats } = s;
    const todayMinutes = 0; // This would need to be calculated from today's activities
    return {
        completed: todayMinutes,
        percentage: (todayMinutes / learningGoals.dailyMinutes) * 100,
        target: learningGoals.dailyMinutes,
    };
};

/**
 * 计算本周学习进度
 */
const weeklyProgress = (s: EducationStoreState) => {
    const { learningGoals } = s;
    const weekMinutes = 0; // This would need to be calculated from this week's activities
    const weekHours = weekMinutes / 60;
    return {
        completed: weekHours,
        percentage: (weekHours / learningGoals.weeklyHours) * 100,
        target: learningGoals.weeklyHours,
    };
};

/**
 * 获取学习连续天数
 */
const studyStreak = (s: EducationStoreState) => s.learningStats.streakDays;

/**
 * 获取最近访问的课程
 */
const recentlyAccessedCourses = (s: EducationStoreState) =>
    Object.values(s.courseProgressMap)
        .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime())
        .slice(0, 5);

/**
 * 获取课程学习时间
 */
const courseStudyTime = (courseId: string) => (s: EducationStoreState) =>
    s.courseProgressMap[courseId]?.timeSpent || 0;

/**
 * 检查是否达到学习目标
 */
const isGoalAchieved = (goalType: 'daily' | 'weekly' | 'monthly') => (s: EducationStoreState) => {
    const { learningGoals, learningStats } = s;

    switch (goalType) {
        case 'daily': {
            return dailyProgress(s).percentage >= 100;
        }
        case 'weekly': {
            return weeklyProgress(s).percentage >= 100;
        }
        case 'monthly': {
            // This would need monthly completion data
            return false;
        }
        default: {
            return false;
        }
    }
};

export const educationProgressSelectors = {
    completedCourses,
    courseProgress,
    courseProgressPercentage,
    courseStudyTime,
    dailyProgress,
    inProgressCourses,
    isCourseCompleted,
    isCourseStarted,
    isGoalAchieved,
    learningGoals,
    learningStats,
    recentlyAccessedCourses,
    studyStreak,
    totalStudyTime,
    weeklyProgress,
};