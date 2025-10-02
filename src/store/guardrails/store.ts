/**
 * Educational Guardrails Zustand Store
 * 
 * State management for guardrail monitoring, safety settings, and user controls
 */

import { StateCreator } from 'zustand';
import { devtools , subscribeWithSelector } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import { GuardrailViolation, GuardrailContext } from '@/lib/guardrails';

// State interfaces
export interface GuardrailSettings {
    allowedTopics: string[];
    blockedTopics: string[];
    maxDailyInteractions: number;
    notificationPreferences: {
        emailNotifications: boolean;
        inAppNotifications: boolean;
        smsNotifications: boolean;
    };
    requireParentalApproval: boolean;
    strictMode: boolean;
}

export interface SafetyStatus {
    blockedAttempts: number; 
    consecutiveViolations: number;
    lastViolation?: Date;
    safetyScore: number;
    // 0-100
    totalInteractions: number;
    violationsThisMonth: number;
    violationsThisWeek: number;
}

export interface GuardrailInteraction {
    id: string;
    responseFiltered: boolean;
    studentGrade?: string;
    subject?: string;
    timestamp: Date;
    userRole: string;
    violations: GuardrailViolation[];
    wasBlocked: boolean;
}

// State slices
interface GuardrailState {
    // Current session
    currentContext: GuardrailContext | null;

    isLoadingSafetyStatus: boolean;
    // Loading states
    isUpdatingSettings: boolean;

    recentInteractions: GuardrailInteraction[];
    // Safety monitoring
    safetyStatus: SafetyStatus;

    selectedInteraction: GuardrailInteraction | null;
    sessionViolations: GuardrailViolation[];
    // Settings
    settings: GuardrailSettings;

    // UI state
    showSafetyDashboard: boolean;
    showViolationDetails: boolean;
}

interface GuardrailActions {
    clearCurrentContext: () => void;
    clearViolations: () => void;

    hideSafetyDetails: () => void;
    // Safety monitoring
    recordInteraction: (interaction: Omit<GuardrailInteraction, 'id' | 'timestamp'>) => void;
    refreshSafetyStatus: () => Promise<void>;

    reportSafetyIncident: (incidentType: string, description: string) => Promise<void>;
    resetSettingsToDefault: () => void;

    showInteractionDetails: (interaction: GuardrailInteraction) => void;
    // UI actions
    toggleSafetyDashboard: () => void;
    // Emergency actions
    triggerEmergencyMode: () => void;

    // Context management
    updateCurrentContext: (context: GuardrailContext) => void;
    // Settings management
    updateSettings: (settings: Partial<GuardrailSettings>) => void;
}

// Default state
const defaultSettings: GuardrailSettings = {
    allowedTopics: [
        'mathematics', 'science', 'reading', 'writing', 'history', 'geography',
        'art', 'music', 'physical education', 'computer science', 'languages'
    ],
    blockedTopics: [],
    maxDailyInteractions: 50,
    notificationPreferences: {
        emailNotifications: true,
        inAppNotifications: true,
        smsNotifications: false
    },
    requireParentalApproval: false,
    strictMode: true
};

const defaultSafetyStatus: SafetyStatus = {
    blockedAttempts: 0,
    consecutiveViolations: 0,
    safetyScore: 100,
    totalInteractions: 0,
    violationsThisMonth: 0,
    violationsThisWeek: 0
};

const initialState: GuardrailState = {
    currentContext: null,
    isLoadingSafetyStatus: false,
    isUpdatingSettings: false,
    recentInteractions: [],
    safetyStatus: defaultSafetyStatus,
    selectedInteraction: null,
    sessionViolations: [],
    settings: defaultSettings,
    showSafetyDashboard: false,
    showViolationDetails: false
};

// Actions implementation
const createGuardrailActions: StateCreator<
    GuardrailState & GuardrailActions,
    [],
    [],
    GuardrailActions
