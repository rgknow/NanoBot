import { StateCreator } from 'zustand/vanilla';

import { trpc } from '@/libs/trpc';
import { EducationStore } from '@/store/education/store';
import { setNamespace } from '@/utils/storeDebug';


const n = setNamespace('education-achievements');

export interface EducationAchievementsAction {
    /**
     * 添加成就通知
     */
    addAchievementNotification: (achievementId: string) => void;

    /**
     * 检查并解锁成就
     */
    checkAndUnlockAchievements: () => Promise<void>;

    /**
     * 清除成就通知
     */
    clearAchievementNotifications: () => void;

    /**
     * 获取成就进度
     */
    fetchAchievementProgress: () => Promise<void>;

    /**
     * 获取成就统计
     */
    fetchAchievementStats: () => Promise<void>;

    /**
     * 获取所有成就数据
     */
    fetchAchievements: () => Promise<void>;

    /**
     * 获取用户成就数据
     */
    fetchUserAchievements: () => Promise<void>;

    /**
     * 标记成就通知为已显示
     */
    markNotificationShown: (notificationId: string) => void;

    /**
     * 更新成就进度
     */
    updateAchievementProgress: (achievementId: string, progress: number) => void;
}

export const educationAchievementsSlice: StateCreator<
    EducationStore,
    [['zustand/devtools', never]],
    [],
    EducationAchievementsAction
> = (set, get) => ({
    addAchievementNotification: (achievementId) => {
        const { achievementNotifications } = get();
        const newNotification = {
            achievementId,
            id: `${achievementId}-${Date.now()}`,
            shown: false,
            timestamp: new Date().toISOString(),
        };

        set(
            {
                achievementNotifications: [...achievementNotifications, newNotification],
            },
            false,
            n('addAchievementNotification', achievementId),
        );
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
                        achievementId: achievement.achievementId,
                        id: `${achievement.achievementId}-${Date.now()}`,
                        shown: false,
                        timestamp: achievement.earnedAt,
                    });
                });

                set(
                    {
                        achievementNotifications: newNotifications,
                        userAchievementsMap: updatedUserAchievements,
                    },
                    false,
                    n('checkAndUnlockAchievements/success', unlockedAchievements),
                );
            }
        } catch (error) {
            console.error('Failed to check achievements:', error);
        }
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
                    progressPercentage: (item.currentProgress / item.targetProgress) * 100,
                    targetProgress: item.targetProgress,
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
                    achievementsInit: true,
                    achievementsLoading: false,
                    achievementsMap,
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
                    recentAchievements,
                    userAchievementsMap,
                },
                false,
                n('fetchUserAchievements/success'),
            );
        } catch (error) {
            console.error('Failed to fetch user achievements:', error);
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

    updateAchievementProgress: (achievementId, progress) => {
        const { inProgressAchievements, achievementsMap } = get();
        const achievement = achievementsMap[achievementId];

        if (!achievement) return;

        const updatedProgress = {
            ...inProgressAchievements,
            [achievementId]: {
                achievementId,
                currentProgress: progress,
                progressPercentage: (progress / (achievement.targetValue || 100)) * 100,
                targetProgress: achievement.targetValue || 100,
            },
        };

        set(
            { inProgressAchievements: updatedProgress },
            false,
            n('updateAchievementProgress', { achievementId, progress }),
        );
    },
});