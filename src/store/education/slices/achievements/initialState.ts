export interface EducationAchievementsState {
    /**
     * @title 成就通知队列
     * @description 待显示的成就通知队列
     */
    achievementNotifications: Array<{
        achievementId: string;
        id: string;
        shown: boolean;
        timestamp: string;
    }>;

    /**
     * @title 成就统计
     * @description 用户成就统计信息
     */
    achievementStats: {
        completionRate: number;
        level: number;
        points: number;
        totalAvailable: number;
        totalEarned: number;
    };

    /**
     * @title 成就初始化状态
     * @description 成就数据是否已初始化
     */
    achievementsInit: boolean;

    /**
     * @title 成就加载状态
     * @description 是否正在加载成就数据
     */
    achievementsLoading: boolean;

    /**
     * @title 成就数据映射
     * @description 存储所有成就数据的映射表
     */
    achievementsMap: Record<string, any>;

    /**
     * @title 进行中的成就
     * @description 用户正在进行中的成就（部分完成）
     */
    inProgressAchievements: Record<string, {
        achievementId: string;
        currentProgress: number;
        progressPercentage: number;
        targetProgress: number;
    }>;

    /**
     * @title 最近获得的成就
     * @description 用户最近获得的成就列表
     */
    recentAchievements: string[];

    /**
     * @title 用户成就映射
     * @description 存储用户已获得的成就数据
     */
    userAchievementsMap: Record<string, any>;
}

export const initialAchievementsState: EducationAchievementsState = {
    achievementNotifications: [],
    achievementStats: {
        completionRate: 0,
        level: 1,
        totalAvailable: 0,
        points: 0,
        totalEarned: 0,
    },
    achievementsInit: false,
    achievementsLoading: false,
    achievementsMap: {},
    inProgressAchievements: {},
    recentAchievements: [],
    userAchievementsMap: {},
};