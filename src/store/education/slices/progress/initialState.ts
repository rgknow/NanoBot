export interface EducationProgressState {
    /**
     * @title 用户进度映射
     * @description 存储用户在各个课程中的进度数据
     */
    progressMap: Record<string, any>;

    /**
     * @title 课程进度映射
     * @description 存储每个课程的详细进度信息
     */
    courseProgressMap: Record<string, {
        courseId: string;
        completedLessons: string[];
        totalLessons: number;
        progressPercentage: number;
        lastAccessedAt: string;
        timeSpent: number; // in minutes
    }>;

    /**
     * @title 进度加载状态
     * @description 是否正在加载进度数据
     */
    progressLoading: boolean;

    /**
     * @title 进度初始化状态
     * @description 进度数据是否已初始化
     */
    progressInit: boolean;

    /**
     * @title 学习统计数据
     * @description 用户的学习统计信息
     */
    learningStats: {
        totalTimeSpent: number;
        coursesCompleted: number;
        lessonsCompleted: number;
        streakDays: number;
        lastStudyDate?: string;
    };

    /**
     * @title 学习目标
     * @description 用户设定的学习目标
     */
    learningGoals: {
        dailyMinutes: number;
        weeklyHours: number;
        monthlyCoursesToComplete: number;
    };
}

export const initialProgressState: EducationProgressState = {
    progressMap: {},
    courseProgressMap: {},
    progressLoading: false,
    progressInit: false,
    learningStats: {
        totalTimeSpent: 0,
        coursesCompleted: 0,
        lessonsCompleted: 0,
        streakDays: 0,
    },
    learningGoals: {
        dailyMinutes: 30,
        weeklyHours: 5,
        monthlyCoursesToComplete: 1,
    },
};