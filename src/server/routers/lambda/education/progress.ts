import { z } from 'zod';
import { desc, eq, and, sum } from 'drizzle-orm';

import { authedProcedure, router } from '@/libs/trpc/lambda';
import { serverDatabase } from '@/libs/trpc/lambda/middleware';
import {
    userProgress,
    NewUserProgress
} from '@/database/schemas/education';

// Progress management procedures
const progressProcedure = authedProcedure.use(serverDatabase);

export const progressRouter = router({
    // Get user's progress across all courses
    getUserProgress: progressProcedure
        .query(async ({ ctx }) => {
            const { serverDB, userId } = ctx;

            const progress = await serverDB
                .select()
                .from(userProgress)
                .where(eq(userProgress.userId, userId))
                .orderBy(desc(userProgress.updatedAt));

            return progress;
        }),

    // Update lesson progress
    updateProgress: progressProcedure
        .input(z.object({
            courseId: z.string(),
            lessonId: z.string(),
            completed: z.boolean(),
            timeSpent: z.number().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            // Check if progress record exists
            const [existingProgress] = await serverDB
                .select()
                .from(userProgress)
                .where(and(
                    eq(userProgress.userId, userId),
                    eq(userProgress.courseId, input.courseId),
                    eq(userProgress.lessonId, input.lessonId)
                ));

            if (existingProgress) {
                // Update existing progress
                const [updatedProgress] = await serverDB
                    .update(userProgress)
                    .set({
                        completed: input.completed,
                        completedAt: input.completed ? new Date().toISOString() : null,
                        timeSpent: input.timeSpent ? (existingProgress.timeSpent || 0) + input.timeSpent : existingProgress.timeSpent,
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
                    courseId: input.courseId,
                    lessonId: input.lessonId,
                    completed: input.completed,
                    completedAt: input.completed ? new Date().toISOString() : null,
                    timeSpent: input.timeSpent || 0,
                };

                const [createdProgress] = await serverDB
                    .insert(userProgress)
                    .values(newProgress)
                    .returning();

                return createdProgress;
            }
        }),

    // Mark course as completed
    completeCourse: progressProcedure
        .input(z.object({ courseId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            // Update all lessons in the course to completed
            await serverDB
                .update(userProgress)
                .set({
                    completed: true,
                    completedAt: new Date().toISOString(),
                    updatedAt: new Date(),
                })
                .where(and(
                    eq(userProgress.userId, userId),
                    eq(userProgress.courseId, input.courseId)
                ));

            return { success: true };
        }),

    // Update study time
    updateStudyTime: progressProcedure
        .input(z.object({
            courseId: z.string(),
            timeSpent: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            // This would typically update a separate study session table
            // For now, we'll just return success
            return { success: true, timeSpent: input.timeSpent };
        }),

    // Get learning statistics
    getLearningStats: progressProcedure
        .query(async ({ ctx }) => {
            const { serverDB, userId } = ctx;

            // Get total progress records for stats
            const progressRecords = await serverDB
                .select()
                .from(userProgress)
                .where(eq(userProgress.userId, userId));

            const totalTimeSpent = progressRecords.reduce((total, record) => total + (record.timeSpent || 0), 0);
            const lessonsCompleted = progressRecords.filter(record => record.completed).length;
            const coursesWithProgress = new Set(progressRecords.map(record => record.courseId));
            const completedCourses = 0; // This would need more complex logic to determine fully completed courses

            return {
                totalTimeSpent,
                coursesCompleted: completedCourses,
                lessonsCompleted,
                streakDays: 0, // This would need to be calculated from activity logs
                lastStudyDate: progressRecords.length > 0 ? progressRecords[0].updatedAt : undefined,
            };
        }),

    // Record study activity
    recordActivity: progressProcedure
        .input(z.object({
            courseId: z.string(),
            lessonId: z.string(),
            timeSpent: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            // Update or create progress record with time spent
            const [existingProgress] = await serverDB
                .select()
                .from(userProgress)
                .where(and(
                    eq(userProgress.userId, userId),
                    eq(userProgress.courseId, input.courseId),
                    eq(userProgress.lessonId, input.lessonId)
                ));

            if (existingProgress) {
                await serverDB
                    .update(userProgress)
                    .set({
                        timeSpent: (existingProgress.timeSpent || 0) + input.timeSpent,
                        updatedAt: new Date(),
                    })
                    .where(eq(userProgress.id, existingProgress.id));
            } else {
                const newProgress: NewUserProgress = {
                    id: `progress_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    userId,
                    courseId: input.courseId,
                    lessonId: input.lessonId,
                    completed: false,
                    timeSpent: input.timeSpent,
                };

                await serverDB
                    .insert(userProgress)
                    .values(newProgress);
            }

            return { success: true };
        }),

    // Get course-specific progress
    getCourseProgress: progressProcedure
        .input(z.object({ courseId: z.string() }))
        .query(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            const courseProgressRecords = await serverDB
                .select()
                .from(userProgress)
                .where(and(
                    eq(userProgress.userId, userId),
                    eq(userProgress.courseId, input.courseId)
                ));

            const completedLessons = courseProgressRecords
                .filter(record => record.completed)
                .map(record => record.lessonId);

            const totalTimeSpent = courseProgressRecords.reduce((total, record) => total + (record.timeSpent || 0), 0);
            const totalLessons = courseProgressRecords.length; // This might not be accurate if not all lessons have progress records
            const progressPercentage = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;
            const lastAccessedAt = courseProgressRecords.length > 0 ? courseProgressRecords[0].updatedAt : new Date().toISOString();

            return {
                courseId: input.courseId,
                completedLessons,
                totalLessons,
                progressPercentage,
                lastAccessedAt,
                timeSpent: totalTimeSpent,
            };
        }),
});