/* eslint-disable sort-keys-fix/sort-keys-fix  */
import {
    boolean,
    index,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    text,
    varchar,
} from 'drizzle-orm/pg-core';

import { timestamps } from './_helpers';
import { users } from './user';

// Enums for educational user profiles
export const educationLevelEnum = pgEnum('education_level', ['elementary', 'middle', 'high_school', 'college', 'adult']);
export const parentRelationEnum = pgEnum('parent_relation', ['mother', 'father', 'guardian', 'other']);

// Educational user profiles - extends base user with education-specific data
export const educationalProfiles = pgTable('educational_profiles', {
    id: text('id').primaryKey().notNull(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),

    // Student information
    studentId: varchar('student_id', { length: 50 }), // School/district student ID
    grade: varchar('grade', { length: 10 }), // K, 1-12, or custom grade level
    educationLevel: educationLevelEnum('education_level'),

    // School/Institution
    schoolName: text('school_name'),
    schoolDistrict: text('school_district'),
    classroomCode: varchar('classroom_code', { length: 20 }),

    // Learning preferences and accessibility
    learningStyle: jsonb('learning_style').default({}), // visual, auditory, kinesthetic preferences
    accessibilityNeeds: jsonb('accessibility_needs').$type<string[]>().default([]),
    preferredLanguage: varchar('preferred_language', { length: 10 }).default('en'),

    // Skill levels and interests
    skillLevels: jsonb('skill_levels').default({}), // Subject -> skill level mapping
    interests: jsonb('interests').$type<string[]>().default([]),
    goals: jsonb('goals').$type<string[]>().default([]),

    // Parent/Guardian information
    parentEmail: text('parent_email'),
    emergencyContact: jsonb('emergency_contact').default({}),

    // Educational settings
    allowDataSharing: boolean('allow_data_sharing').default(false),
    parentalControls: jsonb('parental_controls').default({}),
    privacySettings: jsonb('privacy_settings').default({}),

    // AI tutor personalization
    aiTutorPersonality: varchar('ai_tutor_personality', { length: 20 }).default('encouraging'),
    aiTutorVoice: varchar('ai_tutor_voice', { length: 30 }),
    customPrompts: jsonb('custom_prompts').default([]),

    // Progress tracking preferences
    progressNotifications: boolean('progress_notifications').default(true),
    achievementNotifications: boolean('achievement_notifications').default(true),
    parentReports: boolean('parent_reports').default(true),

    ...timestamps,
}, (t) => ({
    userIdx: index('educational_profiles_user_idx').on(t.userId),
    gradeIdx: index('educational_profiles_grade_idx').on(t.grade),
    schoolIdx: index('educational_profiles_school_idx').on(t.schoolName),
    classroomIdx: index('educational_profiles_classroom_idx').on(t.classroomCode),
}));

export type NewEducationalProfile = typeof educationalProfiles.$inferInsert;
export type EducationalProfileItem = typeof educationalProfiles.$inferSelect;

