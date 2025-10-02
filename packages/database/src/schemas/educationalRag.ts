/* eslint-disable sort-keys-fix/sort-keys-fix  */
import {
    boolean,
    index,
    integer,
    jsonb,
    pgTable,
    real,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
    vector,
} from 'drizzle-orm/pg-core';

import { timestamps } from './_helpers';
import { courses, lessons } from './education';
import { chunks, embeddings } from './rag';
import { users } from './user';

// Educational content knowledge base for RAG
export const educationalKnowledgeBase = pgTable(
    'educational_knowledge_base',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        name: varchar('name', { length: 255 }).notNull(),
        description: text('description'),

        // Subject categorization
        subject: varchar('subject', { length: 50 }).notNull(),
        grade: varchar('grade', { length: 5 }).notNull(),
        difficulty: varchar('difficulty', { length: 20 }).notNull().default('beginner'),

        // Content metadata
        contentType: varchar('content_type', { length: 50 }).default('text'), // text, pdf, video, interactive
        tags: text('tags').array(),
        language: varchar('language', { length: 10 }).default('en'),

        // RAG configuration
        embeddingModel: varchar('embedding_model', { length: 100 }),
        chunkSize: integer('chunk_size').default(1000),
        chunkOverlap: integer('chunk_overlap').default(200),

        // Ownership and access
        createdBy: text('created_by').references(() => users.id, { onDelete: 'cascade' }),
        isPublic: boolean('is_public').default(false),

        // Quality metrics
        qualityScore: integer('quality_score'), // 0-100
        lastValidated: timestamp('last_validated'),

        ...timestamps,
    },
    (t) => [
        index('educational_kb_subject_idx').on(t.subject),
        index('educational_kb_grade_idx').on(t.grade),
        index('educational_kb_created_by_idx').on(t.createdBy),
    ],
);

export type NewEducationalKnowledgeBase = typeof educationalKnowledgeBase.$inferInsert;
export type EducationalKnowledgeBase = typeof educationalKnowledgeBase.$inferSelect;

// Educational content chunks with curriculum alignment
export const educationalChunks = pgTable(
    'educational_chunks',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        text: text('text').notNull(),
        abstract: text('abstract'),
        metadata: jsonb('metadata'),

        // Curriculum alignment
        learningObjectives: text('learning_objectives').array(),
        concepts: text('concepts').array(),
        prerequisites: text('prerequisites').array(),
        difficulty: varchar('difficulty', { length: 20 }).default('beginner'),

        // Educational context
        courseId: varchar('course_id').references(() => courses.id, { onDelete: 'cascade' }),
        lessonId: varchar('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),
        knowledgeBaseId: uuid('knowledge_base_id').references(() => educationalKnowledgeBase.id, { onDelete: 'cascade' }),

        // Original chunk reference
        parentChunkId: uuid('parent_chunk_id').references(() => chunks.id, { onDelete: 'cascade' }),

        // Chunk positioning
        index: integer('index').default(0),
        type: varchar('type', { length: 50 }).default('content'),

        // Quality and validation
        isValidated: boolean('is_validated').default(false),
        validatedBy: text('validated_by').references(() => users.id),
        validatedAt: timestamp('validated_at'),

        // Access control
        clientId: text('client_id'),
        userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),

        ...timestamps,
    },
    (t) => [
        index('educational_chunks_course_idx').on(t.courseId),
        index('educational_chunks_lesson_idx').on(t.lessonId),
        index('educational_chunks_kb_idx').on(t.knowledgeBaseId),
        index('educational_chunks_user_idx').on(t.userId),
    ],
);

export type NewEducationalChunk = typeof educationalChunks.$inferInsert;
export type EducationalChunk = typeof educationalChunks.$inferSelect;

// Educational embeddings with enhanced metadata
export const educationalEmbeddings = pgTable(
    'educational_embeddings',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        chunkId: uuid('chunk_id')
            .references(() => educationalChunks.id, { onDelete: 'cascade' })
            .unique(),
        embeddings: vector('embeddings', { dimensions: 1024 }),
        model: text('model').notNull(),

        // Educational metadata for retrieval
        subject: varchar('subject', { length: 50 }),
        grade: varchar('grade', { length: 5 }),
        difficulty: varchar('difficulty', { length: 20 }),
        concepts: text('concepts').array(),

        // Performance metrics
        retrievalScore: real('retrieval_score'), // Average relevance score
        usageCount: integer('usage_count').default(0),
        lastUsed: timestamp('last_used'),

        // Access control
        clientId: text('client_id'),
        userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),

        ...timestamps,
    },
    (t) => [
        uniqueIndex('educational_embeddings_chunk_unique').on(t.chunkId),
        index('educational_embeddings_subject_idx').on(t.subject),
        index('educational_embeddings_grade_idx').on(t.grade),
        index('educational_embeddings_user_idx').on(t.userId),
    ],
);

export type NewEducationalEmbedding = typeof educationalEmbeddings.$inferInsert;
export type EducationalEmbedding = typeof educationalEmbeddings.$inferSelect;

