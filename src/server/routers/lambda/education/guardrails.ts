/**
 * Educational Guardrails tRPC Router
 * 
 * Integrates guardrail system with existing tRPC infrastructure
 */

import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { authedProcedure, router } from '@/libs/trpc/lambda';
import {
    initializeGuardrails
} from '@/lib/guardrails';

// Initialize guardrails on module load
const guardrailMiddleware = initializeGuardrails();

// Input schemas
const guardrailStatusSchema = z.object({
    studentId: z.string().optional(),
    timeframe: z.enum(['day', 'week', 'month']).default('week')
});

const updateSettingsSchema = z.object({
    allowedTopics: z.array(z.string()).optional(),
    blockedTopics: z.array(z.string()).optional(),
    maxDailyInteractions: z.number().min(1).max(1000).optional(),
    notificationPreferences: z.object({
        emailNotifications: z.boolean().optional(),
        inAppNotifications: z.boolean().optional(),
        smsNotifications: z.boolean().optional()
    }).optional(),
    requireParentalApproval: z.boolean().optional(),
    strictMode: z.boolean().optional()
});

const reportIncidentSchema = z.object({
    additionalData: z.record(z.any()).optional(),
    description: z.string().min(10).max(1000),
    incidentType: z.enum(['inappropriate_content', 'safety_concern', 'bullying', 'technical_issue']),
    severity: z.enum(['low', 'medium', 'high']).default('medium')
});

export const guardrailsRouter = router({
    
    /**
     * Emergency override - temporarily disable all restrictions
     */
emergencyOverride: authedProcedure
        .input(z.object({
            duration: z.number().min(5).max(120),
            reason: z.string().min(20).max(500) // minutes
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const user = ctx.user;
                if (!user) {
                    throw new TRPCError({
                        code: 'UNAUTHORIZED',
                        message: 'Authentication required'
                    });
                }

                // Only admins can trigger emergency override
                if (user.role !== 'admin') {
                    throw new TRPCError({
                        code: 'FORBIDDEN',
                        message: 'Administrative privileges required for emergency override'
                    });
                }

                // Log emergency override
                console.warn('EMERGENCY OVERRIDE ACTIVATED:', {
                    adminId: user.id,
                    duration: input.duration,
                    reason: input.reason,
                    timestamp: new Date().toISOString()
                });

                // Mock override activation
                const override = {
                    activatedAt: new Date().toISOString(),
                    activatedBy: user.id,
                    duration: input.duration,
                    expiresAt: new Date(Date.now() + input.duration * 60 * 1000).toISOString(),
                    id: `override_${Date.now()}`,
                    reason: input.reason,
                    status: 'active' as const
                };

                return override;

            } catch (error) {
                console.error('Emergency override error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to activate emergency override'
                });
            }
        }),

    
    
/**
     * Get comprehensive guardrail status for monitoring dashboards
     */
getStatus: authedProcedure
        .input(guardrailStatusSchema)
        .query(async ({ input, ctx }) => {
            try {
                const user = ctx.user;
                if (!user) {
                    throw new TRPCError({
                        code: 'UNAUTHORIZED',
                        message: 'Authentication required'
                    });
                }

                // Check permissions - only allow users with appropriate roles
                const allowedRoles = ['parent', 'teacher', 'admin'];
                if (!allowedRoles.includes(user.role || '') && // Students can only view their own basic status
                    user.role === 'student' && (!input.studentId || input.studentId !== user.id)) {
                        throw new TRPCError({
                            code: 'FORBIDDEN',
                            message: 'Students can only view their own safety status'
                        });
                    }

                const targetUserId = input.studentId || user.id;

                // Mock implementation - in production, this would query the database
                const mockStatus = {
                    blockedAttempts: 1,
                    consecutiveViolations: 0,
                    emergencyIncidents: 0,
                    lastActivity: new Date().toISOString(),
                    parentalNotifications: 0,
                    safetyScore: 95,
                    safetyTrends: {
                        concernAreas: [],
                        improvingAreas: ['question appropriateness', 'topic adherence']
                    },
                    timeframe: input.timeframe,
                    topActiveSubjects: ['mathematics', 'science', 'reading'],
                    userId: targetUserId,
                    totalInteractions: 142,
                    violations: {
                        high: 0,
                        low: 2,
                        total: 3,
                        medium: 1
                    }
                };

                return mockStatus;

            } catch (error) {
                console.error('Guardrail status error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to retrieve safety status'
                });
            }
        }),

    
    


/**
     * Get real-time safety metrics for admin dashboard
     */
getSystemMetrics: authedProcedure
        .query(async ({ ctx }) => {
            try {
                const user = ctx.user;
                if (!user) {
                    throw new TRPCError({
                        code: 'UNAUTHORIZED',
                        message: 'Authentication required'
                    });
                }

                // Only admins can view system-wide metrics
                if (user.role !== 'admin') {
                    throw new TRPCError({
                        code: 'FORBIDDEN',
                        message: 'Administrative privileges required'
                    });
                }

                // Mock system metrics
                const systemMetrics = {
                    activeUsers: 892,
                    averageSafetyScore: 94.2,
                    highSeverityViolations: 2,
                    alertsActive: 1,
                    totalInteractions: 15_673,
                    blockedAttempts: 47,
                    totalUsers: 1247,
                    emergencyIncidents: 0,
                    safetyTrends: {
                        improvement: 2.1,
                        last7Days: [95, 94, 96, 93, 94, 95, 94]
                    },
                    violationsToday: 23,
                    systemHealth: 'excellent' as const,
                    topViolationTypes: [
                        { count: 12, type: 'age_restricted' },
                        { count: 8, type: 'inappropriate_content' },
                        { count: 3, type: 'personal_information' }
                    ]
                };

                return systemMetrics;

            } catch (error) {
                console.error('System metrics error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to retrieve system metrics'
                });
            }
        }),

    
    



