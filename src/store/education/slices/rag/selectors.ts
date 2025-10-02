import type { EducationStoreState } from '../../initialState';

/**
 * 获取当前活动的知识库
 */
const activeKnowledgeBase = (s: EducationStoreState) => {
    if (!s.activeKnowledgeBaseId) return undefined;
    return s.knowledgeBasesMap[s.activeKnowledgeBaseId];
};

/**
 * 获取所有知识库列表
 */
const knowledgeBasesList = (s: EducationStoreState) => Object.values(s.knowledgeBasesMap);

/**
 * 根据主题筛选知识库
 */
const knowledgeBasesBySubject = (subject: string) => (s: EducationStoreState) =>
    Object.values(s.knowledgeBasesMap).filter(kb => kb?.subject === subject);

/**
 * 根据年级筛选知识库
 */
const knowledgeBasesByGrade = (grade: string) => (s: EducationStoreState) =>
    Object.values(s.knowledgeBasesMap).filter(kb => kb?.grade === grade);

/**
 * 获取公开知识库
 */
const publicKnowledgeBases = (s: EducationStoreState) =>
    Object.values(s.knowledgeBasesMap).filter(kb => kb?.isPublic === true);

/**
 * 获取用户创建的知识库
 */
const userKnowledgeBases = (userId: string) => (s: EducationStoreState) =>
    Object.values(s.knowledgeBasesMap).filter(kb => kb?.createdBy === userId);

/**
 * 获取当前搜索结果
 */
const searchResults = (s: EducationStoreState) => s.searchResults;

/**
 * 获取搜索结果统计
 */
const searchResultsStats = (s: EducationStoreState) => {
    const results = s.searchResults;
    const concepts = new Set(results.flatMap(r => r.concepts || []));
    const avgSimilarity = results.length > 0
        ? results.reduce((sum, r) => sum + r.similarity, 0) / results.length
        : 0;

    return {
        averageSimilarity: avgSimilarity,
        highQualityResults: results.filter(r => r.similarity > 0.8).length,
        totalResults: results.length,
        uniqueConcepts: concepts.size,
    };
};

/**
 * 获取当前AI导师会话
 */
const currentTutorSession = (s: EducationStoreState) => s.currentTutorSession;

/**
 * 检查是否有活跃的导师会话
 */
const hasActiveTutorSession = (s: EducationStoreState) =>
    Boolean(s.currentTutorSession && s.currentTutorSession.status === 'active');

/**
 * 获取导师会话历史
 */
const tutorSessionHistory = (s: EducationStoreState) => s.tutorSessionHistory;

/**
 * 获取最近的导师交互
 */
const recentTutorInteractions = (s: EducationStoreState) => {
    if (!s.currentTutorSession) return [];
    return s.currentTutorSession.interactions.slice(-5); // Last 5 interactions
};

/**
 * 获取个性化推荐
 */
const personalizedRecommendations = (s: EducationStoreState) => s.personalizedRecommendations;

/**
 * 根据相关性排序推荐
 */
const topRecommendations = (limit: number = 5) => (s: EducationStoreState) =>
    s.personalizedRecommendations
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);

/**
 * 根据难度筛选推荐
 */
const recommendationsByDifficulty = (difficulty: string) => (s: EducationStoreState) =>
    s.personalizedRecommendations.filter(rec => rec.difficulty === difficulty);

/**
 * 获取学习路径
 */
const learningPath = (s: EducationStoreState) => s.learningPath;

/**
 * 获取学习路径进度
 */
const learningPathProgress = (s: EducationStoreState) => {
    if (!s.learningPath) return null;

    // This would be calculated based on completed steps
    // For now, return mock data
    return {
        completedSteps: 0,
        currentStep: s.learningPath.steps[0],
        estimatedTimeRemaining: s.learningPath.estimatedDuration,
        progressPercentage: 0,
        totalSteps: s.learningPath.steps.length,
    };
};

/**
 * 获取RAG配置
 */
const ragConfig = (s: EducationStoreState) => s.ragConfig;

/**
 * 获取内容验证状态
 */
const contentValidation = (chunkId: string) => (s: EducationStoreState) =>
    s.contentValidationMap[chunkId];

/**
 * 获取已验证内容统计
 */
const validationStats = (s: EducationStoreState) => {
    const validations = Object.values(s.contentValidationMap);
    const approvedCount = validations.filter(v => v.status === 'approved').length;
    const rejectedCount = validations.filter(v => v.status === 'rejected').length;
    const pendingCount = validations.filter(v => v.status === 'pending').length;

    const avgScore = validations.length > 0
        ? validations.reduce((sum, v) => sum + (v.overallScore || 0), 0) / validations.length
        : 0;

    return {
        approvalRate: validations.length > 0 ? (approvedCount / validations.length) * 100 : 0,
        approved: approvedCount,
        averageScore: avgScore,
        pending: pendingCount,
        rejected: rejectedCount,
        total: validations.length,
    };
};

/**
 * 检查搜索是否正在进行
 */
const isSearching = (s: EducationStoreState) => s.searchLoading;

/**
 * 检查知识库是否正在加载
 */
const isLoadingKnowledgeBases = (s: EducationStoreState) => s.knowledgeBasesLoading;

/**
 * 获取高质量内容推荐
 */
const highQualityRecommendations = (s: EducationStoreState) =>
    s.personalizedRecommendations.filter(rec => rec.relevanceScore >= 0.8);

/**
 * 获取概念覆盖统计
 */
const conceptCoverage = (s: EducationStoreState) => {
    const allConcepts = new Set();

    // From search results
    s.searchResults.forEach(result => {
        result.concepts?.forEach(concept => allConcepts.add(concept));
    });

    // From recommendations
    s.personalizedRecommendations.forEach(rec => {
        rec.concepts.forEach(concept => allConcepts.add(concept));
    });

    return {
        conceptsList: Array.from(allConcepts),
        totalConcepts: allConcepts.size,
    };
};

export const educationRAGSelectors = {
    activeKnowledgeBase,
    currentTutorSession,
    hasActiveTutorSession,
    knowledgeBasesByGrade,
    knowledgeBasesBySubject,
    knowledgeBasesList,
    personalizedRecommendations,
    publicKnowledgeBases,
    learningPath,
    recentTutorInteractions,
    contentValidation,
    recommendationsByDifficulty,
    isSearching,
    searchResults,
    highQualityRecommendations,
    userKnowledgeBases,
    conceptCoverage,
    searchResultsStats,
    isLoadingKnowledgeBases,
    learningPathProgress,
    tutorSessionHistory,
    ragConfig,
    topRecommendations,
    validationStats,
};