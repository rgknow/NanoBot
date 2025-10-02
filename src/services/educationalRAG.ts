import { lambdaClient } from '@/libs/trpc/client';

export interface EducationalSemanticSearchParams {
    query: string;
    courseId?: string;
    lessonId?: string;
    subject?: string;
    grade?: string;
    difficulty?: string;
    concepts?: string[];
    knowledgeBaseIds?: string[];
    limit?: number;
}

export interface AiTutorQueryParams {
    query: string;
    sessionId?: string;
    courseId?: string;
    lessonId?: string;
    difficulty?: string;
    tutorPersonality?: string;
    context?: string;
}

export interface ContentValidationParams {
    chunkId: string;
    validationType: 'accuracy' | 'relevance' | 'appropriateness';
    accuracyScore?: number;
    relevanceScore?: number;
    clarityScore?: number;
    appropriatenessScore?: number;
    feedback?: string;
    suggestions?: string;
    flaggedIssues?: string[];
}

class EducationalRAGService {
    // Knowledge Base Management
    createKnowledgeBase = async (params: {
        name: string;
        description?: string;
        subject: string;
        grade: string;
        difficulty?: string;
        contentType?: string;
        tags?: string[];
        isPublic?: boolean;
    }) => {
        return lambdaClient.education.rag.createKnowledgeBase.mutate(params);
    };

    updateKnowledgeBase = async (id: string, params: Partial<{
        name: string;
        description: string;
        subject: string;
        grade: string;
        difficulty: string;
        tags: string[];
        isPublic: boolean;
    }>) => {
        return lambdaClient.education.rag.updateKnowledgeBase.mutate({ id, ...params });
    };

    deleteKnowledgeBase = async (id: string) => {
        return lambdaClient.education.rag.deleteKnowledgeBase.mutate({ id });
    };

    getKnowledgeBases = async (filters?: {
        subject?: string;
        grade?: string;
        difficulty?: string;
        isPublic?: boolean;
    }) => {
        return lambdaClient.education.rag.getKnowledgeBases.query(filters);
    };

    // Educational Content Processing
    processEducationalContent = async (params: {
        content: string;
        courseId?: string;
        lessonId?: string;
        knowledgeBaseId: string;
        learningObjectives?: string[];
        concepts?: string[];
        prerequisites?: string[];
        difficulty?: string;
        contentType?: string;
    }) => {
        return lambdaClient.education.rag.processContent.mutate(params);
    };

    createEducationalChunks = async (params: {
        knowledgeBaseId: string;
        content: string;
        chunkSize?: number;
        chunkOverlap?: number;
        courseId?: string;
        lessonId?: string;
        learningObjectives?: string[];
        concepts?: string[];
    }) => {
        return lambdaClient.education.rag.createChunks.mutate(params);
    };

    generateEmbeddings = async (chunkIds: string[]) => {
        return lambdaClient.education.rag.generateEmbeddings.mutate({ chunkIds });
    };

    // Educational Semantic Search
    semanticSearch = async (params: EducationalSemanticSearchParams) => {
        return lambdaClient.education.rag.semanticSearch.mutate(params);
    };

    searchByLearningObjective = async (params: {
        learningObjective: string;
        subject?: string;
        grade?: string;
        difficulty?: string;
        limit?: number;
    }) => {
        return lambdaClient.education.rag.searchByLearningObjective.query(params);
    };

    searchByConcept = async (params: {
        concept: string;
        subject?: string;
        grade?: string;
        relatedConcepts?: string[];
        limit?: number;
    }) => {
        return lambdaClient.education.rag.searchByConcept.query(params);
    };

    // AI Tutor Integration
    startTutorSession = async (params: {
        courseId?: string;
        lessonId?: string;
        knowledgeBaseId?: string;
        tutorPersonality?: string;
        sessionType?: string;
        topic?: string;
        difficulty?: string;
    }) => {
        return lambdaClient.education.rag.startTutorSession.mutate(params);
    };

    endTutorSession = async (sessionId: string, feedback?: {
        helpfulVotes: number;
        unhelpfulVotes: number;
        overallRating: number;
        comments?: string;
    }) => {
        return lambdaClient.education.rag.endTutorSession.mutate({ sessionId, feedback });
    };

    queryAiTutor = async (params: AiTutorQueryParams) => {
        return lambdaClient.education.rag.queryAiTutor.mutate(params);
    };

    provideTutorFeedback = async (interactionId: string, feedback: {
        isHelpful: boolean;
        isCorrect?: boolean;
        comprehensionLevel?: string;
        comments?: string;
    }) => {
        return lambdaClient.education.rag.provideTutorFeedback.mutate({ interactionId, ...feedback });
    };

    // Content Validation
    validateContent = async (params: ContentValidationParams) => {
        return lambdaClient.education.rag.validateContent.mutate(params);
    };

    getValidationStatus = async (chunkId: string) => {
        return lambdaClient.education.rag.getValidationStatus.query({ chunkId });
    };

    approveContent = async (chunkId: string, feedback?: string) => {
        return lambdaClient.education.rag.approveContent.mutate({ chunkId, feedback });
    };

    rejectContent = async (chunkId: string, reason: string, suggestions?: string) => {
        return lambdaClient.education.rag.rejectContent.mutate({ chunkId, reason, suggestions });
    };

    // Analytics and Insights
    getKnowledgeBaseStats = async (knowledgeBaseId: string) => {
        return lambdaClient.education.rag.getKnowledgeBaseStats.query({ knowledgeBaseId });
    };

    getTutorSessionAnalytics = async (filters?: {
        courseId?: string;
        studentId?: string;
        dateFrom?: string;
        dateTo?: string;
    }) => {
        return lambdaClient.education.rag.getTutorSessionAnalytics.query(filters);
    };

    getContentQualityMetrics = async (knowledgeBaseId?: string) => {
        return lambdaClient.education.rag.getContentQualityMetrics.query({ knowledgeBaseId });
    };

    // Curriculum Alignment
    alignContentToCurriculum = async (params: {
        chunkId: string;
        standardsAlignment: string[];
        learningObjectives: string[];
        prerequisites: string[];
        assessmentCriteria?: string[];
    }) => {
        return lambdaClient.education.rag.alignContentToCurriculum.mutate(params);
    };

    generateLearningPath = async (params: {
        studentId: string;
        targetObjectives: string[];
        currentKnowledge?: string[];
        difficulty?: string;
        timeConstraints?: number; // minutes
    }) => {
        return lambdaClient.education.rag.generateLearningPath.mutate(params);
    };

    // Adaptive Learning
    adaptContentDifficulty = async (params: {
        studentId: string;
        courseId: string;
        currentPerformance: number; // 0-100
        learningStyle?: string;
        timeSpent?: number;
    }) => {
        return lambdaClient.education.rag.adaptContentDifficulty.mutate(params);
    };

    getPersonalizedRecommendations = async (params: {
        studentId: string;
        courseId?: string;
        subject?: string;
        limit?: number;
    }) => {
        return lambdaClient.education.rag.getPersonalizedRecommendations.query(params);
    };
}

export const educationalRAGService = new EducationalRAGService();