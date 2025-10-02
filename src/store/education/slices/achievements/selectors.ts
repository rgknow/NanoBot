import type { EducationStoreState } from '../../initialState';

/**
 * 获取所有成就列表
 */
const achievementsList = (s: EducationStoreState) => Object.values(s.achievementsMap);

/**
 * 获取用户已获得的成就列表
 */
const earnedAchievements = (s: EducationStoreState) =>
    Object.values(s.userAchievementsMap);

/**
 * 获取未获得的成就列表
 */
const unearnedAchievements = (s: EducationStoreState) =>
    Object.values(s.achievementsMap).filter(
        achievement => !s.userAchievementsMap[achievement.id]
    );

/**
 * 检查用户是否已获得某个成就
 */
const hasAchievement = (achievementId: string) => (s: EducationStoreState) =>
    Boolean(s.userAchievementsMap[achievementId]);

/**
 * 获取成就详情
 */
const achievementDetails = (achievementId: string) => (s: EducationStoreState) =>
    s.achievementsMap[achievementId];

/**
 * 获取成就进度
 */
const achievementProgress = (achievementId: string) => (s: EducationStoreState) =>
    s.inProgressAchievements[achievementId];

/**
 * 获取最近获得的成就
 */
const recentAchievements = (s: EducationStoreState) =>
    s.recentAchievements.map(id => s.achievementsMap[id]).filter(Boolean);

/**
 * 获取进行中的成就列表
 */
const inProgressAchievementsList = (s: EducationStoreState) =>
    Object.values(s.inProgressAchievements);

/**
 * 获取未显示的成就通知
 */
const unshownNotifications = (s: EducationStoreState) =>
    s.achievementNotifications.filter(notification => !notification.shown);

/**
 * 获取成就统计
 */
const achievementStats = (s: EducationStoreState) => s.achievementStats;

/**
 * 根据类型筛选成就
 */
const achievementsByType = (type: string) => (s: EducationStoreState) =>
    Object.values(s.achievementsMap).filter(achievement => achievement?.type === type);

/**
 * 根据分类筛选成就
 */
const achievementsByCategory = (category: string) => (s: EducationStoreState) =>
    Object.values(s.achievementsMap).filter(achievement => achievement?.category === category);

/**
 * 获取稀有成就（高难度）
 */
const rareAchievements = (s: EducationStoreState) =>
    Object.values(s.achievementsMap).filter(achievement => achievement?.rarity === 'rare' || achievement?.rarity === 'legendary');

/**
 * 获取用户等级和经验
 */
const userLevelInfo = (s: EducationStoreState) => {
    const { level, points } = s.achievementStats;
    const nextLevelPoints = level * 1000; // Example: each level requires 1000 more points
    const currentLevelProgress = points % 1000;

    return {
        currentLevelProgress,
        level,
        nextLevelPoints,
        points,
        progressToNext: (currentLevelProgress / 1000) * 100,
    };
};

/**
 * 获取成就完成率
 */
const completionRate = (s: EducationStoreState) => {
    const total = Object.keys(s.achievementsMap).length;
    const earned = Object.keys(s.userAchievementsMap).length;
    return total > 0 ? (earned / total) * 100 : 0;
};

/**
 * 检查是否有新的成就通知
 */
const hasNewNotifications = (s: EducationStoreState) =>
    s.achievementNotifications.some(notification => !notification.shown);

/**
 * 获取即将完成的成就（进度 > 80%）
 */
const nearCompletionAchievements = (s: EducationStoreState) =>
    Object.values(s.inProgressAchievements).filter(
        progress => progress.progressPercentage >= 80 && progress.progressPercentage < 100
    );

export const educationAchievementsSelectors = {
    achievementDetails,
    achievementProgress,
    achievementStats,
    achievementsByCategory,
    achievementsByType,
    achievementsList,
    completionRate,
    earnedAchievements,
    hasAchievement,
    hasNewNotifications,
    inProgressAchievementsList,
    nearCompletionAchievements,
    unearnedAchievements,
    rareAchievements,
    recentAchievements,
    unshownNotifications,
    userLevelInfo,
};