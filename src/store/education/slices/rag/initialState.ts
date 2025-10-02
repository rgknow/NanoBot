export interface EducationRAGState {
    /**
     * @title 当前活动的知识库ID
     * @description 当前选中的知识库
     */
    activeKnowledgeBaseId?: string;

    /**
     * @title 内容验证状态
     * @description 内容验证状态映射
     */
    contentValidationMap: Record<string, {
        feedback?: string;
        overallScore?: number;
        status: string;
        validatedAt?: string;
        validatorId?: string;
    }>;

    /**
     * @title 搜索查询
     * @description 当前搜索查询
     */
    currentSearchQuery: string;

    /**
     * @title AI导师会话
     * @description 当前AI导师会话数据
     */
    currentTutorSession?: {
        courseId?: string;
        difficulty?: string;
        id: string;
        interactions: any[];
        lessonId?: string;
        startedAt: string;
        status: string;
        topic?: string;
        tutorPersonality: string;
    };

    /**
     * @title 知识库初始化状态
     * @description 知识库数据是否已初始化
     */
    knowledgeBasesInit: boolean;

    /**
     * @title 知识库加载状态
     * @description 是否正在加载知识库数据
     */
    knowledgeBasesLoading: boolean;

    /**
     * @title 知识库数据映射
     * @description 存储教育知识库数据的映射表
     */
    knowledgeBasesMap: Record<string, any>;

    /**
     * @title 学习路径
     * @description AI生成的个性化学习路径
     */
    learningPath?: {
        difficulty: string;
        estimatedDuration: number;
        id: string;
        steps: Array<{
            description: string;
            estimatedTime: number;
            id: string;
            prerequisites: string[];
            resources: string[];
            title: string;
        }>;
        targetObjectives: string[];
    };

    /**
     * @title 个性化推荐
     * @description 基于RAG的个性化内容推荐
     */
    personalizedRecommendations: Array<{
        concepts: string[];
        contentType: string;
        description: string;
        difficulty: string;
        id: string;
        relevanceScore: number;
        title: string;
    }>;

    /**
     * @title RAG配置
     * @description RAG系统配置选项
     */
    ragConfig: {
        chunkOverlap: number;
        chunkSize: number;
        embeddingModel: string;
        languageModel: string;
        searchLimit: number;
        similarityThreshold: number;
    };

    /**
     * @title 搜索加载状态
     * @description 是否正在进行搜索
     */
    searchLoading: boolean;

    /**
     * @title 语义搜索结果
     * @description 最近的语义搜索结果
     */
    searchResults: Array<{
        concepts?: string[];
        courseId?: string;
        id: string;
        similarity: number;
        lessonId?: string;
        text: string;
        learningObjectives?: string[];
    }>;

    /**
     * @title 导师会话历史
     * @description 用户的导师会话历史记录
     */
    tutorSessionHistory: string[];
}

export const initialRAGState: EducationRAGState = {
    activeKnowledgeBaseId: undefined,
    contentValidationMap: {},
    currentSearchQuery: '',
    currentTutorSession: undefined,
    knowledgeBasesInit: false,
    knowledgeBasesLoading: false,
    knowledgeBasesMap: {},
    learningPath: undefined,
    personalizedRecommendations: [],
    ragConfig: {
        chunkOverlap: 200,
        chunkSize: 1000,
        embeddingModel: 'text-embedding-ada-002',
        languageModel: 'gpt-4',
        searchLimit: 10,
        similarityThreshold: 0.7,
    },
    searchLoading: false,
    searchResults: [],
    tutorSessionHistory: [],
};