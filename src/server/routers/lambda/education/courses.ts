import { z } from 'zod';
import { desc, eq, and, like, inArray } from 'drizzle-orm';

import { authedProcedure, router } from '@/libs/trpc/lambda';
import { serverDatabase } from '@/libs/trpc/lambda/middleware';
import {
    courses,
    lessons,
    courseEnrollments,
    NewCourse,
    NewLesson,
    NewCourseEnrollment
} from '@/database/schemas/education';

// Course management procedures
const courseProcedure = authedProcedure.use(serverDatabase);

// Input validation schemas
const createCourseSchema = z.object({
    title: z.string().min(1).max(255),
    description: z.string().optional(),
    shortDescription: z.string().optional(),
    subject: z.enum(['science', 'technology', 'engineering', 'arts', 'mathematics', 'robotics', 'programming', 'electronics', 'design', 'maker']),
    grade: z.enum(['k', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    estimatedHours: z.number().min(0).optional(),
    prerequisites: z.array(z.string()).optional(),
    learningObjectives: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    thumbnailUrl: z.string().optional(),
    bannerUrl: z.string().optional(),
    isPublished: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    allowSelfEnrollment: z.boolean().default(true),
});

const updateCourseSchema = createCourseSchema.partial().extend({
    id: z.string(),
});

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

const enrollCourseSchema = z.object({
    courseId: z.string(),
});

const courseFiltersSchema = z.object({
    subject: z.enum(['science', 'technology', 'engineering', 'arts', 'mathematics', 'robotics', 'programming', 'electronics', 'design', 'maker']).optional(),
    grade: z.enum(['k', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']).optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
    search: z.string().optional(),
    featured: z.boolean().optional(),
    published: z.boolean().default(true),
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0),
});

export const coursesRouter = router({
    // Get all courses with filters
    list: courseProcedure
        .input(courseFiltersSchema)
        .query(async ({ ctx, input }) => {
            const { serverDB } = ctx;

            let query = serverDB.select().from(courses);

            // Apply filters
            const filters = [];
            if (input.subject) filters.push(eq(courses.subject, input.subject));
            if (input.grade) filters.push(eq(courses.grade, input.grade));
            if (input.difficulty) filters.push(eq(courses.difficulty, input.difficulty));
            if (input.featured !== undefined) filters.push(eq(courses.isFeatured, input.featured));
            if (input.published !== undefined) filters.push(eq(courses.isPublished, input.published));

            if (input.search) {
                filters.push(like(courses.title, `%${input.search}%`));
            }

            if (filters.length > 0) {
                query = query.where(and(...filters));
            }

            const results = await query
                .orderBy(desc(courses.createdAt))
                .limit(input.limit)
                .offset(input.offset);

            return results;
        }),

    // Get course by ID with lessons
    getById: courseProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const { serverDB } = ctx;

            const [course] = await serverDB
                .select()
                .from(courses)
                .where(eq(courses.id, input.id));

            if (!course) {
                throw new Error('Course not found');
            }

            // Get lessons for this course
            const courseLessons = await serverDB
                .select()
                .from(lessons)
                .where(eq(lessons.courseId, input.id))
                .orderBy(lessons.order, lessons.createdAt);

            return {
                ...course,
                lessons: courseLessons,
            };
        }),

    // Create new course (teachers/admins only)
    create: courseProcedure
        .input(createCourseSchema)
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            // TODO: Add role-based authorization check here
            // For now, any authenticated user can create courses

            const newCourse: NewCourse = {
                id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                instructorId: userId,
                ...input,
            };

            const [createdCourse] = await serverDB
                .insert(courses)
                .values(newCourse)
                .returning();

            return createdCourse;
        }),

    // Update course
    update: courseProcedure
        .input(updateCourseSchema)
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;
            const { id, ...updateData } = input;

            // Check if user owns the course or has admin rights
            const [course] = await serverDB
                .select()
                .from(courses)
                .where(eq(courses.id, id));

            if (!course) {
                throw new Error('Course not found');
            }

            if (course.instructorId !== userId) {
                throw new Error('Unauthorized: You can only update your own courses');
            }

            const [updatedCourse] = await serverDB
                .update(courses)
                .set({ ...updateData, updatedAt: new Date() })
                .where(eq(courses.id, id))
                .returning();

            return updatedCourse;
        }),

    // Delete course
    delete: courseProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            // Check if user owns the course
            const [course] = await serverDB
                .select()
                .from(courses)
                .where(eq(courses.id, input.id));

            if (!course) {
                throw new Error('Course not found');
            }

            if (course.instructorId !== userId) {
                throw new Error('Unauthorized: You can only delete your own courses');
            }

            await serverDB
                .delete(courses)
                .where(eq(courses.id, input.id));

            return { success: true };
        }),

    // Enroll in course
    enroll: courseProcedure
        .input(enrollCourseSchema)
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            // Check if course exists and allows self-enrollment
            const [course] = await serverDB
                .select()
                .from(courses)
                .where(eq(courses.id, input.courseId));

            if (!course) {
                throw new Error('Course not found');
            }

            if (!course.allowSelfEnrollment) {
                throw new Error('This course does not allow self-enrollment');
            }

            // Check if already enrolled
            const [existingEnrollment] = await serverDB
                .select()
                .from(courseEnrollments)
                .where(and(
                    eq(courseEnrollments.courseId, input.courseId),
                    eq(courseEnrollments.userId, userId)
                ));

            if (existingEnrollment) {
                throw new Error('Already enrolled in this course');
            }

            // Get total lessons count
            const lessonsCount = await serverDB
                .select()
                .from(lessons)
                .where(eq(lessons.courseId, input.courseId));

            const newEnrollment: NewCourseEnrollment = {
                id: `enrollment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId,
                courseId: input.courseId,
                enrolledAt: new Date().toISOString(),
                totalLessons: lessonsCount.length,
            };

            const [enrollment] = await serverDB
                .insert(courseEnrollments)
                .values(newEnrollment)
                .returning();

            return enrollment;
        }),

    // Get user's enrolled courses
    getEnrolled: courseProcedure
        .query(async ({ ctx }) => {
            const { serverDB, userId } = ctx;

            const enrolledCourses = await serverDB
                .select({
                    course: courses,
                    enrollment: courseEnrollments,
                })
                .from(courseEnrollments)
                .innerJoin(courses, eq(courseEnrollments.courseId, courses.id))
                .where(eq(courseEnrollments.userId, userId))
                .orderBy(desc(courseEnrollments.enrolledAt));

            return enrolledCourses.map(({ course, enrollment }) => ({
                ...course,
                enrollment,
            }));
        }),

    // Get courses created by user (for teachers)
    getOwned: courseProcedure
        .query(async ({ ctx }) => {
            const { serverDB, userId } = ctx;

            const ownedCourses = await serverDB
                .select()
                .from(courses)
                .where(eq(courses.instructorId, userId))
                .orderBy(desc(courses.createdAt));

            return ownedCourses;
        }),

    // Additional methods for the store
    getAllCourses: courseProcedure
        .query(async ({ ctx }) => {
            const { serverDB } = ctx;

            const allCourses = await serverDB
                .select()
                .from(courses)
                .where(eq(courses.isPublished, true))
                .orderBy(desc(courses.createdAt));

            return allCourses;
        }),

    getEnrolledCourses: courseProcedure
        .query(async ({ ctx }) => {
            const { serverDB, userId } = ctx;

            const enrollments = await serverDB
                .select()
                .from(courseEnrollments)
                .where(eq(courseEnrollments.userId, userId));

            return enrollments;
        }),

    enrollCourse: courseProcedure
        .input(z.object({ courseId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            // Check if course exists and allows self-enrollment
            const [course] = await serverDB
                .select()
                .from(courses)
                .where(eq(courses.id, input.courseId));

            if (!course) {
                throw new Error('Course not found');
            }

            if (!course.allowSelfEnrollment) {
                throw new Error('This course does not allow self-enrollment');
            }

            // Check if already enrolled
            const [existingEnrollment] = await serverDB
                .select()
                .from(courseEnrollments)
                .where(and(
                    eq(courseEnrollments.courseId, input.courseId),
                    eq(courseEnrollments.userId, userId)
                ));

            if (existingEnrollment) {
                throw new Error('Already enrolled in this course');
            }

            // Get total lessons count
            const lessonsCount = await serverDB
                .select()
                .from(lessons)
                .where(eq(lessons.courseId, input.courseId));

            const newEnrollment: NewCourseEnrollment = {
                id: `enrollment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId,
                courseId: input.courseId,
                enrolledAt: new Date().toISOString(),
                totalLessons: lessonsCount.length,
            };

            const [enrollment] = await serverDB
                .insert(courseEnrollments)
                .values(newEnrollment)
                .returning();

            return enrollment;
        }),

    unenrollCourse: courseProcedure
        .input(z.object({ courseId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            await serverDB
                .delete(courseEnrollments)
                .where(and(
                    eq(courseEnrollments.courseId, input.courseId),
                    eq(courseEnrollments.userId, userId)
                ));

            return { success: true };
        }),

    searchCourses: courseProcedure
        .input(z.object({ query: z.string() }))
        .query(async ({ ctx, input }) => {
            const { serverDB } = ctx;

            const results = await serverDB
                .select()
                .from(courses)
                .where(and(
                    like(courses.title, `%${input.query}%`),
                    eq(courses.isPublished, true)
                ))
                .orderBy(desc(courses.createdAt))
                .limit(20);

            return results;
        }),

    getRecommendedCourses: courseProcedure
        .query(async ({ ctx }) => {
            const { serverDB } = ctx;

            // Simple recommendation: featured courses
            const recommendedCourses = await serverDB
                .select()
                .from(courses)
                .where(and(
                    eq(courses.isFeatured, true),
                    eq(courses.isPublished, true)
                ))
                .orderBy(desc(courses.createdAt))
                .limit(10);

            return recommendedCourses;
        }),
});