> = (set, get) => ({
    
    clearCurrentContext: () => {
        set({ currentContext: null });
    },

    

clearViolations: () => {
        set((state) => ({
            safetyStatus: {
                ...state.safetyStatus,
                consecutiveViolations: 0
            },
            sessionViolations: []
        }));
    },

    
    


hideSafetyDetails: () => {
        set({
            selectedInteraction: null,
            showViolationDetails: false
        });
    },

    

// Safety monitoring
recordInteraction: (interactionData) => {
        const interaction: GuardrailInteraction = {
            ...interactionData,
            id: `interaction_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
            timestamp: new Date()
        };

        set((state) => {
            const updatedInteractions = [interaction, ...state.recentInteractions].slice(0, 100);
            const hasViolations = interaction.violations.length > 0;

            // Update safety status
            const updatedSafetyStatus: SafetyStatus = {
                ...state.safetyStatus,
                consecutiveViolations: hasViolations
                    ? state.safetyStatus.consecutiveViolations + 1
                    : 0,
                blockedAttempts: interaction.wasBlocked
                    ? state.safetyStatus.blockedAttempts + 1
                    : state.safetyStatus.blockedAttempts,
                totalInteractions: state.safetyStatus.totalInteractions + 1,
                lastViolation: hasViolations ? new Date() : state.safetyStatus.lastViolation,
                violationsThisMonth: hasViolations
                    ? state.safetyStatus.violationsThisMonth + 1
                    : state.safetyStatus.violationsThisMonth,
                safetyScore: Math.max(0, 100 - (state.safetyStatus.violationsThisWeek * 5)),
                violationsThisWeek: hasViolations
                    ? state.safetyStatus.violationsThisWeek + 1
                    : state.safetyStatus.violationsThisWeek
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
                isLoadingSafetyStatus: false,
                safetyStatus: mockUpdatedStatus
            });

        } catch (error) {
            console.error('Failed to refresh safety status:', error);
            set({ isLoadingSafetyStatus: false });
        }
    },

    
    
reportSafetyIncident: async (incidentType, description) => {
        try {
            // Simulate API call to report incident
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Safety incident reported:', { description, incidentType });

            // Record as high-severity interaction
            get().recordInteraction({
                studentGrade: get().currentContext?.studentGrade,
                responseFiltered: true,
                subject: get().currentContext?.courseSubject,
                userRole: get().currentContext?.userRole || 'unknown',
                violations: [{
                    message: `Reported incident: ${incidentType}`,
                    severity: 'high',
                    requiresHumanReview: true,
                    type: 'safety_incident',
                    suggestedAction: 'immediate_review'
                }],
                wasBlocked: true
            });

        } catch (error) {
            console.error('Failed to report safety incident:', error);
        }
    },

    

resetSettingsToDefault: () => {
        set((state) => ({
            settings: defaultSettings
        }));
    },

    
    

showInteractionDetails: (interaction) => {
        set({
            selectedInteraction: interaction,
            showViolationDetails: true
        });
    },

    


// UI actions
toggleSafetyDashboard: () => {
        set((state) => ({
            showSafetyDashboard: !state.showSafetyDashboard
        }));
    },

    



// Emergency actions
triggerEmergencyMode: () => {
        set((state) => ({
            sessionViolations: [],
            settings: {
                ...state.settings,
                maxDailyInteractions: 10,
                requireParentalApproval: true,
                strictMode: true
            }
        }));

        // In production, this would trigger immediate notifications
        console.warn('EMERGENCY SAFETY MODE ACTIVATED');
    },

    
    


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

    
// Context management
updateCurrentContext: (context) => {
        set({ currentContext: context });
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

    
    // High-severity violations
getHighSeverityViolations: (state: GuardrailState & GuardrailActions) => {
        return state.recentInteractions
            .filter(interaction =>
                interaction.violations.some(v => v.severity === 'high')
            )
            .slice(0, 5);
    },

    
    // Recent violations
getRecentViolations: (state: GuardrailState & GuardrailActions) => {
        return state.recentInteractions
            .filter(interaction => interaction.violations.length > 0)
            .slice(0, 10);
    },

    // Settings validation
    getSettingsStatus: (state: GuardrailState & GuardrailActions) => {
        const { settings } = state;

        return {
            hasCustomTopicRestrictions: settings.blockedTopics.length > 0,
            hasInteractionLimits: settings.maxDailyInteractions < 100,
            isStrictModeEnabled: settings.strictMode,
            notificationsEnabled: Object.values(settings.notificationPreferences).some(Boolean),
            requiresParentalApproval: settings.requireParentalApproval
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
    getHighSeverityViolations: () => useGuardrailStore(selectors.getHighSeverityViolations),
    getRecentViolations: () => useGuardrailStore(selectors.getRecentViolations),
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