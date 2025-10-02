import { z } from 'zod';
import { desc, eq, and, asc } from 'drizzle-orm';

import { authedProcedure, router } from '@/libs/trpc/lambda';
import { serverDatabase } from '@/libs/trpc/lambda/middleware';
import {
    lessons,
    courses,
    userProgress,
    NewLesson,
    NewUserProgress
} from '@/database/schemas/education';

const lessonProcedure = authedProcedure.use(serverDatabase);

// Input validation schemas
const createLessonSchema = z.object({
    courseId: z.string(),
    title: z.string().min(1).max(255),
    description: z.string().optional(),
    content: z.string().optional(),
    order: z.number().min(0).default(0),
    parentLessonId: z.string().optional(),
    estimatedMinutes: z.number().min(0).optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    learningObjectives: z.array(z.string()).optional(),
    contentType: z.string().default('text'),
    resources: z.array(z.any()).optional(),
    aiPrompts: z.array(z.any()).optional(),
    makerComponents: z.array(z.any()).optional(),
    isPublished: z.boolean().default(false),
    requiresCompletion: z.boolean().default(true),
});

const updateLessonSchema = createLessonSchema.partial().extend({
    id: z.string(),
});

const updateProgressSchema = z.object({
    lessonId: z.string(),
    status: z.enum(['not_started', 'in_progress', 'completed', 'mastered']),
    completionPercentage: z.number().min(0).max(100).optional(),
    timeSpentMinutes: z.number().min(0).optional(),
    score: z.number().min(0).max(100).optional(),
});

