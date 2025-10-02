export interface EducationRAGState {
    /**
     * @title 知识库数据映射
     * @description 存储教育知识库数据的映射表
     */
    knowledgeBasesMap: Record<string, any>;

    /**
     * @title 当前活动的知识库ID
     * @description 当前选中的知识库
     */
    activeKnowledgeBaseId?: string;

    /**
     * @title 知识库加载状态
     * @description 是否正在加载知识库数据
     */
    knowledgeBasesLoading: boolean;

    /**
     * @title 知识库初始化状态
     * @description 知识库数据是否已初始化
     */
    knowledgeBasesInit: boolean;

    /**
     * @title AI导师会话
     * @description 当前AI导师会话数据
     */
    currentTutorSession?: {
        id: string;
        courseId?: string;
        lessonId?: string;
        topic?: string;
        difficulty?: string;
        tutorPersonality: string;
        status: string;
        startedAt: string;
        interactions: any[];
    };

    /**
     * @title 导师会话历史
     * @description 用户的导师会话历史记录
     */
    tutorSessionHistory: string[];

    /**
     * @title 语义搜索结果
     * @description 最近的语义搜索结果
     */
    searchResults: Array<{
        id: string;
        text: string;
        similarity: number;
        concepts?: string[];
        learningObjectives?: string[];
        courseId?: string;
        lessonId?: string;
    }>;

    /**
     * @title 搜索查询
     * @description 当前搜索查询
     */
    currentSearchQuery: string;

    /**
     * @title 搜索加载状态
     * @description 是否正在进行搜索
     */
    searchLoading: boolean;

    /**
     * @title 内容验证状态
     * @description 内容验证状态映射
     */
    contentValidationMap: Record<string, {
        status: string;
        overallScore?: number;
        feedback?: string;
        validatedAt?: string;
        validatorId?: string;
    }>;

    /**
     * @title RAG配置
     * @description RAG系统配置选项
     */
    ragConfig: {
        embeddingModel: string;
        languageModel: string;
        chunkSize: number;
        chunkOverlap: number;
        searchLimit: number;
        similarityThreshold: number;
    };

    /**
     * @title 个性化推荐
     * @description 基于RAG的个性化内容推荐
     */
    personalizedRecommendations: Array<{
        id: string;
        title: string;
        description: string;
        relevanceScore: number;
        contentType: string;
        difficulty: string;
        concepts: string[];
    }>;

    /**
     * @title 学习路径
     * @description AI生成的个性化学习路径
     */
    learningPath?: {
        id: string;
        targetObjectives: string[];
        steps: Array<{
            id: string;
            title: string;
            description: string;
            estimatedTime: number;
            prerequisites: string[];
            resources: string[];
        }>;
        difficulty: string;
        estimatedDuration: number;
    };
}

export const initialRAGState: EducationRAGState = {
    knowledgeBasesMap: {},
    activeKnowledgeBaseId: undefined,
    knowledgeBasesLoading: false,
    knowledgeBasesInit: false,
    currentTutorSession: undefined,
    tutorSessionHistory: [],
    searchResults: [],
    currentSearchQuery: '',
    searchLoading: false,
    contentValidationMap: {},
    ragConfig: {
        embeddingModel: 'text-embedding-ada-002',
        languageModel: 'gpt-4',
        chunkSize: 1000,
        chunkOverlap: 200,
        searchLimit: 10,
        similarityThreshold: 0.7,
    },
    personalizedRecommendations: [],
    learningPath: undefined,
};