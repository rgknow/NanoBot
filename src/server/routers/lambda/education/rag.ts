import { z } from 'zod';
import { desc, eq, and, like, inArray, sql } from 'drizzle-orm';

import { authedProcedure, router } from '@/libs/trpc/lambda';
import { serverDatabase } from '@/libs/trpc/lambda/middleware';
import {
    educationalKnowledgeBase,
    educationalChunks,
    educationalEmbeddings,
    aiTutorSessions,
    aiTutorInteractions,
    contentValidation,
    NewEducationalKnowledgeBase,
    NewEducationalChunk,
    NewEducationalEmbedding,
    NewAiTutorSession,
    NewAiTutorInteraction,
    NewContentValidation
} from '@/database/schemas/educationalRag';

// Educational RAG procedures
const educationalRAGProcedure = authedProcedure.use(serverDatabase);

// Input validation schemas
const createKnowledgeBaseSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    subject: z.string().min(1),
    grade: z.string().min(1),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).default('beginner'),
    contentType: z.string().default('text'),
    tags: z.array(z.string()).optional(),
    isPublic: z.boolean().default(false),
});

const semanticSearchSchema = z.object({
    query: z.string().min(1),
    courseId: z.string().optional(),
    lessonId: z.string().optional(),
    subject: z.string().optional(),
    grade: z.string().optional(),
    difficulty: z.string().optional(),
    concepts: z.array(z.string()).optional(),
    knowledgeBaseIds: z.array(z.string()).optional(),
    limit: z.number().min(1).max(50).default(10),
});

const tutorQuerySchema = z.object({
    query: z.string().min(1),
    sessionId: z.string().optional(),
    courseId: z.string().optional(),
    lessonId: z.string().optional(),
    difficulty: z.string().optional(),
    tutorPersonality: z.string().default('encouraging'),
    context: z.string().optional(),
});

const contentValidationSchema = z.object({
    chunkId: z.string(),
    validationType: z.enum(['accuracy', 'relevance', 'appropriateness']),
    accuracyScore: z.number().min(0).max(100).optional(),
    relevanceScore: z.number().min(0).max(100).optional(),
    clarityScore: z.number().min(0).max(100).optional(),
    appropriatenessScore: z.number().min(0).max(100).optional(),
    feedback: z.string().optional(),
    suggestions: z.string().optional(),
    flaggedIssues: z.array(z.string()).optional(),
});

export const educationalRAGRouter = router({
    // Knowledge Base Management
    createKnowledgeBase: educationalRAGProcedure
        .input(createKnowledgeBaseSchema)
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            const newKB: NewEducationalKnowledgeBase = {
                id: `edu_kb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                createdBy: userId,
                embeddingModel: 'text-embedding-ada-002', // Default model
                ...input,
            };

            const [createdKB] = await serverDB
                .insert(educationalKnowledgeBase)
                .values(newKB)
                .returning();

            return createdKB;
        }),

    updateKnowledgeBase: educationalRAGProcedure
        .input(z.object({
            id: z.string(),
            name: z.string().optional(),
            description: z.string().optional(),
            subject: z.string().optional(),
            grade: z.string().optional(),
            difficulty: z.string().optional(),
            tags: z.array(z.string()).optional(),
            isPublic: z.boolean().optional(),
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

    getKnowledgeBases: educationalRAGProcedure
        .input(z.object({
            subject: z.string().optional(),
            grade: z.string().optional(),
            difficulty: z.string().optional(),
            isPublic: z.boolean().optional(),
            limit: z.number().min(1).max(100).default(20),
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
            content: z.string().min(1),
            courseId: z.string().optional(),
            lessonId: z.string().optional(),
            knowledgeBaseId: z.string(),
            learningObjectives: z.array(z.string()).optional(),
            concepts: z.array(z.string()).optional(),
            prerequisites: z.array(z.string()).optional(),
            difficulty: z.string().optional(),
            contentType: z.string().default('text'),
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
                id: `edu_chunk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                text: input.content,
                knowledgeBaseId: input.knowledgeBaseId,
                courseId: input.courseId,
                lessonId: input.lessonId,
                learningObjectives: input.learningObjectives,
                concepts: input.concepts,
                prerequisites: input.prerequisites,
                difficulty: input.difficulty || 'beginner',
                type: input.contentType,
                userId,
            };

            const [createdChunk] = await serverDB
                .insert(educationalChunks)
                .values(newChunk)
                .returning();

            return createdChunk;
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
            lessonId: z.string().optional(),
            knowledgeBaseId: z.string().optional(),
            tutorPersonality: z.string().default('encouraging'),
            sessionType: z.string().default('study'),
            topic: z.string().optional(),
            difficulty: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            const newSession: NewAiTutorSession = {
                id: `tutor_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                studentId: userId,
                courseId: input.courseId,
                lessonId: input.lessonId,
                knowledgeBaseId: input.knowledgeBaseId,
                tutorPersonality: input.tutorPersonality,
                sessionType: input.sessionType,
                topic: input.topic,
                difficulty: input.difficulty,
                languageModel: 'gpt-4', // Default model
                embeddingModel: 'text-embedding-ada-002',
            };

            const [createdSession] = await serverDB
                .insert(aiTutorSessions)
                .values(newSession)
                .returning();

            return createdSession;
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
                id: `tutor_interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                sessionId: input.sessionId || '',
                userQuery: input.query,
                aiResponse: `I understand you're asking about "${input.query}". Let me help you with that...`,
                rewrittenQuery: input.query,
                retrievedChunks: [],
                contextUsed: input.context || '',
                retrievalModel: 'text-embedding-ada-002',
                interactionType: 'question',
                difficulty: input.difficulty || 'beginner',
                responseTime: 1500,
                similarityScore: 0.85,
            };

            if (input.sessionId) {
                const [createdInteraction] = await serverDB
                    .insert(aiTutorInteractions)
                    .values(mockInteraction)
                    .returning();

                return {
                    interaction: createdInteraction,
                    response: mockInteraction.aiResponse,
                    context: mockInteraction.contextUsed,
                };
            }

            return {
                response: mockInteraction.aiResponse,
                context: mockInteraction.contextUsed,
            };
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
                id: `content_validation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                chunkId: input.chunkId,
                validatorId: userId,
                validationType: input.validationType,
                accuracyScore: input.accuracyScore,
                relevanceScore: input.relevanceScore,
                clarityScore: input.clarityScore,
                appropriatenessScore: input.appropriatenessScore,
                overallScore,
                feedback: input.feedback,
                suggestions: input.suggestions,
                flaggedIssues: input.flaggedIssues,
                status: overallScore && overallScore >= 80 ? 'approved' : 'needs_revision',
            };

            const [createdValidation] = await serverDB
                .insert(contentValidation)
                .values(newValidation)
                .returning();

            return createdValidation;
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
                knowledgeBase: kb,
                totalChunks: chunks.length,
                validatedChunks: validations.length,
                averageQualityScore: validations.length > 0
                    ? validations.reduce((sum, v) => sum + (v.content_validation.overallScore || 0), 0) / validations.length
                    : 0,
                conceptsCovered: [...new Set(chunks.flatMap(c => c.concepts || []))],
                lastUpdated: kb.updatedAt,
            };
        }),
});