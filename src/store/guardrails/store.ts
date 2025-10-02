/**
 * Educational Guardrails Zustand Store
 * 
 * State management for guardrail monitoring, safety settings, and user controls
 */

import { StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import { subscribeWithSelector } from 'zustand/middleware';
import { GuardrailViolation, GuardrailContext } from '@/lib/guardrails';

// State interfaces
export interface GuardrailSettings {
    strictMode: boolean;
    allowedTopics: string[];
    blockedTopics: string[];
    maxDailyInteractions: number;
    requireParentalApproval: boolean;
    notificationPreferences: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        inAppNotifications: boolean;
    };
}

export interface SafetyStatus {
    safetyScore: number; // 0-100
    totalInteractions: number;
    violationsThisWeek: number;
    violationsThisMonth: number;
    lastViolation?: Date;
    consecutiveViolations: number;
    blockedAttempts: number;
}

export interface GuardrailInteraction {
    id: string;
    timestamp: Date;
    userRole: string;
    studentGrade?: string;
    subject?: string;
    violations: GuardrailViolation[];
    wasBlocked: boolean;
    responseFiltered: boolean;
}

// State slices
interface GuardrailState {
    // Settings
    settings: GuardrailSettings;

    // Safety monitoring
    safetyStatus: SafetyStatus;
    recentInteractions: GuardrailInteraction[];

    // Current session
    currentContext: GuardrailContext | null;
    sessionViolations: GuardrailViolation[];

    // UI state
    showSafetyDashboard: boolean;
    showViolationDetails: boolean;
    selectedInteraction: GuardrailInteraction | null;

    // Loading states
    isUpdatingSettings: boolean;
    isLoadingSafetyStatus: boolean;
}

interface GuardrailActions {
    // Settings management
    updateSettings: (settings: Partial<GuardrailSettings>) => void;
    resetSettingsToDefault: () => void;

    // Safety monitoring
    recordInteraction: (interaction: Omit<GuardrailInteraction, 'id' | 'timestamp'>) => void;
    clearViolations: () => void;
    refreshSafetyStatus: () => Promise<void>;

    // Context management
    updateCurrentContext: (context: GuardrailContext) => void;
    clearCurrentContext: () => void;

    // UI actions
    toggleSafetyDashboard: () => void;
    showInteractionDetails: (interaction: GuardrailInteraction) => void;
    hideSafetyDetails: () => void;

    // Emergency actions
    triggerEmergencyMode: () => void;
    reportSafetyIncident: (incidentType: string, description: string) => Promise<void>;
}

// Default state
const defaultSettings: GuardrailSettings = {
    strictMode: true,
    allowedTopics: [
        'mathematics', 'science', 'reading', 'writing', 'history', 'geography',
        'art', 'music', 'physical education', 'computer science', 'languages'
    ],
    blockedTopics: [],
    maxDailyInteractions: 50,
    requireParentalApproval: false,
    notificationPreferences: {
        emailNotifications: true,
        smsNotifications: false,
        inAppNotifications: true
    }
};

const defaultSafetyStatus: SafetyStatus = {
    safetyScore: 100,
    totalInteractions: 0,
    violationsThisWeek: 0,
    violationsThisMonth: 0,
    consecutiveViolations: 0,
    blockedAttempts: 0
};

const initialState: GuardrailState = {
    settings: defaultSettings,
    safetyStatus: defaultSafetyStatus,
    recentInteractions: [],
    currentContext: null,
    sessionViolations: [],
    showSafetyDashboard: false,
    showViolationDetails: false,
    selectedInteraction: null,
    isUpdatingSettings: false,
    isLoadingSafetyStatus: false
};

// Actions implementation
const createGuardrailActions: StateCreator<
    GuardrailState & GuardrailActions,
    [],
    [],
    GuardrailActions
