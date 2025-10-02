import { lambdaClient } from '@/libs/trpc/client';

export interface EducationalSemanticSearchParams {
    concepts?: string[];
    courseId?: string;
    difficulty?: string;
    grade?: string;
    knowledgeBaseIds?: string[];
    lessonId?: string;
    limit?: number;
    query: string;
    subject?: string;
}

export interface AiTutorQueryParams {
    context?: string;
    courseId?: string;
    difficulty?: string;
    lessonId?: string;
    query: string;
    sessionId?: string;
    tutorPersonality?: string;
}

export interface ContentValidationParams {
    accuracyScore?: number;
    appropriatenessScore?: number;
    chunkId: string;
    clarityScore?: number;
    feedback?: string;
    flaggedIssues?: string[];
    relevanceScore?: number;
    suggestions?: string;
    validationType: 'accuracy' | 'relevance' | 'appropriateness';
}

class EducationalRAGService {
    // Knowledge Base Management
    createKnowledgeBase = async (params: {
        contentType?: string;
        description?: string;
        difficulty?: string;
        grade: string;
        isPublic?: boolean;
        name: string;
        subject: string;
        tags?: string[];
    }) => {
        return lambdaClient.education.rag.createKnowledgeBase.mutate(params);
    };

    updateKnowledgeBase = async (id: string, params: Partial<{
        description: string;
        difficulty: string;
        grade: string;
        isPublic: boolean;
        name: string;
        subject: string;
        tags: string[];
    }>) => {
        return lambdaClient.education.rag.updateKnowledgeBase.mutate({ id, ...params });
    };

    deleteKnowledgeBase = async (id: string) => {
        return lambdaClient.education.rag.deleteKnowledgeBase.mutate({ id });
    };

    getKnowledgeBases = async (filters?: {
        difficulty?: string;
        grade?: string;
        isPublic?: boolean;
        subject?: string;
    }) => {
        return lambdaClient.education.rag.getKnowledgeBases.query(filters);
    };

    // Educational Content Processing
    processEducationalContent = async (params: {
        concepts?: string[];
        content: string;
        contentType?: string;
        courseId?: string;
        difficulty?: string;
        knowledgeBaseId: string;
        learningObjectives?: string[];
        lessonId?: string;
        prerequisites?: string[];
    }) => {
        return lambdaClient.education.rag.processContent.mutate(params);
    };

    createEducationalChunks = async (params: {
        chunkOverlap?: number;
        chunkSize?: number;
        concepts?: string[];
        content: string;
        courseId?: string;
        knowledgeBaseId: string;
        learningObjectives?: string[];
        lessonId?: string;
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
        difficulty?: string;
        grade?: string;
        learningObjective: string;
        limit?: number;
        subject?: string;
    }) => {
        return lambdaClient.education.rag.searchByLearningObjective.query(params);
    };

    searchByConcept = async (params: {
        concept: string;
        grade?: string;
        limit?: number;
        relatedConcepts?: string[];
        subject?: string;
    }) => {
        return lambdaClient.education.rag.searchByConcept.query(params);
    };

    // AI Tutor Integration
    startTutorSession = async (params: {
        courseId?: string;
        difficulty?: string;
        knowledgeBaseId?: string;
        lessonId?: string;
        sessionType?: string;
        topic?: string;
        tutorPersonality?: string;
    }) => {
        return lambdaClient.education.rag.startTutorSession.mutate(params);
    };

    endTutorSession = async (sessionId: string, feedback?: {
        comments?: string;
        helpfulVotes: number;
        overallRating: number;
        unhelpfulVotes: number;
    }) => {
        return lambdaClient.education.rag.endTutorSession.mutate({ feedback, sessionId });
    };

    queryAiTutor = async (params: AiTutorQueryParams) => {
        return lambdaClient.education.rag.queryAiTutor.mutate(params);
    };

    provideTutorFeedback = async (interactionId: string, feedback: {
        comments?: string;
        comprehensionLevel?: string;
        isCorrect?: boolean;
        isHelpful: boolean;
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
        dateFrom?: string;
        dateTo?: string;
        studentId?: string;
    }) => {
        return lambdaClient.education.rag.getTutorSessionAnalytics.query(filters);
    };

    getContentQualityMetrics = async (knowledgeBaseId?: string) => {
        return lambdaClient.education.rag.getContentQualityMetrics.query({ knowledgeBaseId });
    };

    // Curriculum Alignment
    alignContentToCurriculum = async (params: {
        assessmentCriteria?: string[];
        chunkId: string;
        learningObjectives: string[];
        prerequisites: string[];
        standardsAlignment: string[];
    }) => {
        return lambdaClient.education.rag.alignContentToCurriculum.mutate(params);
    };

    generateLearningPath = async (params: {
        currentKnowledge?: string[];
        difficulty?: string;
        studentId: string;
        targetObjectives: string[];
        timeConstraints?: number; // minutes
    }) => {
        return lambdaClient.education.rag.generateLearningPath.mutate(params);
    };

    // Adaptive Learning
    adaptContentDifficulty = async (params: {
        courseId: string;
        currentPerformance: number;
        // 0-100
        learningStyle?: string; 
        studentId: string;
        timeSpent?: number;
    }) => {
        return lambdaClient.education.rag.adaptContentDifficulty.mutate(params);
    };

    getPersonalizedRecommendations = async (params: {
        courseId?: string;
        limit?: number;
        studentId: string;
        subject?: string;
    }) => {
        return lambdaClient.education.rag.getPersonalizedRecommendations.query(params);
    };
}

export const educationalRAGService = new EducationalRAGService();