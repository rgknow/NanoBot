import { z } from 'zod';
import { desc, eq, and, like, inArray, sql } from 'drizzle-orm';

import { authedProcedure, router } from '@/libs/trpc/lambda';
import { serverDatabase } from '@/libs/trpc/lambda/middleware';
import {
    educationalKnowledgeBase,
    educationalChunks,
    aiTutorSessions,
    aiTutorInteractions,
    contentValidation,
    NewEducationalKnowledgeBase,
    NewEducationalChunk,
    NewAiTutorSession,
    NewAiTutorInteraction,
    NewContentValidation
} from '@/database/schemas/educationalRag';

// Educational RAG procedures
const educationalRAGProcedure = authedProcedure.use(serverDatabase);

// Input validation schemas
const createKnowledgeBaseSchema = z.object({
    contentType: z.string().default('text'),
    description: z.string().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).default('beginner'),
    grade: z.string().min(1),
    isPublic: z.boolean().default(false),
    name: z.string().min(1).max(255),
    subject: z.string().min(1),
    tags: z.array(z.string()).optional(),
});

const semanticSearchSchema = z.object({
    concepts: z.array(z.string()).optional(),
    courseId: z.string().optional(),
    difficulty: z.string().optional(),
    grade: z.string().optional(),
    knowledgeBaseIds: z.array(z.string()).optional(),
    lessonId: z.string().optional(),
    limit: z.number().min(1).max(50).default(10),
    query: z.string().min(1),
    subject: z.string().optional(),
});

const tutorQuerySchema = z.object({
    context: z.string().optional(),
    courseId: z.string().optional(),
    difficulty: z.string().optional(),
    lessonId: z.string().optional(),
    query: z.string().min(1),
    sessionId: z.string().optional(),
    tutorPersonality: z.string().default('encouraging'),
});

const contentValidationSchema = z.object({
    accuracyScore: z.number().min(0).max(100).optional(),
    appropriatenessScore: z.number().min(0).max(100).optional(),
    chunkId: z.string(),
    clarityScore: z.number().min(0).max(100).optional(),
    feedback: z.string().optional(),
    flaggedIssues: z.array(z.string()).optional(),
    relevanceScore: z.number().min(0).max(100).optional(),
    suggestions: z.string().optional(),
    validationType: z.enum(['accuracy', 'relevance', 'appropriateness']),
});

export const educationalRAGRouter = router({
    // Knowledge Base Management
    createKnowledgeBase: educationalRAGProcedure
        .input(createKnowledgeBaseSchema)
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            const newKB: NewEducationalKnowledgeBase = {
                createdBy: userId,
                embeddingModel: 'text-embedding-ada-002',
                id: `edu_kb_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`, // Default model
                ...input,
            };

            const [createdKB] = await serverDB
                .insert(educationalKnowledgeBase)
                .values(newKB)
                .returning();

            return createdKB;
        }),

    deleteKnowledgeBase: educationalRAGProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            // Check ownership
            const [kb] = await serverDB
                .select()
                .from(educationalKnowledgeBase)
                .where(eq(educationalKnowledgeBase.id, input.id));

            if (!kb || kb.createdBy !== userId) {
                throw new Error('Knowledge base not found or unauthorized');
            }

            await serverDB
                .delete(educationalKnowledgeBase)
                .where(eq(educationalKnowledgeBase.id, input.id));

            return { success: true };
        }),

    // Analytics
getKnowledgeBaseStats: educationalRAGProcedure
        .input(z.object({ knowledgeBaseId: z.string() }))
        .query(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            // Verify access to knowledge base
            const [kb] = await serverDB
                .select()
                .from(educationalKnowledgeBase)
                .where(eq(educationalKnowledgeBase.id, input.knowledgeBaseId));

            if (!kb || (kb.createdBy !== userId && !kb.isPublic)) {
                throw new Error('Knowledge base not found or unauthorized');
            }

            // Get chunk count
            const chunks = await serverDB
                .select()
                .from(educationalChunks)
                .where(eq(educationalChunks.knowledgeBaseId, input.knowledgeBaseId));

            // Get validation stats
            const validations = await serverDB
                .select()
                .from(contentValidation)
                .innerJoin(educationalChunks, eq(contentValidation.chunkId, educationalChunks.id))
                .where(eq(educationalChunks.knowledgeBaseId, input.knowledgeBaseId));

            return {
                averageQualityScore: validations.length > 0
                    ? validations.reduce((sum, v) => sum + (v.content_validation.overallScore || 0), 0) / validations.length
                    : 0,
                knowledgeBase: kb,
                conceptsCovered: [...new Set(chunks.flatMap(c => c.concepts || []))],
                totalChunks: chunks.length,
                lastUpdated: kb.updatedAt,
                validatedChunks: validations.length,
            };
        }),

    