// AI Tutor sessions and interactions
export const aiTutorSessions = pgTable(
    'ai_tutor_sessions',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        studentId: text('student_id').references(() => users.id, { onDelete: 'cascade' }),

        // Session context
        courseId: varchar('course_id').references(() => courses.id, { onDelete: 'cascade' }),
        lessonId: varchar('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),
        knowledgeBaseId: uuid('knowledge_base_id').references(() => educationalKnowledgeBase.id),

        // AI configuration
        tutorPersonality: varchar('tutor_personality', { length: 50 }).default('encouraging'),
        languageModel: varchar('language_model', { length: 100 }),
        embeddingModel: varchar('embedding_model', { length: 100 }),

        // Session metadata
        sessionType: varchar('session_type', { length: 50 }).default('study'), // study, practice, assessment, help
        topic: varchar('topic', { length: 255 }),
        difficulty: varchar('difficulty', { length: 20 }),

        // Session state
        status: varchar('status', { length: 20 }).default('active'), // active, completed, abandoned
        startedAt: timestamp('started_at').defaultNow(),
        endedAt: timestamp('ended_at'),
        duration: integer('duration'), // in minutes

        // Performance metrics
        totalInteractions: integer('total_interactions').default(0),
        retrievalQueries: integer('retrieval_queries').default(0),
        helpfulVotes: integer('helpful_votes').default(0),
        unhelpfulVotes: integer('unhelpful_votes').default(0),

        ...timestamps,
    },
    (t) => [
        index('ai_tutor_sessions_student_idx').on(t.studentId),
        index('ai_tutor_sessions_course_idx').on(t.courseId),
        index('ai_tutor_sessions_status_idx').on(t.status),
    ],
);

export type NewAiTutorSession = typeof aiTutorSessions.$inferInsert;
export type AiTutorSession = typeof aiTutorSessions.$inferSelect;

// AI Tutor interactions with RAG context
export const aiTutorInteractions = pgTable(
    'ai_tutor_interactions',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        sessionId: uuid('session_id').references(() => aiTutorSessions.id, { onDelete: 'cascade' }),

        // Interaction content
        userQuery: text('user_query').notNull(),
        aiResponse: text('ai_response'),
        rewrittenQuery: text('rewritten_query'), // Query optimization for RAG

        // RAG context
        retrievedChunks: jsonb('retrieved_chunks'), // Array of chunk IDs and similarity scores
        contextUsed: text('context_used'), // The actual context provided to AI
        retrievalModel: varchar('retrieval_model', { length: 100 }),

        // Interaction metadata
        interactionType: varchar('interaction_type', { length: 50 }).default('question'), // question, explanation, practice, assessment
        difficulty: varchar('difficulty', { length: 20 }),
        concepts: text('concepts').array(),

        // Performance metrics
        responseTime: integer('response_time'), // in milliseconds
        similarityScore: real('similarity_score'), // Average similarity of retrieved chunks
        userFeedback: varchar('user_feedback', { length: 20 }), // helpful, unhelpful, neutral

        // Learning analytics
        isCorrectAnswer: boolean('is_correct_answer'),
        comprehensionLevel: varchar('comprehension_level', { length: 20 }), // low, medium, high

        ...timestamps,
    },
    (t) => [
        index('ai_tutor_interactions_session_idx').on(t.sessionId),
        index('ai_tutor_interactions_type_idx').on(t.interactionType),
    ],
);

export type NewAiTutorInteraction = typeof aiTutorInteractions.$inferInsert;
export type AiTutorInteraction = typeof aiTutorInteractions.$inferSelect;

// Curriculum content validation and quality assurance
export const contentValidation = pgTable(
    'content_validation',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        chunkId: uuid('chunk_id').references(() => educationalChunks.id, { onDelete: 'cascade' }),

        // Validation metadata
        validatorId: text('validator_id').references(() => users.id, { onDelete: 'cascade' }),
        validationType: varchar('validation_type', { length: 50 }).notNull(), // accuracy, relevance, appropriateness
        status: varchar('status', { length: 20 }).default('pending'), // pending, approved, rejected, needs_revision

        // Quality scores (0-100)
        accuracyScore: integer('accuracy_score'),
        relevanceScore: integer('relevance_score'),
        clarityScore: integer('clarity_score'),
        appropriatenessScore: integer('appropriateness_score'),
        overallScore: integer('overall_score'),

        // Feedback and notes
        feedback: text('feedback'),
        suggestions: text('suggestions'),
        flaggedIssues: text('flagged_issues').array(),

        // Validation metadata
        validatedAt: timestamp('validated_at').defaultNow(),
        reviewRequired: boolean('review_required').default(false),

        ...timestamps,
    },
    (t) => [
        index('content_validation_chunk_idx').on(t.chunkId),
        index('content_validation_validator_idx').on(t.validatorId),
        index('content_validation_status_idx').on(t.status),
    ],
);

export type NewContentValidation = typeof contentValidation.$inferInsert;
export type ContentValidation = typeof contentValidation.$inferSelect;