> = (set, get) => ({
    // Settings management
    updateSettings: (newSettings) => {
        set((state) => ({
            isUpdatingSettings: true
        }));

        // Simulate API call
        setTimeout(() => {
            set((state) => ({
                settings: { ...state.settings, ...newSettings },
                isUpdatingSettings: false
            }));
        }, 500);
    },

    resetSettingsToDefault: () => {
        set((state) => ({
            settings: defaultSettings
        }));
    },

    // Safety monitoring
    recordInteraction: (interactionData) => {
        const interaction: GuardrailInteraction = {
            ...interactionData,
            id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date()
        };

        set((state) => {
            const updatedInteractions = [interaction, ...state.recentInteractions].slice(0, 100);
            const hasViolations = interaction.violations.length > 0;

            // Update safety status
            const updatedSafetyStatus: SafetyStatus = {
                ...state.safetyStatus,
                totalInteractions: state.safetyStatus.totalInteractions + 1,
                violationsThisWeek: hasViolations
                    ? state.safetyStatus.violationsThisWeek + 1
                    : state.safetyStatus.violationsThisWeek,
                violationsThisMonth: hasViolations
                    ? state.safetyStatus.violationsThisMonth + 1
                    : state.safetyStatus.violationsThisMonth,
                lastViolation: hasViolations ? new Date() : state.safetyStatus.lastViolation,
                consecutiveViolations: hasViolations
                    ? state.safetyStatus.consecutiveViolations + 1
                    : 0,
                blockedAttempts: interaction.wasBlocked
                    ? state.safetyStatus.blockedAttempts + 1
                    : state.safetyStatus.blockedAttempts,
                safetyScore: Math.max(0, 100 - (state.safetyStatus.violationsThisWeek * 5))
            };

            return {
                recentInteractions: updatedInteractions,
                safetyStatus: updatedSafetyStatus,
                sessionViolations: hasViolations
                    ? [...state.sessionViolations, ...interaction.violations]
                    : state.sessionViolations
            };
        });
    },

    clearViolations: () => {
        set((state) => ({
            sessionViolations: [],
            safetyStatus: {
                ...state.safetyStatus,
                consecutiveViolations: 0
            }
        }));
    },

    refreshSafetyStatus: async () => {
        set({ isLoadingSafetyStatus: true });

        try {
            // Simulate API call to refresh safety status
            await new Promise(resolve => setTimeout(resolve, 1000));

            // In production, this would fetch from the server
            const mockUpdatedStatus: SafetyStatus = {
                ...get().safetyStatus,
                // Add some mock updates
                safetyScore: Math.max(90, get().safetyStatus.safetyScore + Math.random() * 5 - 2.5)
            };

            set({
                safetyStatus: mockUpdatedStatus,
                isLoadingSafetyStatus: false
            });

        } catch (error) {
            console.error('Failed to refresh safety status:', error);
            set({ isLoadingSafetyStatus: false });
        }
    },

    // Context management
    updateCurrentContext: (context) => {
        set({ currentContext: context });
    },

    clearCurrentContext: () => {
        set({ currentContext: null });
    },

    // UI actions
    toggleSafetyDashboard: () => {
        set((state) => ({
            showSafetyDashboard: !state.showSafetyDashboard
        }));
    },

    showInteractionDetails: (interaction) => {
        set({
            selectedInteraction: interaction,
            showViolationDetails: true
        });
    },

    hideSafetyDetails: () => {
        set({
            showViolationDetails: false,
            selectedInteraction: null
        });
    },

    // Emergency actions
    triggerEmergencyMode: () => {
        set((state) => ({
            settings: {
                ...state.settings,
                strictMode: true,
                maxDailyInteractions: 10,
                requireParentalApproval: true
            },
            sessionViolations: []
        }));

        // In production, this would trigger immediate notifications
        console.warn('EMERGENCY SAFETY MODE ACTIVATED');
    },

    reportSafetyIncident: async (incidentType, description) => {
        try {
            // Simulate API call to report incident
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Safety incident reported:', { incidentType, description });

            // Record as high-severity interaction
            get().recordInteraction({
                userRole: get().currentContext?.userRole || 'unknown',
                studentGrade: get().currentContext?.studentGrade,
                subject: get().currentContext?.courseSubject,
                violations: [{
                    type: 'safety_incident',
                    severity: 'high',
                    message: `Reported incident: ${incidentType}`,
                    suggestedAction: 'immediate_review',
                    requiresHumanReview: true
                }],
                wasBlocked: true,
                responseFiltered: true
            });

        } catch (error) {
            console.error('Failed to report safety incident:', error);
        }
    }
});

// Selectors
const selectors = {
    // Safety metrics
    getCurrentSafetyLevel: (state: GuardrailState & GuardrailActions) => {
        if (state.safetyStatus.safetyScore >= 95) return 'excellent';
        if (state.safetyStatus.safetyScore >= 80) return 'good';
        if (state.safetyStatus.safetyScore >= 60) return 'caution';
        return 'alert';
    },

    // Recent violations
    getRecentViolations: (state: GuardrailState & GuardrailActions) => {
        return state.recentInteractions
            .filter(interaction => interaction.violations.length > 0)
            .slice(0, 10);
    },

    // High-severity violations
    getHighSeverityViolations: (state: GuardrailState & GuardrailActions) => {
        return state.recentInteractions
            .filter(interaction =>
                interaction.violations.some(v => v.severity === 'high')
            )
            .slice(0, 5);
    },

    // Settings validation
    getSettingsStatus: (state: GuardrailState & GuardrailActions) => {
        const { settings } = state;

        return {
            isStrictModeEnabled: settings.strictMode,
            hasCustomTopicRestrictions: settings.blockedTopics.length > 0,
            hasInteractionLimits: settings.maxDailyInteractions < 100,
            requiresParentalApproval: settings.requireParentalApproval,
            notificationsEnabled: Object.values(settings.notificationPreferences).some(Boolean)
        };
    }
};

// Create the store
export const useGuardrailStore = createWithEqualityFn<GuardrailState & GuardrailActions>()(
    subscribeWithSelector(
        devtools(
            (set, get) => ({
                ...initialState,
                ...createGuardrailActions(set, get)
            }),
            {
                name: 'educational-guardrails-store'
            }
        )
    )
);

// Export selectors as hooks
export const useGuardrailSelectors = () => ({
    getCurrentSafetyLevel: () => useGuardrailStore(selectors.getCurrentSafetyLevel),
    getRecentViolations: () => useGuardrailStore(selectors.getRecentViolations),
    getHighSeverityViolations: () => useGuardrailStore(selectors.getHighSeverityViolations),
    getSettingsStatus: () => useGuardrailStore(selectors.getSettingsStatus)
});

// Subscription helpers for monitoring
export const subscribeToSafetyChanges = (callback: (safetyLevel: string) => void) => {
    return useGuardrailStore.subscribe(
        (state) => selectors.getCurrentSafetyLevel(state),
        callback
    );
};

export const subscribeToViolations = (callback: (violations: GuardrailInteraction[]) => void) => {
    return useGuardrailStore.subscribe(
        (state) => selectors.getRecentViolations(state),
        callback
    );
};