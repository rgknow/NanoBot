import { z } from 'zod';

// Educational RAG Search Schema
export const EducationalSemanticSearchSchema = z.object({
    query: z.string().min(1),
    courseId: z.string().optional(),
    lessonId: z.string().optional(),
    subject: z.string().optional(),
    grade: z.string().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
    concepts: z.array(z.string()).optional(),
    knowledgeBaseIds: z.array(z.string()).optional(),
    limit: z.number().min(1).max(50).default(10),
});

export type EducationalSemanticSearchParams = z.infer<typeof EducationalSemanticSearchSchema>;

// AI Tutor Query Schema
export const AiTutorQuerySchema = z.object({
    query: z.string().min(1),
    sessionId: z.string().optional(),
    courseId: z.string().optional(),
    lessonId: z.string().optional(),
    difficulty: z.string().optional(),
    tutorPersonality: z.enum(['encouraging', 'challenging', 'patient', 'enthusiastic']).default('encouraging'),
    context: z.string().optional(),
});

export type AiTutorQueryParams = z.infer<typeof AiTutorQuerySchema>;

// Educational Content Processing Schema
export const EducationalContentProcessingSchema = z.object({
    content: z.string().min(1),
    courseId: z.string().optional(),
    lessonId: z.string().optional(),
    knowledgeBaseId: z.string(),
    learningObjectives: z.array(z.string()).optional(),
    concepts: z.array(z.string()).optional(),
    prerequisites: z.array(z.string()).optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).default('beginner'),
    contentType: z.enum(['text', 'pdf', 'video', 'interactive', 'assessment']).default('text'),
});

export type EducationalContentProcessingParams = z.infer<typeof EducationalContentProcessingSchema>;

// Content Validation Schema
export const ContentValidationSchema = z.object({
    chunkId: z.string(),
    validationType: z.enum(['accuracy', 'relevance', 'appropriateness', 'clarity']),
    accuracyScore: z.number().min(0).max(100).optional(),
    relevanceScore: z.number().min(0).max(100).optional(),
    clarityScore: z.number().min(0).max(100).optional(),
    appropriatenessScore: z.number().min(0).max(100).optional(),
    feedback: z.string().optional(),
    suggestions: z.string().optional(),
    flaggedIssues: z.array(z.string()).optional(),
});

export type ContentValidationParams = z.infer<typeof ContentValidationSchema>;

// Educational Search Result Interface
export interface EducationalSearchResult {
    id: string;
    text: string;
    abstract?: string;
    similarity: number;
    concepts?: string[];
    learningObjectives?: string[];
    prerequisites?: string[];
    difficulty: string;
    courseId?: string;
    lessonId?: string;
    knowledgeBaseId: string;
    contentType: string;
    metadata?: Record<string, any>;
}

// AI Tutor Interaction Interface
export interface AiTutorInteraction {
    id: string;
    sessionId: string;
    userQuery: string;
    aiResponse: string;
    rewrittenQuery?: string;
    retrievedChunks: Array<{
        id: string;
        similarity: number;
        text: string;
    }>;
    contextUsed: string;
    interactionType: 'question' | 'explanation' | 'practice' | 'assessment' | 'feedback';
    difficulty?: string;
    concepts?: string[];
    responseTime: number;
    similarityScore: number;
    userFeedback?: 'helpful' | 'unhelpful' | 'neutral';
    isCorrectAnswer?: boolean;
    comprehensionLevel?: 'low' | 'medium' | 'high';
    timestamp: string;
}

// Educational Knowledge Base Interface
export interface EducationalKnowledgeBase {
    id: string;
    name: string;
    description?: string;
    subject: string;
    grade: string;
    difficulty: string;
    contentType: string;
    tags?: string[];
    language: string;
    embeddingModel?: string;
    chunkSize: number;
    chunkOverlap: number;
    createdBy: string;
    isPublic: boolean;
    qualityScore?: number;
    lastValidated?: string;
    createdAt: string;
    updatedAt: string;
}

// Learning Path Interface
export interface LearningPath {
    id: string;
    studentId: string;
    targetObjectives: string[];
    currentKnowledge?: string[];
    difficulty: string;
    timeConstraints?: number;
    steps: LearningPathStep[];
    estimatedDuration: number;
    progressTracking: {
        completedSteps: string[];
        currentStepId: string;
        overallProgress: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface LearningPathStep {
    id: string;
    title: string;
    description: string;
    estimatedTime: number; // in minutes
    prerequisites: string[];
    learningObjectives: string[];
    resources: Array<{
        id: string;
        type: 'content' | 'exercise' | 'assessment' | 'video' | 'reading';
        title: string;
        url?: string;
        description?: string;
    }>;
    assessmentCriteria?: string[];
    nextSteps: string[];
    order: number;
}

// Personalized Recommendation Interface
export interface PersonalizedRecommendation {
    id: string;
    studentId: string;
    title: string;
    description: string;
    contentType: 'course' | 'lesson' | 'exercise' | 'reading' | 'video';
    relevanceScore: number;
    difficulty: string;
    subject: string;
    grade?: string;
    concepts: string[];
    learningObjectives: string[];
    estimatedTime: number;
    reasoning: string; // Why this was recommended
    sourceKnowledgeBaseIds: string[];
    createdAt: string;
}

// Educational Analytics Interface
export interface EducationalAnalytics {
    knowledgeBaseStats: {
        totalKnowledgeBases: number;
        totalContent: number;
        validatedContent: number;
        averageQualityScore: number;
        conceptsCovered: number;
        subjectDistribution: Record<string, number>;
    };
    tutorSessionStats: {
        totalSessions: number;
        averageSessionDuration: number;
        interactionRate: number;
        satisfactionScore: number;
        commonQuestions: Array<{
            question: string;
            frequency: number;
            averageScore: number;
        }>;
    };
    learningPathStats: {
        totalPaths: number;
        completionRate: number;
        averageProgress: number;
        mostPopularObjectives: string[];
    };
}

// RAG Configuration Interface
export interface RAGConfiguration {
    embeddingModel: string;
    languageModel: string;
    chunkSize: number;
    chunkOverlap: number;
    searchLimit: number;
    similarityThreshold: number;
    retrievalStrategy: 'semantic' | 'keyword' | 'hybrid';
    rerankingEnabled: boolean;
    contextWindowSize: number;
    responseGenerationConfig: {
        temperature: number;
        maxTokens: number;
        topP: number;
        frequencyPenalty: number;
        presencePenalty: number;
    };
}