getKnowledgeBases: educationalRAGProcedure
        .input(z.object({
            difficulty: z.string().optional(),
            grade: z.string().optional(),
            isPublic: z.boolean().optional(),
            limit: z.number().min(1).max(100).default(20),
            subject: z.string().optional(),
        }))
        .query(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            const filters = [];
            if (input.subject) filters.push(eq(educationalKnowledgeBase.subject, input.subject));
            if (input.grade) filters.push(eq(educationalKnowledgeBase.grade, input.grade));
            if (input.difficulty) filters.push(eq(educationalKnowledgeBase.difficulty, input.difficulty));
            if (input.isPublic !== undefined) filters.push(eq(educationalKnowledgeBase.isPublic, input.isPublic));

            // Always include user's own knowledge bases
            filters.push(
                and(
                    eq(educationalKnowledgeBase.createdBy, userId),
                    input.isPublic ? eq(educationalKnowledgeBase.isPublic, true) : undefined
                )
            );

            let query = serverDB.select().from(educationalKnowledgeBase);

            if (filters.length > 0) {
                query = query.where(and(...filters));
            }

            const results = await query
                .orderBy(desc(educationalKnowledgeBase.createdAt))
                .limit(input.limit);

            return results;
        }),

    
    
// Content Processing
processContent: educationalRAGProcedure
        .input(z.object({
            concepts: z.array(z.string()).optional(),
            content: z.string().min(1),
            contentType: z.string().default('text'),
            courseId: z.string().optional(),
            difficulty: z.string().optional(),
            knowledgeBaseId: z.string(),
            learningObjectives: z.array(z.string()).optional(),
            lessonId: z.string().optional(),
            prerequisites: z.array(z.string()).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            // Verify knowledge base ownership
            const [kb] = await serverDB
                .select()
                .from(educationalKnowledgeBase)
                .where(eq(educationalKnowledgeBase.id, input.knowledgeBaseId));

            if (!kb || kb.createdBy !== userId) {
                throw new Error('Knowledge base not found or unauthorized');
            }

            // Create educational chunk
            const newChunk: NewEducationalChunk = {
                concepts: input.concepts,
                courseId: input.courseId,
                difficulty: input.difficulty || 'beginner',
                id: `edu_chunk_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
                knowledgeBaseId: input.knowledgeBaseId,
                learningObjectives: input.learningObjectives,
                lessonId: input.lessonId,
                prerequisites: input.prerequisites,
                text: input.content,
                type: input.contentType,
                userId,
            };

            const [createdChunk] = await serverDB
                .insert(educationalChunks)
                .values(newChunk)
                .returning();

            return createdChunk;
        }),

    
    
queryAiTutor: educationalRAGProcedure
        .input(tutorQuerySchema)
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            // This would implement the full RAG pipeline:
            // 1. Rewrite query for better retrieval
            // 2. Search educational embeddings
            // 3. Generate contextual response
            // 4. Store interaction for analytics

            // For now, return a mock response
            const mockInteraction: NewAiTutorInteraction = {
                aiResponse: `I understand you're asking about "${input.query}". Let me help you with that...`,
                contextUsed: input.context || '',
                id: `tutor_interaction_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
                interactionType: 'question',
                retrievedChunks: [],
                difficulty: input.difficulty || 'beginner',
                sessionId: input.sessionId || '',
                responseTime: 1500,
                userQuery: input.query,
                retrievalModel: 'text-embedding-ada-002',
                rewrittenQuery: input.query,
                similarityScore: 0.85,
            };

            if (input.sessionId) {
                const [createdInteraction] = await serverDB
                    .insert(aiTutorInteractions)
                    .values(mockInteraction)
                    .returning();

                return {
                    context: mockInteraction.contextUsed,
                    interaction: createdInteraction,
                    response: mockInteraction.aiResponse,
                };
            }

            return {
                context: mockInteraction.contextUsed,
                response: mockInteraction.aiResponse,
            };
        }),

    
    

// Semantic Search
semanticSearch: educationalRAGProcedure
        .input(semanticSearchSchema)
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            // This is a simplified implementation
            // In a real implementation, you would:
            // 1. Generate embedding for the query
            // 2. Perform vector similarity search
            // 3. Apply educational filters
            // 4. Return ranked results

            const filters = [];
            if (input.courseId) filters.push(eq(educationalChunks.courseId, input.courseId));
            if (input.lessonId) filters.push(eq(educationalChunks.lessonId, input.lessonId));
            if (input.difficulty) filters.push(eq(educationalChunks.difficulty, input.difficulty));
            if (input.knowledgeBaseIds) {
                filters.push(inArray(educationalChunks.knowledgeBaseId, input.knowledgeBaseIds));
            }

            // Text-based search as fallback
            filters.push(like(educationalChunks.text, `%${input.query}%`));

            let query = serverDB
                .select({
                    chunk: educationalChunks,
                    similarity: sql<number>`0.8`.as('similarity'), // Mock similarity score
                })
                .from(educationalChunks);

            if (filters.length > 0) {
                query = query.where(and(...filters));
            }

            const results = await query
                .limit(input.limit)
                .orderBy(desc(educationalChunks.createdAt));

            return results;
        }),

    


// AI Tutor Session Management
startTutorSession: educationalRAGProcedure
        .input(z.object({
            courseId: z.string().optional(),
            difficulty: z.string().optional(),
            knowledgeBaseId: z.string().optional(),
            lessonId: z.string().optional(),
            sessionType: z.string().default('study'),
            topic: z.string().optional(),
            tutorPersonality: z.string().default('encouraging'),
        }))
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            const newSession: NewAiTutorSession = {
                courseId: input.courseId,
                difficulty: input.difficulty,
                id: `tutor_session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
                // Default model
embeddingModel: 'text-embedding-ada-002',
                
knowledgeBaseId: input.knowledgeBaseId,
                
languageModel: 'gpt-4',
                
lessonId: input.lessonId,
                
sessionType: input.sessionType,
                
studentId: userId,
                
topic: input.topic, 
                tutorPersonality: input.tutorPersonality,
            };

            const [createdSession] = await serverDB
                .insert(aiTutorSessions)
                .values(newSession)
                .returning();

            return createdSession;
        }),

    
    

updateKnowledgeBase: educationalRAGProcedure
        .input(z.object({
            description: z.string().optional(),
            grade: z.string().optional(),
            id: z.string(),
            difficulty: z.string().optional(),
            name: z.string().optional(),
            isPublic: z.boolean().optional(),
            subject: z.string().optional(),
            tags: z.array(z.string()).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;
            const { id, ...updateData } = input;

            // Check ownership
            const [kb] = await serverDB
                .select()
                .from(educationalKnowledgeBase)
                .where(eq(educationalKnowledgeBase.id, id));

            if (!kb || kb.createdBy !== userId) {
                throw new Error('Knowledge base not found or unauthorized');
            }

            const [updatedKB] = await serverDB
                .update(educationalKnowledgeBase)
                .set({ ...updateData, updatedAt: new Date() })
                .where(eq(educationalKnowledgeBase.id, id))
                .returning();

            return updatedKB;
        }),

    
    // Content Validation
validateContent: educationalRAGProcedure
        .input(contentValidationSchema)
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            // Calculate overall score
            const scores = [
                input.accuracyScore,
                input.relevanceScore,
                input.clarityScore,
                input.appropriatenessScore,
            ].filter(Boolean);

            const overallScore = scores.length > 0
                ? Math.round(scores.reduce((sum, score) => sum + score!, 0) / scores.length)
                : undefined;

            const newValidation: NewContentValidation = {
                accuracyScore: input.accuracyScore,
                appropriatenessScore: input.appropriatenessScore,
                chunkId: input.chunkId,
                clarityScore: input.clarityScore,
                feedback: input.feedback,
                flaggedIssues: input.flaggedIssues,
                id: `content_validation_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
                overallScore,
                relevanceScore: input.relevanceScore,
                validationType: input.validationType,
                status: overallScore && overallScore >= 80 ? 'approved' : 'needs_revision',
                validatorId: userId,
                suggestions: input.suggestions,
            };

            const [createdValidation] = await serverDB
                .insert(contentValidation)
                .values(newValidation)
                .returning();

            return createdValidation;
        }),
});