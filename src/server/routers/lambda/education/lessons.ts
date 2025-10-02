import { z } from 'zod';
import { eq, and, asc } from 'drizzle-orm';

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
    content: z.string().optional(),
    contentType: z.string().default('text'),
    aiPrompts: z.array(z.any()).optional(),
    courseId: z.string(),
    description: z.string().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    estimatedMinutes: z.number().min(0).optional(),
    isPublished: z.boolean().default(false),
    learningObjectives: z.array(z.string()).optional(),
    makerComponents: z.array(z.any()).optional(),
    order: z.number().min(0).default(0),
    title: z.string().min(1).max(255),
    parentLessonId: z.string().optional(),
    requiresCompletion: z.boolean().default(true),
    resources: z.array(z.any()).optional(),
});

const updateLessonSchema = createLessonSchema.partial().extend({
    id: z.string(),
});

const updateProgressSchema = z.object({
    completionPercentage: z.number().min(0).max(100).optional(),
    lessonId: z.string(),
    score: z.number().min(0).max(100).optional(),
    status: z.enum(['not_started', 'in_progress', 'completed', 'mastered']),
    timeSpentMinutes: z.number().min(0).optional(),
});

export const lessonsRouter = router({
    
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
                id: `lesson_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
                ...input,
            };

            const [createdLesson] = await serverDB
                .insert(lessons)
                .values(newLesson)
                .returning();

            return createdLesson;
        }),

    
    

// Delete lesson
delete: lessonProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            // Check if user owns the course
            const [lesson] = await serverDB
                .select({
                    course: courses,
                    lesson: lessons,
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
                lessonOrder: lesson.order,
                lessonTitle: lesson.title,
                progress: progress || {
                    completionPercentage: 0,
                    status: 'not_started',
                    timeSpentMinutes: 0,
                },
            }));
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
                    course: courses,
                    lesson: lessons,
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
                        completedAt: input.status === 'completed' || input.status === 'mastered'
                            ? new Date().toISOString()
                            : existingProgress.completedAt,
                        completionPercentage: input.completionPercentage ?? existingProgress.completionPercentage,
                        lastAccessedAt: new Date().toISOString(),
                        score: input.score ?? existingProgress.score,
                        status: input.status,
                        timeSpentMinutes: input.timeSpentMinutes ?? existingProgress.timeSpentMinutes,
                        updatedAt: new Date(),
                    })
                    .where(eq(userProgress.id, existingProgress.id))
                    .returning();

                return updatedProgress;
            } else {
                // Create new progress record
                const newProgress: NewUserProgress = {
                    completionPercentage: input.completionPercentage ?? 0,
                    courseId: lesson.courseId,
                    id: `progress_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
                    lastAccessedAt: new Date().toISOString(),
                    lessonId: input.lessonId,
                    completedAt: input.status === 'completed' || input.status === 'mastered'
                        ? new Date().toISOString()
                        : undefined,
                    score: input.score,
                    startedAt: new Date().toISOString(),
                    userId,
                    status: input.status,
                    timeSpentMinutes: input.timeSpentMinutes ?? 0,
                };

                const [createdProgress] = await serverDB
                    .insert(userProgress)
                    .values(newProgress)
                    .returning();

                return createdProgress;
            }
        }),
});