import { StateCreator } from 'zustand/vanilla';

import { trpc } from '@/libs/trpc';
import { EducationStore } from '@/store/education/store';
import { Action, setNamespace } from '@/utils/storeDebug';

import type { EducationStoreState } from '../../initialState';

const n = setNamespace('education-achievements');

export interface EducationAchievementsAction {
    /**
     * 获取所有成就数据
     */
    fetchAchievements: () => Promise<void>;

    /**
     * 获取用户成就数据
     */
    fetchUserAchievements: () => Promise<void>;

    /**
     * 检查并解锁成就
     */
    checkAndUnlockAchievements: () => Promise<void>;

    /**
     * 标记成就通知为已显示
     */
    markNotificationShown: (notificationId: string) => void;

    /**
     * 清除成就通知
     */
    clearAchievementNotifications: () => void;

    /**
     * 获取成就进度
     */
    fetchAchievementProgress: () => Promise<void>;

    /**
     * 更新成就进度
     */
    updateAchievementProgress: (achievementId: string, progress: number) => void;

    /**
     * 获取成就统计
     */
    fetchAchievementStats: () => Promise<void>;

    /**
     * 添加成就通知
     */
    addAchievementNotification: (achievementId: string) => void;
}

export const educationAchievementsSlice: StateCreator<
    EducationStore,
    [['zustand/devtools', never]],
    [],
    EducationAchievementsAction
> = (set, get) => ({
    fetchAchievements: async () => {
        const { achievementsInit, achievementsLoading } = get();
        if (achievementsLoading || achievementsInit) return;

        set({ achievementsLoading: true }, false, n('fetchAchievements/start'));

        try {
            const achievements = await trpc.education.achievements.getAllAchievements.query();
            const achievementsMap = achievements.reduce((acc, achievement) => {
                acc[achievement.id] = achievement;
                return acc;
            }, {} as Record<string, any>);

            set(
                {
                    achievementsMap,
                    achievementsInit: true,
                    achievementsLoading: false,
                },
                false,
                n('fetchAchievements/success'),
            );
        } catch (error) {
            set({ achievementsLoading: false }, false, n('fetchAchievements/error', error));
        }
    },

    fetchUserAchievements: async () => {
        try {
            const userAchievements = await trpc.education.achievements.getUserAchievements.query();
            const userAchievementsMap = userAchievements.reduce((acc, achievement) => {
                acc[achievement.achievementId] = achievement;
                return acc;
            }, {} as Record<string, any>);

            const recentAchievements = userAchievements
                .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
                .slice(0, 5)
                .map(achievement => achievement.achievementId);

            set(
                {
                    userAchievementsMap,
                    recentAchievements,
                },
                false,
                n('fetchUserAchievements/success'),
            );
        } catch (error) {
            console.error('Failed to fetch user achievements:', error);
        }
    },

    checkAndUnlockAchievements: async () => {
        try {
            const unlockedAchievements = await trpc.education.achievements.checkAchievements.mutate();

            if (unlockedAchievements.length > 0) {
                const { userAchievementsMap, achievementNotifications } = get();
                const updatedUserAchievements = { ...userAchievementsMap };
                const newNotifications = [...achievementNotifications];

                unlockedAchievements.forEach(achievement => {
                    updatedUserAchievements[achievement.achievementId] = achievement;

                    // Add notification
                    newNotifications.push({
                        id: `${achievement.achievementId}-${Date.now()}`,
                        achievementId: achievement.achievementId,
                        timestamp: achievement.earnedAt,
                        shown: false,
                    });
                });

                set(
                    {
                        userAchievementsMap: updatedUserAchievements,
                        achievementNotifications: newNotifications,
                    },
                    false,
                    n('checkAndUnlockAchievements/success', unlockedAchievements),
                );
            }
        } catch (error) {
            console.error('Failed to check achievements:', error);
        }
    },

    markNotificationShown: (notificationId) => {
        const { achievementNotifications } = get();
        const updatedNotifications = achievementNotifications.map(notification =>
            notification.id === notificationId
                ? { ...notification, shown: true }
                : notification
        );

        set(
            { achievementNotifications: updatedNotifications },
            false,
            n('markNotificationShown', notificationId),
        );
    },

    clearAchievementNotifications: () => {
        set(
            { achievementNotifications: [] },
            false,
            n('clearAchievementNotifications'),
        );
    },

    fetchAchievementProgress: async () => {
        try {
            const progress = await trpc.education.achievements.getAchievementProgress.query();
            const inProgressAchievements = progress.reduce((acc, item) => {
                acc[item.achievementId] = {
                    achievementId: item.achievementId,
                    currentProgress: item.currentProgress,
                    targetProgress: item.targetProgress,
                    progressPercentage: (item.currentProgress / item.targetProgress) * 100,
                };
                return acc;
            }, {} as Record<string, any>);

            set(
                { inProgressAchievements },
                false,
                n('fetchAchievementProgress/success'),
            );
        } catch (error) {
            console.error('Failed to fetch achievement progress:', error);
        }
    },

    updateAchievementProgress: (achievementId, progress) => {
        const { inProgressAchievements, achievementsMap } = get();
        const achievement = achievementsMap[achievementId];

        if (!achievement) return;

        const updatedProgress = {
            ...inProgressAchievements,
            [achievementId]: {
                achievementId,
                currentProgress: progress,
                targetProgress: achievement.targetValue || 100,
                progressPercentage: (progress / (achievement.targetValue || 100)) * 100,
            },
        };

        set(
            { inProgressAchievements: updatedProgress },
            false,
            n('updateAchievementProgress', { achievementId, progress }),
        );
    },

    fetchAchievementStats: async () => {
        try {
            const stats = await trpc.education.achievements.getAchievementStats.query();
            set(
                { achievementStats: stats },
                false,
                n('fetchAchievementStats/success'),
            );
        } catch (error) {
            console.error('Failed to fetch achievement stats:', error);
        }
    },

    addAchievementNotification: (achievementId) => {
        const { achievementNotifications } = get();
        const newNotification = {
            id: `${achievementId}-${Date.now()}`,
            achievementId,
            timestamp: new Date().toISOString(),
            shown: false,
        };

        set(
            {
                achievementNotifications: [...achievementNotifications, newNotification],
            },
            false,
            n('addAchievementNotification', achievementId),
        );
    },
});