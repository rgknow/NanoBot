/* eslint-disable sort-keys-fix/sort-keys-fix  */
import {
    boolean,
    index,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    primaryKey,
    text,
    varchar,
} from 'drizzle-orm/pg-core';

import { timestamps } from './_helpers';
import { users } from './user';
import { courses, lessons } from './education';

// Enums for assessment system
export const assessmentTypeEnum = pgEnum('assessment_type', ['diagnostic', 'formative', 'summative', 'peer_review', 'self_assessment']);
export const questionTypeEnum = pgEnum('question_type', ['multiple_choice', 'short_answer', 'essay', 'coding', 'project', 'multimedia']);
export const rubricScaleEnum = pgEnum('rubric_scale', ['binary', 'three_point', 'four_point', 'five_point', 'ten_point']);
export const submissionStatusEnum = pgEnum('submission_status', ['draft', 'submitted', 'grading', 'graded', 'returned']);
export const feedbackTypeEnum = pgEnum('feedback_type', ['ai_generated', 'instructor', 'peer', 'self_reflection']);

// Assessments - evaluation instruments
export const assessments = pgTable('education_assessments', {
    id: text('id').primaryKey().notNull(),
    courseId: text('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
    lessonId: text('lesson_id').references(() => lessons.id), // Optional: lesson-specific assessment
    createdBy: text('created_by').references(() => users.id).notNull(),

    // Basic information
    title: text('title').notNull(),
    description: text('description'),
    instructions: text('instructions'),

    // Assessment configuration
    type: assessmentTypeEnum('type').notNull(),
    totalPoints: integer('total_points').default(100),
    passingScore: integer('passing_score').default(70),
    timeLimit: integer('time_limit_minutes'), // null = no time limit

    // Attempt settings
    maxAttempts: integer('max_attempts').default(1),
    allowRetake: boolean('allow_retake').default(false),
    showResults: boolean('show_results').default(true),
    showCorrectAnswers: boolean('show_correct_answers').default(false),

    // AI and adaptive features
    isAdaptive: boolean('is_adaptive').default(false),
    aiPrompts: jsonb('ai_prompts').default([]), // Prompts for AI assessment
    adaptiveRules: jsonb('adaptive_rules').default({}), // Rules for adaptive questioning

    // Scheduling
    availableFrom: text('available_from'),
    availableUntil: text('available_until'),

    // Settings
    isPublished: boolean('is_published').default(false),
    requireProctor: boolean('require_proctor').default(false),
    shuffleQuestions: boolean('shuffle_questions').default(false),

    // Metadata
    metadata: jsonb('metadata').default({}),

    ...timestamps,
}, (t) => ({
    courseIdx: index('education_assessments_course_idx').on(t.courseId),
    lessonIdx: index('education_assessments_lesson_idx').on(t.lessonId),
    creatorIdx: index('education_assessments_creator_idx').on(t.createdBy),
    typeIdx: index('education_assessments_type_idx').on(t.type),
    publishedIdx: index('education_assessments_published_idx').on(t.isPublished),
}));

export type NewAssessment = typeof assessments.$inferInsert;
export type AssessmentItem = typeof assessments.$inferSelect;

// Assessment questions
export const assessmentQuestions = pgTable('education_assessment_questions', {
    id: text('id').primaryKey().notNull(),
    assessmentId: text('assessment_id').references(() => assessments.id, { onDelete: 'cascade' }).notNull(),

    // Question content
    question: text('question').notNull(),
    questionType: questionTypeEnum('question_type').notNull(),
    points: integer('points').default(1),
    order: integer('order').notNull().default(0),

    // Multiple choice options
    options: jsonb('options').$type<{ id: string; text: string; isCorrect: boolean }[]>().default([]),

    // Correct answers and explanations
    correctAnswer: text('correct_answer'), // For short answer, coding questions
    explanation: text('explanation'),
    hints: jsonb('hints').$type<string[]>().default([]),

    // Media attachments
    imageUrl: text('image_url'),
    videoUrl: text('video_url'),
    attachments: jsonb('attachments').default([]),

    // AI and grading
    aiGradingCriteria: jsonb('ai_grading_criteria').default({}),
    rubricId: text('rubric_id'), // Reference added in relations

    // Difficulty and analytics
    difficulty: integer('difficulty').default(1), // 1-5 scale
    bloomsTaxonomy: varchar('blooms_taxonomy', { length: 20 }), // remember, understand, apply, analyze, evaluate, create

    // Adaptive features
    prerequisites: jsonb('prerequisites').$type<string[]>().default([]),
    tags: jsonb('tags').$type<string[]>().default([]),

    ...timestamps,
}, (t) => ({
    assessmentIdx: index('education_assessment_questions_assessment_idx').on(t.assessmentId),
    orderIdx: index('education_assessment_questions_order_idx').on(t.assessmentId, t.order),
    typeIdx: index('education_assessment_questions_type_idx').on(t.questionType),
    rubricIdx: index('education_assessment_questions_rubric_idx').on(t.rubricId),
}));

export type NewAssessmentQuestion = typeof assessmentQuestions.$inferInsert;
export type AssessmentQuestionItem = typeof assessmentQuestions.$inferSelect;

// Rubrics for detailed assessment criteria
export const rubrics = pgTable('education_rubrics', {
    id: text('id').primaryKey().notNull(),
    createdBy: text('created_by').references(() => users.id).notNull(),

    // Rubric details
    title: text('title').notNull(),
    description: text('description'),
    scale: rubricScaleEnum('scale').notNull(),
    totalPoints: integer('total_points').default(100),

    // Rubric criteria
    criteria: jsonb('criteria').notNull(), // Array of criterion objects with descriptors

    // AI integration
    aiEnabled: boolean('ai_enabled').default(false),
    aiPrompt: text('ai_prompt'), // Prompt for AI-assisted grading

    // Usage settings
    isPublic: boolean('is_public').default(false),
    isTemplate: boolean('is_template').default(false),

    ...timestamps,
}, (t) => ({
    creatorIdx: index('education_rubrics_creator_idx').on(t.createdBy),
    scaleIdx: index('education_rubrics_scale_idx').on(t.scale),
    publicIdx: index('education_rubrics_public_idx').on(t.isPublic),
}));

export type NewRubric = typeof rubrics.$inferInsert;
export type RubricItem = typeof rubrics.$inferSelect;

// Student assessment submissions
export const assessmentSubmissions = pgTable('education_assessment_submissions', {
    id: text('id').primaryKey().notNull(),
    assessmentId: text('assessment_id').references(() => assessments.id, { onDelete: 'cascade' }).notNull(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

    // Submission details
    attemptNumber: integer('attempt_number').default(1),
    status: submissionStatusEnum('status').default('draft'),

    // Responses
    responses: jsonb('responses').notNull(), // Question ID -> answer mapping

    // Timing
    startedAt: text('started_at').notNull(),
    submittedAt: text('submitted_at'),
    timeSpentMinutes: integer('time_spent_minutes').default(0),

    // Scoring
    autoScore: integer('auto_score'), // AI/automatic scoring
    manualScore: integer('manual_score'), // Instructor scoring
    finalScore: integer('final_score'),
    percentage: integer('percentage'), // Final percentage score

    // Grading details
    gradedBy: text('graded_by').references(() => users.id),
    gradedAt: text('graded_at'),

    // AI analysis
    aiAnalysis: jsonb('ai_analysis').default({}), // AI insights about performance
    skillsAssessed: jsonb('skills_assessed').default([]), // Skills demonstrated
    areasForImprovement: jsonb('areas_for_improvement').default([]),

    // Metadata
    metadata: jsonb('metadata').default({}),

    ...timestamps,
}, (t) => ({
    assessmentIdx: index('education_assessment_submissions_assessment_idx').on(t.assessmentId),
    userIdx: index('education_assessment_submissions_user_idx').on(t.userId),
    statusIdx: index('education_assessment_submissions_status_idx').on(t.status),
    graderIdx: index('education_assessment_submissions_grader_idx').on(t.gradedBy),
    uniqueIdx: index('education_assessment_submissions_unique_idx').on(t.userId, t.assessmentId, t.attemptNumber),
}));

export type NewAssessmentSubmission = typeof assessmentSubmissions.$inferInsert;
export type AssessmentSubmissionItem = typeof assessmentSubmissions.$inferSelect;

// Feedback on submissions (AI, instructor, peer)
export const assessmentFeedback = pgTable('education_assessment_feedback', {
    id: text('id').primaryKey().notNull(),
    submissionId: text('submission_id').references(() => assessmentSubmissions.id, { onDelete: 'cascade' }).notNull(),
    questionId: text('question_id').references(() => assessmentQuestions.id), // Optional: question-specific feedback

    // Feedback details
    type: feedbackTypeEnum('type').notNull(),
    providedBy: text('provided_by').references(() => users.id), // null for AI feedback

    // Content
    feedback: text('feedback').notNull(),
    score: integer('score'), // Points awarded for this question/overall
    suggestions: jsonb('suggestions').$type<string[]>().default([]),

    // Rubric scoring
    rubricScores: jsonb('rubric_scores').default({}), // Criterion ID -> score mapping

    // AI confidence and metadata
    aiConfidence: integer('ai_confidence'), // 0-100 for AI feedback
    metadata: jsonb('metadata').default({}),

    ...timestamps,
}, (t) => ({
    submissionIdx: index('education_assessment_feedback_submission_idx').on(t.submissionId),
    questionIdx: index('education_assessment_feedback_question_idx').on(t.questionId),
    typeIdx: index('education_assessment_feedback_type_idx').on(t.type),
    providerIdx: index('education_assessment_feedback_provider_idx').on(t.providedBy),
}));

export type NewAssessmentFeedback = typeof assessmentFeedback.$inferInsert;
export type AssessmentFeedbackItem = typeof assessmentFeedback.$inferSelect;

// Peer review assignments
export const peerReviews = pgTable('education_peer_reviews', {
    id: text('id').primaryKey().notNull(),
    assessmentId: text('assessment_id').references(() => assessments.id, { onDelete: 'cascade' }).notNull(),
    reviewerId: text('reviewer_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    revieweeId: text('reviewee_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    submissionId: text('submission_id').references(() => assessmentSubmissions.id, { onDelete: 'cascade' }).notNull(),

    // Review assignment
    assignedAt: text('assigned_at').notNull(),
    dueAt: text('due_at'),

    // Review content
    review: text('review'),
    scores: jsonb('scores').default({}), // Criterion -> score mapping
    isAnonymous: boolean('is_anonymous').default(true),

    // Status
    isCompleted: boolean('is_completed').default(false),
    completedAt: text('completed_at'),

    // Quality control
    qualityScore: integer('quality_score'), // Quality of the peer review itself
    isHelpful: boolean('is_helpful'), // Feedback from reviewee

    ...timestamps,
}, (t) => ({
    assessmentIdx: index('education_peer_reviews_assessment_idx').on(t.assessmentId),
    reviewerIdx: index('education_peer_reviews_reviewer_idx').on(t.reviewerId),
    revieweeIdx: index('education_peer_reviews_reviewee_idx').on(t.revieweeId),
    submissionIdx: index('education_peer_reviews_submission_idx').on(t.submissionId),
    completedIdx: index('education_peer_reviews_completed_idx').on(t.isCompleted),
}));

export type NewPeerReview = typeof peerReviews.$inferInsert;
export type PeerReviewItem = typeof peerReviews.$inferSelect;