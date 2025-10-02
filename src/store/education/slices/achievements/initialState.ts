export interface EducationAchievementsState {
    /**
     * @title 成就数据映射
     * @description 存储所有成就数据的映射表
     */
    achievementsMap: Record<string, any>;

    /**
     * @title 用户成就映射
     * @description 存储用户已获得的成就数据
     */
    userAchievementsMap: Record<string, any>;

    /**
     * @title 成就加载状态
     * @description 是否正在加载成就数据
     */
    achievementsLoading: boolean;

    /**
     * @title 成就初始化状态
     * @description 成就数据是否已初始化
     */
    achievementsInit: boolean;

    /**
     * @title 最近获得的成就
     * @description 用户最近获得的成就列表
     */
    recentAchievements: string[];

    /**
     * @title 进行中的成就
     * @description 用户正在进行中的成就（部分完成）
     */
    inProgressAchievements: Record<string, {
        achievementId: string;
        currentProgress: number;
        targetProgress: number;
        progressPercentage: number;
    }>;

    /**
     * @title 成就通知队列
     * @description 待显示的成就通知队列
     */
    achievementNotifications: Array<{
        id: string;
        achievementId: string;
        timestamp: string;
        shown: boolean;
    }>;

    /**
     * @title 成就统计
     * @description 用户成就统计信息
     */
    achievementStats: {
        totalEarned: number;
        totalAvailable: number;
        completionRate: number;
        points: number;
        level: number;
    };
}

export const initialAchievementsState: EducationAchievementsState = {
    achievementsMap: {},
    userAchievementsMap: {},
    achievementsLoading: false,
    achievementsInit: false,
    recentAchievements: [],
    inProgressAchievements: {},
    achievementNotifications: [],
    achievementStats: {
        totalEarned: 0,
        totalAvailable: 0,
        completionRate: 0,
        points: 0,
        level: 1,
    },
};