export const lessonsRouter = router({
    // Get lessons for a course
    getByCourse: lessonProcedure
        .input(z.object({ courseId: z.string() }))
        .query(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            // Get lessons with user progress
            const courseLessons = await serverDB
                .select({
                    lesson: lessons,
                    progress: userProgress,
                })
                .from(lessons)
                .leftJoin(userProgress, and(
                    eq(userProgress.lessonId, lessons.id),
                    eq(userProgress.userId, userId)
                ))
                .where(eq(lessons.courseId, input.courseId))
                .orderBy(asc(lessons.order), asc(lessons.createdAt));

            return courseLessons.map(({ lesson, progress }) => ({
                ...lesson,
                userProgress: progress,
            }));
        }),

    // Get single lesson with content
    getById: lessonProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            const [lesson] = await serverDB
                .select({
                    lesson: lessons,
                    progress: userProgress,
                })
                .from(lessons)
                .leftJoin(userProgress, and(
                    eq(userProgress.lessonId, lessons.id),
                    eq(userProgress.userId, userId)
                ))
                .where(eq(lessons.id, input.id));

            if (!lesson) {
                throw new Error('Lesson not found');
            }

            // Update last accessed time
            if (lesson.progress) {
                await serverDB
                    .update(userProgress)
                    .set({ lastAccessedAt: new Date().toISOString() })
                    .where(eq(userProgress.id, lesson.progress.id));
            }

            return {
                ...lesson.lesson,
                userProgress: lesson.progress,
            };
        }),

    // Create new lesson (teachers/course owners only)
    create: lessonProcedure
        .input(createLessonSchema)
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            // Check if user owns the course
            const [course] = await serverDB
                .select()
                .from(courses)
                .where(eq(courses.id, input.courseId));

            if (!course) {
                throw new Error('Course not found');
            }

            if (course.instructorId !== userId) {
                throw new Error('Unauthorized: You can only add lessons to your own courses');
            }

            const newLesson: NewLesson = {
                id: `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                ...input,
            };

            const [createdLesson] = await serverDB
                .insert(lessons)
                .values(newLesson)
                .returning();

            return createdLesson;
        }),

    // Update lesson
    update: lessonProcedure
        .input(updateLessonSchema)
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;
            const { id, ...updateData } = input;

            // Check if user owns the course this lesson belongs to
            const [lesson] = await serverDB
                .select({
                    lesson: lessons,
                    course: courses,
                })
                .from(lessons)
                .innerJoin(courses, eq(courses.id, lessons.courseId))
                .where(eq(lessons.id, id));

            if (!lesson) {
                throw new Error('Lesson not found');
            }

            if (lesson.course.instructorId !== userId) {
                throw new Error('Unauthorized: You can only update lessons in your own courses');
            }

            const [updatedLesson] = await serverDB
                .update(lessons)
                .set({ ...updateData, updatedAt: new Date() })
                .where(eq(lessons.id, id))
                .returning();

            return updatedLesson;
        }),

    // Delete lesson
    delete: lessonProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            // Check if user owns the course
            const [lesson] = await serverDB
                .select({
                    lesson: lessons,
                    course: courses,
                })
                .from(lessons)
                .innerJoin(courses, eq(courses.id, lessons.courseId))
                .where(eq(lessons.id, input.id));

            if (!lesson) {
                throw new Error('Lesson not found');
            }

            if (lesson.course.instructorId !== userId) {
                throw new Error('Unauthorized: You can only delete lessons from your own courses');
            }

            await serverDB
                .delete(lessons)
                .where(eq(lessons.id, input.id));

            return { success: true };
        }),

    // Update user progress for a lesson
    updateProgress: lessonProcedure
        .input(updateProgressSchema)
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            // Check if lesson exists
            const [lesson] = await serverDB
                .select()
                .from(lessons)
                .where(eq(lessons.id, input.lessonId));

            if (!lesson) {
                throw new Error('Lesson not found');
            }

            // Get or create progress record
            const [existingProgress] = await serverDB
                .select()
                .from(userProgress)
                .where(and(
                    eq(userProgress.lessonId, input.lessonId),
                    eq(userProgress.userId, userId)
                ));

            if (existingProgress) {
                // Update existing progress
                const [updatedProgress] = await serverDB
                    .update(userProgress)
                    .set({
                        status: input.status,
                        completionPercentage: input.completionPercentage ?? existingProgress.completionPercentage,
                        timeSpentMinutes: input.timeSpentMinutes ?? existingProgress.timeSpentMinutes,
                        score: input.score ?? existingProgress.score,
                        lastAccessedAt: new Date().toISOString(),
                        completedAt: input.status === 'completed' || input.status === 'mastered'
                            ? new Date().toISOString()
                            : existingProgress.completedAt,
                        updatedAt: new Date(),
                    })
                    .where(eq(userProgress.id, existingProgress.id))
                    .returning();

                return updatedProgress;
            } else {
                // Create new progress record
                const newProgress: NewUserProgress = {
                    id: `progress_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    userId,
                    lessonId: input.lessonId,
                    courseId: lesson.courseId,
                    status: input.status,
                    completionPercentage: input.completionPercentage ?? 0,
                    timeSpentMinutes: input.timeSpentMinutes ?? 0,
                    score: input.score,
                    startedAt: new Date().toISOString(),
                    lastAccessedAt: new Date().toISOString(),
                    completedAt: input.status === 'completed' || input.status === 'mastered'
                        ? new Date().toISOString()
                        : undefined,
                };

                const [createdProgress] = await serverDB
                    .insert(userProgress)
                    .values(newProgress)
                    .returning();

                return createdProgress;
            }
        }),

    // Get user's progress across all lessons in a course
    getProgressByCourse: lessonProcedure
        .input(z.object({ courseId: z.string() }))
        .query(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            const progressData = await serverDB
                .select({
                    lesson: lessons,
                    progress: userProgress,
                })
                .from(lessons)
                .leftJoin(userProgress, and(
                    eq(userProgress.lessonId, lessons.id),
                    eq(userProgress.userId, userId)
                ))
                .where(eq(lessons.courseId, input.courseId))
                .orderBy(asc(lessons.order));

            return progressData.map(({ lesson, progress }) => ({
                lessonId: lesson.id,
                lessonTitle: lesson.title,
                lessonOrder: lesson.order,
                progress: progress || {
                    status: 'not_started',
                    completionPercentage: 0,
                    timeSpentMinutes: 0,
                },
            }));
        }),

    // Get next lesson in sequence
    getNext: lessonProcedure
        .input(z.object({ currentLessonId: z.string() }))
        .query(async ({ ctx, input }) => {
            const { serverDB } = ctx;

            // Get current lesson
            const [currentLesson] = await serverDB
                .select()
                .from(lessons)
                .where(eq(lessons.id, input.currentLessonId));

            if (!currentLesson) {
                throw new Error('Current lesson not found');
            }

            // Get next lesson in the same course
            const [nextLesson] = await serverDB
                .select()
                .from(lessons)
                .where(and(
                    eq(lessons.courseId, currentLesson.courseId),
                    eq(lessons.order, currentLesson.order + 1)
                ));

            return nextLesson || null;
        }),

    // Get previous lesson in sequence
    getPrevious: lessonProcedure
        .input(z.object({ currentLessonId: z.string() }))
        .query(async ({ ctx, input }) => {
            const { serverDB } = ctx;

            // Get current lesson
            const [currentLesson] = await serverDB
                .select()
                .from(lessons)
                .where(eq(lessons.id, input.currentLessonId));

            if (!currentLesson) {
                throw new Error('Current lesson not found');
            }

            // Get previous lesson in the same course
            const [previousLesson] = await serverDB
                .select()
                .from(lessons)
                .where(and(
                    eq(lessons.courseId, currentLesson.courseId),
                    eq(lessons.order, Math.max(0, currentLesson.order - 1))
                ));

            return previousLesson || null;
        }),
});