// Parent-student relationships
export const parentStudentRelations = pgTable('parent_student_relations', {
    id: text('id').primaryKey().notNull(),
    parentUserId: text('parent_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    studentUserId: text('student_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

    // Relationship details
    relationshipType: parentRelationEnum('relationship_type').notNull(),
    isPrimary: boolean('is_primary').default(false), // Primary guardian

    // Permissions
    canViewProgress: boolean('can_view_progress').default(true),
    canReceiveReports: boolean('can_receive_reports').default(true),
    canModifySettings: boolean('can_modify_settings').default(true),

    // Contact preferences
    notificationPreferences: jsonb('notification_preferences').default({}),
    reportSchedule: varchar('report_schedule', { length: 20 }).default('weekly'), // daily, weekly, monthly

    // Verification
    isVerified: boolean('is_verified').default(false),
    verificationCode: text('verification_code'),
    verifiedAt: text('verified_at'),

    ...timestamps,
}, (t) => ({
    parentIdx: index('parent_student_relations_parent_idx').on(t.parentUserId),
    studentIdx: index('parent_student_relations_student_idx').on(t.studentUserId),
    primaryIdx: index('parent_student_relations_primary_idx').on(t.studentUserId, t.isPrimary),
}));

export type NewParentStudentRelation = typeof parentStudentRelations.$inferInsert;
export type ParentStudentRelationItem = typeof parentStudentRelations.$inferSelect;

// Teacher-student assignments
export const teacherStudentAssignments = pgTable('teacher_student_assignments', {
    id: text('id').primaryKey().notNull(),
    teacherUserId: text('teacher_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    studentUserId: text('student_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

    // Assignment details
    classroomName: text('classroom_name'),
    subject: varchar('subject', { length: 50 }),
    academicYear: varchar('academic_year', { length: 20 }), // 2024-2025
    semester: varchar('semester', { length: 20 }), // fall, spring, summer

    // Role and permissions
    role: varchar('role', { length: 20 }).default('teacher'), // teacher, assistant, mentor
    canGrade: boolean('can_grade').default(true),
    canMessage: boolean('can_message').default(true),
    canAssignWork: boolean('can_assign_work').default(true),

    // Status
    isActive: boolean('is_active').default(true),
    startDate: text('start_date'),
    endDate: text('end_date'),

    ...timestamps,
}, (t) => ({
    teacherIdx: index('teacher_student_assignments_teacher_idx').on(t.teacherUserId),
    studentIdx: index('teacher_student_assignments_student_idx').on(t.studentUserId),
    classroomIdx: index('teacher_student_assignments_classroom_idx').on(t.classroomName),
    activeIdx: index('teacher_student_assignments_active_idx').on(t.isActive),
}));

export type NewTeacherStudentAssignment = typeof teacherStudentAssignments.$inferInsert;
export type TeacherStudentAssignmentItem = typeof teacherStudentAssignments.$inferSelect;

// Educational organizations (schools, districts)
export const educationalOrganizations = pgTable('educational_organizations', {
    id: text('id').primaryKey().notNull(),
    name: text('name').notNull(),
    type: varchar('type', { length: 20 }).notNull(), // school, district, institution

    // Location
    address: text('address'),
    city: text('city'),
    state: text('state'),
    country: text('country').default('US'),
    zipCode: varchar('zip_code', { length: 10 }),

    // Contact information
    phone: varchar('phone', { length: 20 }),
    email: text('email'),
    website: text('website'),

    // Administrative
    adminUserId: text('admin_user_id').references(() => users.id),
    settings: jsonb('settings').default({}),

    // Status
    isActive: boolean('is_active').default(true),
    isVerified: boolean('is_verified').default(false),

    ...timestamps,
}, (t) => ({
    nameIdx: index('educational_organizations_name_idx').on(t.name),
    typeIdx: index('educational_organizations_type_idx').on(t.type),
    adminIdx: index('educational_organizations_admin_idx').on(t.adminUserId),
    activeIdx: index('educational_organizations_active_idx').on(t.isActive),
}));

export type NewEducationalOrganization = typeof educationalOrganizations.$inferInsert;
export type EducationalOrganizationItem = typeof educationalOrganizations.$inferSelect;

// User organization memberships
export const organizationMemberships = pgTable('organization_memberships', {
    id: text('id').primaryKey().notNull(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    organizationId: text('organization_id').references(() => educationalOrganizations.id, { onDelete: 'cascade' }).notNull(),

    // Membership details
    role: varchar('role', { length: 30 }).notNull(), // student, teacher, admin, staff
    department: text('department'),
    title: text('title'),

    // Status
    isActive: boolean('is_active').default(true),
    joinedAt: text('joined_at').notNull(),
    leftAt: text('left_at'),

    ...timestamps,
}, (t) => ({
    userIdx: index('organization_memberships_user_idx').on(t.userId),
    organizationIdx: index('organization_memberships_organization_idx').on(t.organizationId),
    roleIdx: index('organization_memberships_role_idx').on(t.role),
    activeIdx: index('organization_memberships_active_idx').on(t.isActive),
}));

export type NewOrganizationMembership = typeof organizationMemberships.$inferInsert;
export type OrganizationMembershipItem = typeof organizationMemberships.$inferSelect;