/**
     * Get detailed violation history for analysis
     */
getViolationHistory: authedProcedure
        .input(z.object({
            limit: z.number().min(1).max(100).default(20),
            severity: z.enum(['low', 'medium', 'high']).optional(),
            studentId: z.string().optional()
        }))
        .query(async ({ input, ctx }) => {
            try {
                const user = ctx.user;
                if (!user) {
                    throw new TRPCError({
                        code: 'UNAUTHORIZED',
                        message: 'Authentication required'
                    });
                }

                // Only teachers, parents, and admins can view violation history
                if (!['teacher', 'parent', 'admin'].includes(user.role || '')) {
                    throw new TRPCError({
                        code: 'FORBIDDEN',
                        message: 'Insufficient permissions to view violation history'
                    });
                }

                // Mock violation history
                const mockViolations = [
                    {
                        action: 'Content filtered and alternative provided',
                        context: 'Mathematics tutoring session',
                        id: 'v1',
                        message: 'Question contained age-inappropriate language',
                        resolved: true,
                        severity: 'medium' as const,
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
                        violationType: 'inappropriate_content'
                    },
                    {
                        action: 'Redirected to age-appropriate alternatives',
                        context: 'Science exploration',
                        id: 'v2',
                        message: 'Asked about advanced topic beyond grade level',
                        resolved: true,
                        severity: 'low' as const,
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
                        violationType: 'age_restricted'
                    }
                ].filter(v => !input.severity || v.severity === input.severity)
                    .slice(0, input.limit);

                return {
                    hasMore: false,
                    totalCount: mockViolations.length,
                    violations: mockViolations
                };

            } catch (error) {
                console.error('Violation history error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to retrieve violation history'
                });
            }
        }),

    
    


/**
     * Report safety incident
     */
reportIncident: authedProcedure
        .input(reportIncidentSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                const user = ctx.user;
                if (!user) {
                    throw new TRPCError({
                        code: 'UNAUTHORIZED',
                        message: 'Authentication required'
                    });
                }

                // Create incident report
                const incident = {
                    description: input.description,
                    additionalData: input.additionalData,
                    id: `incident_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
                    assignedTo: null,
                    incidentType: input.incidentType,
                    reportedBy: user.id,
                    reporterRole: user.role,
                    resolution: null,
                    severity: input.severity,
                    status: 'pending' as const,
                    timestamp: new Date().toISOString()
                };

                // For high-severity incidents, trigger immediate alerts
                if (input.severity === 'high') {
                    console.warn('HIGH SEVERITY SAFETY INCIDENT REPORTED:', {
                        incidentId: incident.id,
                        reportedBy: user.id,
                        type: input.incidentType
                    });

                    // In production, this would trigger:
                    // - Immediate notifications to administrators
                    // - Email alerts to parents/guardians
                    // - Escalation workflows
                }

                // Mock saving to database
                console.log('Safety incident reported:', incident);

                return {
                    estimatedResponseTime: input.severity === 'high' ? '15 minutes' : '24 hours',
                    incidentId: incident.id,
                    message: 'Your safety report has been received and will be reviewed promptly.',
                    status: 'received'
                };

            } catch (error) {
                console.error('Incident report error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to submit safety report'
                });
            }
        }),

    
    
/**
     * Update guardrail settings (parental controls)
     */
updateSettings: authedProcedure
        .input(updateSettingsSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                const user = ctx.user;
                if (!user) {
                    throw new TRPCError({
                        code: 'UNAUTHORIZED',
                        message: 'Authentication required'
                    });
                }

                // Only parents and admins can update settings
                if (!['parent', 'admin'].includes(user.role || '')) {
                    throw new TRPCError({
                        code: 'FORBIDDEN',
                        message: 'Only parents and administrators can update safety settings'
                    });
                }

                // Validate settings
                if (input.maxDailyInteractions && input.maxDailyInteractions < 5) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Minimum daily interactions must be at least 5 for educational continuity'
                    });
                }

                // Mock settings update - in production, this would update the database
                const updatedSettings = {
                    allowedTopics: input.allowedTopics ?? ['mathematics', 'science', 'reading'],
                    blockedTopics: input.blockedTopics ?? [],
                    maxDailyInteractions: input.maxDailyInteractions ?? 50,
                    notificationPreferences: {
                        emailNotifications: input.notificationPreferences?.emailNotifications ?? true,
                        inAppNotifications: input.notificationPreferences?.inAppNotifications ?? true,
                        smsNotifications: input.notificationPreferences?.smsNotifications ?? false
                    },
                    requireParentalApproval: input.requireParentalApproval ?? false,
                    strictMode: input.strictMode ?? true,
                    updatedAt: new Date().toISOString(),
                    userId: user.id
                };

                return updatedSettings;

            } catch (error) {
                console.error('Settings update error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to update safety settings'
                });
            }
        })
});

export default guardrailsRouter;