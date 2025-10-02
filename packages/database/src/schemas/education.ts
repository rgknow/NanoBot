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

// Enums for educational system
export const difficultyEnum = pgEnum('difficulty', ['beginner', 'intermediate', 'advanced', 'expert']);
export const gradeEnum = pgEnum('grade', ['k', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
export const subjectEnum = pgEnum('subject', [
    'science',
    'technology',
    'engineering',
    'arts',
    'mathematics',
    'robotics',
    'programming',
    'electronics',
    'design',
    'maker'
]);
export const progressStatusEnum = pgEnum('progress_status', ['not_started', 'in_progress', 'completed', 'mastered']);

// Courses table - STEAM curriculum structure
export const courses = pgTable('education_courses', {
    id: text('id').primaryKey().notNull(),
    title: text('title').notNull(),
    description: text('description'),
    shortDescription: text('short_description'),

    // Categorization
    subject: subjectEnum('subject').notNull(),
    grade: gradeEnum('grade').notNull(),
    difficulty: difficultyEnum('difficulty').notNull(),

    // Content metadata
    estimatedHours: integer('estimated_hours').default(0),
    prerequisites: jsonb('prerequisites').$type<string[]>().default([]),
    learningObjectives: jsonb('learning_objectives').$type<string[]>().default([]),
    tags: jsonb('tags').$type<string[]>().default([]),

    // Instructor info
    instructorId: text('instructor_id').references(() => users.id),

    // Course settings
    isPublished: boolean('is_published').default(false),
    isFeatured: boolean('is_featured').default(false),
    allowSelfEnrollment: boolean('allow_self_enrollment').default(true),

    // Media
    thumbnailUrl: text('thumbnail_url'),
    bannerUrl: text('banner_url'),

    // Metadata
    metadata: jsonb('metadata').default({}),

    ...timestamps,
}, (t) => ({
    subjectIdx: index('education_courses_subject_idx').on(t.subject),
    gradeIdx: index('education_courses_grade_idx').on(t.grade),
    instructorIdx: index('education_courses_instructor_idx').on(t.instructorId),
    publishedIdx: index('education_courses_published_idx').on(t.isPublished),
}));

export type NewCourse = typeof courses.$inferInsert;
export type CourseItem = typeof courses.$inferSelect;

// Lessons table - Individual learning units within courses
export const lessons = pgTable('education_lessons', {
    id: text('id').primaryKey().notNull(),
    courseId: text('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),

    title: text('title').notNull(),
    description: text('description'),
    content: text('content'), // Markdown/HTML content

    // Ordering and structure
    order: integer('order').notNull().default(0),
    parentLessonId: text('parent_lesson_id'), // For nested lessons - reference added in relations

    // Learning data
    estimatedMinutes: integer('estimated_minutes').default(0),
    difficulty: difficultyEnum('difficulty').notNull(),
    learningObjectives: jsonb('learning_objectives').$type<string[]>().default([]),

    // Content types and resources
    contentType: varchar('content_type', { length: 50 }).default('text'), // text, video, interactive, project, assessment
    resources: jsonb('resources').default([]), // Links, files, etc.

    // AI and maker integration
    aiPrompts: jsonb('ai_prompts').default([]), // Prompts for AI tutor
    makerComponents: jsonb('maker_components').default([]), // Hardware/software components needed

    // Settings
    isPublished: boolean('is_published').default(false),
    requiresCompletion: boolean('requires_completion').default(true),

    // Metadata
    metadata: jsonb('metadata').default({}),

    ...timestamps,
}, (t) => ({
    courseIdx: index('education_lessons_course_idx').on(t.courseId),
    orderIdx: index('education_lessons_order_idx').on(t.courseId, t.order),
    parentIdx: index('education_lessons_parent_idx').on(t.parentLessonId),
}));

export type NewLesson = typeof lessons.$inferInsert;
export type LessonItem = typeof lessons.$inferSelect;

// User progress tracking
export const userProgress = pgTable('education_user_progress', {
    id: text('id').primaryKey().notNull(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    courseId: text('course_id').references(() => courses.id, { onDelete: 'cascade' }),
    lessonId: text('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),

    // Progress tracking
    status: progressStatusEnum('status').notNull().default('not_started'),
    completionPercentage: integer('completion_percentage').default(0), // 0-100
    timeSpentMinutes: integer('time_spent_minutes').default(0),

    // Performance data
    score: integer('score'), // 0-100 for assessments
    attempts: integer('attempts').default(0),
    lastAttemptScore: integer('last_attempt_score'),
    bestScore: integer('best_score'),

    // AI insights
    aiInsights: jsonb('ai_insights').default({}), // AI-generated learning insights
    strugglingAreas: jsonb('struggling_areas').$type<string[]>().default([]),
    strengths: jsonb('strengths').$type<string[]>().default([]),

    // Dates
    startedAt: text('started_at'),
    completedAt: text('completed_at'),
    lastAccessedAt: text('last_accessed_at'),

    ...timestamps,
}, (t) => ({
    userIdx: index('education_user_progress_user_idx').on(t.userId),
    courseIdx: index('education_user_progress_course_idx').on(t.courseId),
    lessonIdx: index('education_user_progress_lesson_idx').on(t.lessonId),
    statusIdx: index('education_user_progress_status_idx').on(t.status),
    uniqueIdx: index('education_user_progress_unique_idx').on(t.userId, t.lessonId),
}));

export type NewUserProgress = typeof userProgress.$inferInsert;
export type UserProgressItem = typeof userProgress.$inferSelect;

// Achievements and badges system
export const achievements = pgTable('education_achievements', {
    id: text('id').primaryKey().notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),

    // Achievement categorization
    category: varchar('category', { length: 50 }).notNull(), // skill, milestone, creativity, collaboration, etc.
    type: varchar('type', { length: 30 }).notNull(), // badge, certificate, trophy
    tier: varchar('tier', { length: 20 }).default('bronze'), // bronze, silver, gold, platinum

    // Requirements
    requirements: jsonb('requirements').notNull(), // Criteria for earning achievement
    points: integer('points').default(0), // Point value

    // Visual
    iconUrl: text('icon_url'),
    badgeUrl: text('badge_url'),
    colorScheme: varchar('color_scheme', { length: 20 }).default('blue'),

    // Settings
    isActive: boolean('is_active').default(true),
    isVisible: boolean('is_visible').default(true),

    ...timestamps,
}, (t) => ({
    categoryIdx: index('education_achievements_category_idx').on(t.category),
    typeIdx: index('education_achievements_type_idx').on(t.type),
    activeIdx: index('education_achievements_active_idx').on(t.isActive),
}));

export type NewAchievement = typeof achievements.$inferInsert;
export type AchievementItem = typeof achievements.$inferSelect;

// User achievements - earned badges/certificates
export const userAchievements = pgTable('education_user_achievements', {
    id: text('id').primaryKey().notNull(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    achievementId: text('achievement_id').references(() => achievements.id, { onDelete: 'cascade' }).notNull(),

    // Achievement details
    earnedAt: text('earned_at').notNull(),
    context: jsonb('context').default({}), // How it was earned
    verificationCode: text('verification_code'), // QR code for verification

    // Certificate details
    certificateUrl: text('certificate_url'), // Generated certificate PDF/image
    isVerified: boolean('is_verified').default(true),

    ...timestamps,
}, (t) => ({
    pk: primaryKey({ columns: [t.userId, t.achievementId] }),
    userIdx: index('education_user_achievements_user_idx').on(t.userId),
    achievementIdx: index('education_user_achievements_achievement_idx').on(t.achievementId),
    earnedIdx: index('education_user_achievements_earned_idx').on(t.earnedAt),
}));

export type NewUserAchievement = typeof userAchievements.$inferInsert;
export type UserAchievementItem = typeof userAchievements.$inferSelect;

// Course enrollments
export const courseEnrollments = pgTable('education_course_enrollments', {
    id: text('id').primaryKey().notNull(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    courseId: text('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),

    // Enrollment details
    enrolledAt: text('enrolled_at').notNull(),
    status: varchar('status', { length: 20 }).default('active'), // active, completed, dropped, suspended
    completionPercentage: integer('completion_percentage').default(0),

    // Performance summary
    overallScore: integer('overall_score'), // 0-100
    timeSpentHours: integer('time_spent_hours').default(0),
    lessonsCompleted: integer('lessons_completed').default(0),
    totalLessons: integer('total_lessons').default(0),

    // Dates
    lastAccessedAt: text('last_accessed_at'),
    completedAt: text('completed_at'),

    ...timestamps,
}, (t) => ({
    pk: primaryKey({ columns: [t.userId, t.courseId] }),
    userIdx: index('education_course_enrollments_user_idx').on(t.userId),
    courseIdx: index('education_course_enrollments_course_idx').on(t.courseId),
    statusIdx: index('education_course_enrollments_status_idx').on(t.status),
}));

export type NewCourseEnrollment = typeof courseEnrollments.$inferInsert;
export type CourseEnrollmentItem = typeof courseEnrollments.$inferSelect;