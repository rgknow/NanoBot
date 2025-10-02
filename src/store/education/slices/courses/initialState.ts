export interface EducationCoursesState {
    /**
     * @title 当前选中的课程ID
     * @description 当前正在查看或编辑的课程
     */
    activeCourseId?: string;

    /**
     * @title 课程搜索结果
     * @description 搜索课程的结果ID列表
     */
    courseSearchResults: string[];

    /**
     * @title 课程初始化状态
     * @description 课程数据是否已初始化
     */
    coursesInit: boolean;

    /**
     * @title 课程加载状态
     * @description 是否正在加载课程数据
     */
    coursesLoading: boolean;

    /**
     * @title 课程数据映射
     * @description 存储所有课程数据的映射表
     */
    coursesMap: Record<string, any>;

    /**
     * @title 已注册课程列表
     * @description 用户已注册的课程ID列表
     */
    enrolledCourseIds: string[];

    /**
     * @title 课程过滤器
     * @description 课程筛选条件
     */
    filters: {
        category?: string;
        difficulty?: 'beginner' | 'intermediate' | 'advanced';
        duration?: 'short' | 'medium' | 'long';
        isFree?: boolean;
    };

    /**
     * @title 推荐课程列表
     * @description 推荐给用户的课程ID列表
     */
    recommendedCourseIds: string[];

    /**
     * @title 搜索关键词
     * @description 当前搜索的关键词
     */
    searchQuery: string;
}

export const initialCoursesState: EducationCoursesState = {
    activeCourseId: undefined,
    courseSearchResults: [],
    coursesInit: false,
    coursesLoading: false,
    coursesMap: {},
    enrolledCourseIds: [],
    filters: {},
    recommendedCourseIds: [],
    searchQuery: '',
};