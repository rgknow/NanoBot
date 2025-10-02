export interface EducationProgressState {
    /**
     * @title 课程进度映射
     * @description 存储每个课程的详细进度信息
     */
    courseProgressMap: Record<string, {
        completedLessons: string[];
        courseId: string;
        lastAccessedAt: string;
        progressPercentage: number;
        timeSpent: number;
        totalLessons: number; // in minutes
    }>;

    /**
     * @title 学习目标
     * @description 用户设定的学习目标
     */
    learningGoals: {
        dailyMinutes: number;
        monthlyCoursesToComplete: number;
        weeklyHours: number;
    };

    /**
     * @title 学习统计数据
     * @description 用户的学习统计信息
     */
    learningStats: {
        coursesCompleted: number;
        lastStudyDate?: string;
        lessonsCompleted: number;
        streakDays: number;
        totalTimeSpent: number;
    };

    /**
     * @title 进度初始化状态
     * @description 进度数据是否已初始化
     */
    progressInit: boolean;

    /**
     * @title 进度加载状态
     * @description 是否正在加载进度数据
     */
    progressLoading: boolean;

    /**
     * @title 用户进度映射
     * @description 存储用户在各个课程中的进度数据
     */
    progressMap: Record<string, any>;
}

export const initialProgressState: EducationProgressState = {
    courseProgressMap: {},
    learningGoals: {
        dailyMinutes: 30,
        monthlyCoursesToComplete: 1,
        weeklyHours: 5,
    },
    learningStats: {
        coursesCompleted: 0,
        lessonsCompleted: 0,
        streakDays: 0,
        totalTimeSpent: 0,
    },
    progressInit: false,
    progressLoading: false,
    progressMap: {},
};