import { NewRole, roles, NewPermission, permissions, NewRolePermission, rolePermissions } from '../schemas/rbac';

// Educational role definitions
export const educationalRoles: NewRole[] = [
    {
        name: 'student',
        displayName: 'Student',
        description: 'Students can access courses, submit assignments, and track their progress',
        isSystem: true,
        metadata: {
            category: 'education',
            priority: 1,
            capabilities: ['view_courses', 'submit_assignments', 'track_progress', 'use_maker_workbench']
        }
    },
    {
        name: 'teacher',
        displayName: 'Teacher',
        description: 'Teachers can create courses, grade assignments, and manage students',
        isSystem: true,
        metadata: {
            category: 'education',
            priority: 2,
            capabilities: ['create_courses', 'grade_assignments', 'manage_students', 'view_analytics']
        }
    },
    {
        name: 'parent',
        displayName: 'Parent',
        description: 'Parents can view their children\'s progress and reports',
        isSystem: true,
        metadata: {
            category: 'education',
            priority: 3,
            capabilities: ['view_child_progress', 'receive_reports', 'view_achievements']
        }
    },
    {
        name: 'education_admin',
        displayName: 'Education Administrator',
        description: 'Full access to educational platform management',
        isSystem: true,
        metadata: {
            category: 'education',
            priority: 4,
            capabilities: ['manage_all_courses', 'manage_users', 'view_all_analytics', 'system_configuration']
        }
    }
];

// Educational permissions
export const educationalPermissions: NewPermission[] = [
    // Course Management
    {
        code: 'course:view',
        name: 'View Courses',
        description: 'View available courses and course content',
        category: 'education'
    },
    {
        code: 'course:create',
        name: 'Create Courses',
        description: 'Create new courses and educational content',
        category: 'education'
    },
    {
        code: 'course:edit',
        name: 'Edit Courses',
        description: 'Edit existing courses and content',
        category: 'education'
    },
    {
        code: 'course:delete',
        name: 'Delete Courses',
        description: 'Delete courses and educational content',
        category: 'education'
    },
    {
        code: 'course:enroll',
        name: 'Enroll in Courses',
        description: 'Enroll in available courses',
        category: 'education'
    },

    // Assessment Management
    {
        code: 'assessment:view',
        name: 'View Assessments',
        description: 'View and take assessments',
        category: 'assessment'
    },
    {
        code: 'assessment:create',
        name: 'Create Assessments',
        description: 'Create new assessments and rubrics',
        category: 'assessment'
    },
    {
        code: 'assessment:grade',
        name: 'Grade Assessments',
        description: 'Grade student submissions',
        category: 'assessment'
    },
    {
        code: 'assessment:submit',
        name: 'Submit Assessments',
        description: 'Submit assessment responses',
        category: 'assessment'
    },

    // Progress and Analytics
    {
        code: 'progress:view_own',
        name: 'View Own Progress',
        description: 'View personal learning progress',
        category: 'progress'
    },
    {
        code: 'progress:view_others',
        name: 'View Others Progress',
        description: 'View progress of students/children',
        category: 'progress'
    },
    {
        code: 'analytics:view_class',
        name: 'View Class Analytics',
        description: 'View analytics for managed classes',
        category: 'analytics'
    },
    {
        code: 'analytics:view_all',
        name: 'View All Analytics',
        description: 'View system-wide analytics',
        category: 'analytics'
    },

    // Maker Workbench
    {
        code: 'maker:use_workbench',
        name: 'Use Maker Workbench',
        description: 'Access maker workbench tools',
        category: 'maker'
    },
    {
        code: 'maker:deploy_code',
        name: 'Deploy Code to Hardware',
        description: 'Deploy code to physical devices',
        category: 'maker'
    },
    {
        code: 'maker:manage_devices',
        name: 'Manage Devices',
        description: 'Add and configure hardware devices',
        category: 'maker'
    },

    // AI Tutor
    {
        code: 'ai_tutor:access',
        name: 'Access AI Tutor',
        description: 'Interact with AI tutoring system',
        category: 'ai_tutor'
    },
    {
        code: 'ai_tutor:configure',
        name: 'Configure AI Tutor',
        description: 'Configure AI tutor settings and prompts',
        category: 'ai_tutor'
    }
];

// Role-Permission mappings
export const educationalRolePermissions = [
    // Student permissions
    {
        roleName: 'student',
        permissions: [
            'course:view',
            'course:enroll',
            'assessment:view',
            'assessment:submit',
            'progress:view_own',
            'maker:use_workbench',
            'maker:deploy_code',
            'ai_tutor:access'
        ]
    },

    // Teacher permissions
    {
        roleName: 'teacher',
        permissions: [
            'course:view',
            'course:create',
            'course:edit',
            'assessment:view',
            'assessment:create',
            'assessment:grade',
            'progress:view_others',
            'analytics:view_class',
            'maker:use_workbench',
            'maker:manage_devices',
            'ai_tutor:access',
            'ai_tutor:configure'
        ]
    },

    // Parent permissions
    {
        roleName: 'parent',
        permissions: [
            'course:view',
            'progress:view_others',
            'ai_tutor:access'
        ]
    },

    // Education Admin permissions
    {
        roleName: 'education_admin',
        permissions: [
            'course:view',
            'course:create',
            'course:edit',
            'course:delete',
            'assessment:view',
            'assessment:create',
            'assessment:grade',
            'progress:view_own',
            'progress:view_others',
            'analytics:view_class',
            'analytics:view_all',
            'maker:use_workbench',
            'maker:deploy_code',
            'maker:manage_devices',
            'ai_tutor:access',
            'ai_tutor:configure'
        ]
    }
];

// Helper function to seed educational roles and permissions
export async function seedEducationalRoles(db: any) {
    try {
        // Insert roles
        const insertedRoles = await db.insert(roles)
            .values(educationalRoles)
            .onConflictDoNothing()
            .returning();

        // Insert permissions
        const insertedPermissions = await db.insert(permissions)
            .values(educationalPermissions)
            .onConflictDoNothing()
            .returning();

        // Create role-permission mappings
        const rolePermissionMappings: NewRolePermission[] = [];

        for (const mapping of educationalRolePermissions) {
            const role = insertedRoles.find(r => r.name === mapping.roleName);
            if (!role) continue;

            for (const permissionCode of mapping.permissions) {
                const permission = insertedPermissions.find(p => p.code === permissionCode);
                if (permission) {
                    rolePermissionMappings.push({
                        roleId: role.id,
                        permissionId: permission.id
                    });
                }
            }
        }

        // Insert role-permission mappings
        await db.insert(rolePermissions)
            .values(rolePermissionMappings)
            .onConflictDoNothing();

        console.log('Educational roles and permissions seeded successfully');
        return { roles: insertedRoles, permissions: insertedPermissions };

    } catch (error) {
        console.error('Error seeding educational roles:', error);
        throw error;
    }
}