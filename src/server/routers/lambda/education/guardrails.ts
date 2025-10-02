/**
 * Educational Guardrails tRPC Router
 * 
 * Integrates guardrail system with existing tRPC infrastructure
 */

import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { authedProcedure, router } from '@/libs/trpc/lambda';
import {
    GuardrailMiddleware,
    createGuardrailContext,
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
    strictMode: z.boolean().optional(),
    allowedTopics: z.array(z.string()).optional(),
    blockedTopics: z.array(z.string()).optional(),
    maxDailyInteractions: z.number().min(1).max(1000).optional(),
    requireParentalApproval: z.boolean().optional(),
    notificationPreferences: z.object({
        emailNotifications: z.boolean().optional(),
        smsNotifications: z.boolean().optional(),
        inAppNotifications: z.boolean().optional()
    }).optional()
});

const reportIncidentSchema = z.object({
    incidentType: z.enum(['inappropriate_content', 'safety_concern', 'bullying', 'technical_issue']),
    description: z.string().min(10).max(1000),
    severity: z.enum(['low', 'medium', 'high']).default('medium'),
    additionalData: z.record(z.any()).optional()
});

export const guardrailsRouter = router({
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
                if (!allowedRoles.includes(user.role || '')) {
                    // Students can only view their own basic status
                    if (user.role === 'student' && (!input.studentId || input.studentId !== user.id)) {
                        throw new TRPCError({
                            code: 'FORBIDDEN',
                            message: 'Students can only view their own safety status'
                        });
                    }
                }

                const targetUserId = input.studentId || user.id;

                // Mock implementation - in production, this would query the database
                const mockStatus = {
                    userId: targetUserId,
                    timeframe: input.timeframe,
                    safetyScore: 95,
                    totalInteractions: 142,
                    violations: {
                        total: 3,
                        high: 0,
                        medium: 1,
                        low: 2
                    },
                    consecutiveViolations: 0,
                    blockedAttempts: 1,
                    lastActivity: new Date().toISOString(),
                    topActiveSubjects: ['mathematics', 'science', 'reading'],
                    safetyTrends: {
                        improvingAreas: ['question appropriateness', 'topic adherence'],
                        concernAreas: []
                    },
                    parentalNotifications: 0,
                    emergencyIncidents: 0
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
     * Get detailed violation history for analysis
     */
    getViolationHistory: authedProcedure
        .input(z.object({
            studentId: z.string().optional(),
            limit: z.number().min(1).max(100).default(20),
            severity: z.enum(['low', 'medium', 'high']).optional()
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
                        id: 'v1',
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
                        violationType: 'inappropriate_content',
                        severity: 'medium' as const,
                        message: 'Question contained age-inappropriate language',
                        context: 'Mathematics tutoring session',
                        resolved: true,
                        action: 'Content filtered and alternative provided'
                    },
                    {
                        id: 'v2',
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
                        violationType: 'age_restricted',
                        severity: 'low' as const,
                        message: 'Asked about advanced topic beyond grade level',
                        context: 'Science exploration',
                        resolved: true,
                        action: 'Redirected to age-appropriate alternatives'
                    }
                ].filter(v => !input.severity || v.severity === input.severity)
                    .slice(0, input.limit);

                return {
                    violations: mockViolations,
                    totalCount: mockViolations.length,
                    hasMore: false
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
                    userId: user.id,
                    strictMode: input.strictMode ?? true,
                    allowedTopics: input.allowedTopics ?? ['mathematics', 'science', 'reading'],
                    blockedTopics: input.blockedTopics ?? [],
                    maxDailyInteractions: input.maxDailyInteractions ?? 50,
                    requireParentalApproval: input.requireParentalApproval ?? false,
                    notificationPreferences: {
                        emailNotifications: input.notificationPreferences?.emailNotifications ?? true,
                        smsNotifications: input.notificationPreferences?.smsNotifications ?? false,
                        inAppNotifications: input.notificationPreferences?.inAppNotifications ?? true
                    },
                    updatedAt: new Date().toISOString()
                };

                return updatedSettings;

            } catch (error) {
                console.error('Settings update error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to update safety settings'
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
                    id: `incident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    reportedBy: user.id,
                    reporterRole: user.role,
                    timestamp: new Date().toISOString(),
                    incidentType: input.incidentType,
                    description: input.description,
                    severity: input.severity,
                    additionalData: input.additionalData,
                    status: 'pending' as const,
                    assignedTo: null,
                    resolution: null
                };

                // For high-severity incidents, trigger immediate alerts
                if (input.severity === 'high') {
                    console.warn('HIGH SEVERITY SAFETY INCIDENT REPORTED:', {
                        incidentId: incident.id,
                        type: input.incidentType,
                        reportedBy: user.id
                    });

                    // In production, this would trigger:
                    // - Immediate notifications to administrators
                    // - Email alerts to parents/guardians
                    // - Escalation workflows
                }

                // Mock saving to database
                console.log('Safety incident reported:', incident);

                return {
                    incidentId: incident.id,
                    status: 'received',
                    message: 'Your safety report has been received and will be reviewed promptly.',
                    estimatedResponseTime: input.severity === 'high' ? '15 minutes' : '24 hours'
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
                    totalUsers: 1247,
                    activeUsers: 892,
                    totalInteractions: 15673,
                    violationsToday: 23,
                    highSeverityViolations: 2,
                    blockedAttempts: 47,
                    averageSafetyScore: 94.2,
                    systemHealth: 'excellent' as const,
                    alertsActive: 1,
                    topViolationTypes: [
                        { type: 'age_restricted', count: 12 },
                        { type: 'inappropriate_content', count: 8 },
                        { type: 'personal_information', count: 3 }
                    ],
                    safetyTrends: {
                        last7Days: [95, 94, 96, 93, 94, 95, 94],
                        improvement: 2.1
                    },
                    emergencyIncidents: 0
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
     * Emergency override - temporarily disable all restrictions
     */
    emergencyOverride: authedProcedure
        .input(z.object({
            reason: z.string().min(20).max(500),
            duration: z.number().min(5).max(120) // minutes
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
                    reason: input.reason,
                    duration: input.duration,
                    timestamp: new Date().toISOString()
                });

                // Mock override activation
                const override = {
                    id: `override_${Date.now()}`,
                    activatedBy: user.id,
                    reason: input.reason,
                    duration: input.duration,
                    activatedAt: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + input.duration * 60 * 1000).toISOString(),
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
        })
});

export default guardrailsRouter;