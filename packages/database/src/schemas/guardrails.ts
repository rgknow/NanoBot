/**
 * Educational Guardrails Database Schema
 * 
 * Simplified database tables for LLM safety monitoring and guardrail enforcement
 * Note: This is a conceptual schema - actual implementation would depend on the database setup
 */

// Guardrail Settings Table Schema
export interface GuardrailSettingsSchema {
    id: string;
    userId: string;

    // Safety configuration
    strictMode: boolean;
    allowedTopics: string[];
    blockedTopics: string[];
    maxDailyInteractions: number;
    requireParentalApproval: boolean;

    // Notification preferences
    notificationPreferences: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        inAppNotifications: boolean;
    };

    // Age-specific overrides
    gradeLevel?: string;
    customContentFilters?: Record<string, any>;

    createdAt: Date;
    updatedAt: Date;
}

// Guardrail Interactions Table Schema
export interface GuardrailInteractionsSchema {
    id: string;

    // User context
    userId: string;
    sessionId?: string;
    userRole: string;
    studentGrade?: string;

    // Interaction context
    interactionType: string; // 'chat', 'tutor', 'content_generation'
    courseSubject?: string;
    academicLevel?: string;

    // Request and response data (anonymized)
    requestHash?: string; // Hash of request for pattern analysis
    responseLength?: number;
    modelUsed?: string;
    tokensUsed?: number;

    // Safety analysis results
    guardrailsPassed: boolean;
    wasFiltered: boolean;
    wasBlocked: boolean;

    // Processing metadata
    processingTimeMs?: number;

    createdAt: Date;
}

// Guardrail Violations Table Schema
export interface GuardrailViolationsSchema {
    id: string;

    // Link to interaction
    interactionId: string;

    // Violation details
    violationType: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
    suggestedAction?: string;
    requiresHumanReview: boolean;

    // Content analysis (anonymized)
    violationPattern?: string;
    confidence?: number; // 0-100

    // Resolution tracking
    reviewStatus: string;
    reviewedBy?: string;
    reviewedAt?: Date;
    resolution?: string;

    createdAt: Date;
}

// Safety Incidents Table Schema
export interface SafetyIncidentsSchema {
    id: string;

    // Reporter information
    reportedBy: string;
    reporterRole: string;

    // Incident details
    incidentType: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    additionalData?: Record<string, any>;

    // Related data
    relatedUserId?: string;
    relatedInteractionId?: string;

    // Incident management
    status: string;
    priority: string;
    assignedTo?: string;

    // Resolution
    resolution?: string;
    resolvedAt?: Date;
    escalatedAt?: Date;

    // Notifications sent
    parentNotified: boolean;
    parentNotifiedAt?: Date;
    adminNotified: boolean;
    adminNotifiedAt?: Date;

    createdAt: Date;
    updatedAt: Date;
}

// Emergency Overrides Table Schema
export interface EmergencyOverridesSchema {
    id: string;

    // Override details
    activatedBy: string;
    reason: string;
    duration: number; // minutes

    // Scope
    affectedUsers?: string[];
    overrideType: string; // 'global', 'user_specific', 'content_type'

    // Status
    status: string;

    // Timestamps
    activatedAt: Date;
    expiresAt: Date;
    deactivatedAt?: Date;
    deactivatedBy?: string;
}

// Safety Metrics Summary Table Schema
export interface SafetyMetricsSummarySchema {
    id: string;

    // Time period
    date: Date;
    period: 'hour' | 'day' | 'week' | 'month';

    // User context
    userId?: string;
    userRole?: string;
    gradeLevel?: string;

    // Metrics
    totalInteractions: number;
    safeInteractions: number;
    violationsCount: number;
    highSeverityViolations: number;
    blockedAttempts: number;

    // Calculated fields
    safetyScore?: number; // 0-100
    averageResponseTime?: number;

    createdAt: Date;
}

// Export schemas for use in application
export const GuardrailSchemas = {
    GuardrailSettingsSchema,
    GuardrailInteractionsSchema,
    GuardrailViolationsSchema,
    SafetyIncidentsSchema,
    EmergencyOverridesSchema,
    SafetyMetricsSummarySchema,
} as const;

// SQL Migration Scripts (for reference)
export const guardrailMigrations = {
    // Create guardrail_settings table
    createGuardrailSettingsTable: `
    CREATE TABLE IF NOT EXISTS guardrail_settings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      strict_mode BOOLEAN DEFAULT TRUE NOT NULL,
      allowed_topics JSONB DEFAULT '[]' NOT NULL,
      blocked_topics JSONB DEFAULT '[]' NOT NULL,
      max_daily_interactions INTEGER DEFAULT 50 NOT NULL,
      require_parental_approval BOOLEAN DEFAULT FALSE NOT NULL,
      notification_preferences JSONB DEFAULT '{"emailNotifications":true,"smsNotifications":false,"inAppNotifications":true}' NOT NULL,
      grade_level TEXT,
      custom_content_filters JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `,

    // Create guardrail_interactions table
    createGuardrailInteractionsTable: `
    CREATE TABLE IF NOT EXISTS guardrail_interactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      session_id TEXT,
      user_role TEXT NOT NULL,
      student_grade TEXT,
      interaction_type TEXT NOT NULL,
      course_subject TEXT,
      academic_level TEXT,
      request_hash TEXT,
      response_length INTEGER,
      model_used TEXT,
      tokens_used INTEGER,
      guardrails_passed BOOLEAN NOT NULL,
      was_filtered BOOLEAN DEFAULT FALSE NOT NULL,
      was_blocked BOOLEAN DEFAULT FALSE NOT NULL,
      processing_time_ms INTEGER,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `,

    // Create indices for performance
    createIndices: `
    CREATE INDEX IF NOT EXISTS idx_guardrail_interactions_user_id ON guardrail_interactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_guardrail_interactions_created_at ON guardrail_interactions(created_at);
    CREATE INDEX IF NOT EXISTS idx_guardrail_interactions_guardrails_passed ON guardrail_interactions(guardrails_passed);
    CREATE INDEX IF NOT EXISTS idx_guardrail_settings_user_id ON guardrail_settings(user_id);
  `
};