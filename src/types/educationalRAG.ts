import { z } from 'zod';

// Educational RAG Search Schema
export const EducationalSemanticSearchSchema = z.object({
    concepts: z.array(z.string()).optional(),
    courseId: z.string().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
    grade: z.string().optional(),
    knowledgeBaseIds: z.array(z.string()).optional(),
    lessonId: z.string().optional(),
    limit: z.number().min(1).max(50).default(10),
    query: z.string().min(1),
    subject: z.string().optional(),
});

export type EducationalSemanticSearchParams = z.infer<typeof EducationalSemanticSearchSchema>;

// AI Tutor Query Schema
export const AiTutorQuerySchema = z.object({
    context: z.string().optional(),
    courseId: z.string().optional(),
    difficulty: z.string().optional(),
    lessonId: z.string().optional(),
    query: z.string().min(1),
    sessionId: z.string().optional(),
    tutorPersonality: z.enum(['encouraging', 'challenging', 'patient', 'enthusiastic']).default('encouraging'),
});

export type AiTutorQueryParams = z.infer<typeof AiTutorQuerySchema>;

// Educational Content Processing Schema
export const EducationalContentProcessingSchema = z.object({
    concepts: z.array(z.string()).optional(),
    content: z.string().min(1),
    contentType: z.enum(['text', 'pdf', 'video', 'interactive', 'assessment']).default('text'),
    courseId: z.string().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).default('beginner'),
    knowledgeBaseId: z.string(),
    learningObjectives: z.array(z.string()).optional(),
    lessonId: z.string().optional(),
    prerequisites: z.array(z.string()).optional(),
});

export type EducationalContentProcessingParams = z.infer<typeof EducationalContentProcessingSchema>;

// Content Validation Schema
export const ContentValidationSchema = z.object({
    accuracyScore: z.number().min(0).max(100).optional(),
    appropriatenessScore: z.number().min(0).max(100).optional(),
    chunkId: z.string(),
    clarityScore: z.number().min(0).max(100).optional(),
    feedback: z.string().optional(),
    flaggedIssues: z.array(z.string()).optional(),
    relevanceScore: z.number().min(0).max(100).optional(),
    suggestions: z.string().optional(),
    validationType: z.enum(['accuracy', 'relevance', 'appropriateness', 'clarity']),
});

export type ContentValidationParams = z.infer<typeof ContentValidationSchema>;

// Educational Search Result Interface
export interface EducationalSearchResult {
    abstract?: string;
    concepts?: string[];
    contentType: string;
    courseId?: string;
    difficulty: string;
    id: string;
    knowledgeBaseId: string;
    learningObjectives?: string[];
    lessonId?: string;
    metadata?: Record<string, any>;
    prerequisites?: string[];
    similarity: number;
    text: string;
}

// AI Tutor Interaction Interface
export interface AiTutorInteraction {
    aiResponse: string;
    comprehensionLevel?: 'low' | 'medium' | 'high';
    concepts?: string[];
    contextUsed: string;
    difficulty?: string;
    id: string;
    interactionType: 'question' | 'explanation' | 'practice' | 'assessment' | 'feedback';
    isCorrectAnswer?: boolean;
    responseTime: number;
    retrievedChunks: Array<{
        id: string;
        similarity: number;
        text: string;
    }>;
    rewrittenQuery?: string;
    sessionId: string;
    similarityScore: number;
    timestamp: string;
    userFeedback?: 'helpful' | 'unhelpful' | 'neutral';
    userQuery: string;
}

// Educational Knowledge Base Interface
export interface EducationalKnowledgeBase {
    chunkOverlap: number;
    chunkSize: number;
    contentType: string;
    createdAt: string;
    createdBy: string;
    description?: string;
    difficulty: string;
    embeddingModel?: string;
    grade: string;
    id: string;
    isPublic: boolean;
    language: string;
    lastValidated?: string;
    name: string;
    qualityScore?: number;
    subject: string;
    tags?: string[];
    updatedAt: string;
}

// Learning Path Interface
export interface LearningPath {
    createdAt: string;
    currentKnowledge?: string[];
    difficulty: string;
    estimatedDuration: number;
    id: string;
    progressTracking: {
        completedSteps: string[];
        currentStepId: string;
        overallProgress: number;
    };
    steps: LearningPathStep[];
    studentId: string;
    targetObjectives: string[];
    timeConstraints?: number;
    updatedAt: string;
}

export interface LearningPathStep {
    assessmentCriteria?: string[];
    description: string;
    estimatedTime: number;
    id: string; 
    learningObjectives: string[];
    nextSteps: string[];
    order: number;
    // in minutes
    prerequisites: string[];
    resources: Array<{
        description?: string;
        id: string;
        title: string;
        type: 'content' | 'exercise' | 'assessment' | 'video' | 'reading';
        url?: string;
    }>;
    title: string;
}

// Personalized Recommendation Interface
export interface PersonalizedRecommendation {
    concepts: string[];
    contentType: 'course' | 'lesson' | 'exercise' | 'reading' | 'video';
    createdAt: string;
    description: string;
    difficulty: string;
    estimatedTime: number;
    grade?: string;
    id: string;
    learningObjectives: string[];
    reasoning: string;
    relevanceScore: number;
    // Why this was recommended
    sourceKnowledgeBaseIds: string[];
    studentId: string; 
    subject: string;
    title: string;
}

// Educational Analytics Interface
export interface EducationalAnalytics {
    knowledgeBaseStats: {
        averageQualityScore: number;
        conceptsCovered: number;
        subjectDistribution: Record<string, number>;
        totalContent: number;
        totalKnowledgeBases: number;
        validatedContent: number;
    };
    learningPathStats: {
        averageProgress: number;
        completionRate: number;
        mostPopularObjectives: string[];
        totalPaths: number;
    };
    tutorSessionStats: {
        averageSessionDuration: number;
        commonQuestions: Array<{
            averageScore: number;
            frequency: number;
            question: string;
        }>;
        interactionRate: number;
        satisfactionScore: number;
        totalSessions: number;
    };
}

// RAG Configuration Interface
export interface RAGConfiguration {
    chunkOverlap: number;
    chunkSize: number;
    contextWindowSize: number;
    embeddingModel: string;
    languageModel: string;
    rerankingEnabled: boolean;
    responseGenerationConfig: {
        frequencyPenalty: number;
        maxTokens: number;
        presencePenalty: number;
        temperature: number;
        topP: number;
    };
    retrievalStrategy: 'semantic' | 'keyword' | 'hybrid';
    searchLimit: number;
    similarityThreshold: number;
}