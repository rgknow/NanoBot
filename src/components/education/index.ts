/**
 * Educational Components Index
 * 
 * Main export file for all educational UI components
 */

export { default as SafetyDashboard } from './SafetyDashboard';
export { default as CourseBrowser } from './CourseBrowser';
export { default as StudentProgressCards } from './StudentProgressCards';

// Re-export types if needed
export type { SafetyDashboardProps } from './SafetyDashboard';
export type { CourseBrowserProps } from './CourseBrowser';
export type { StudentProgressProps } from './StudentProgressCards';

// Utility functions for educational components
export const educationUtils = {
    /**
     * Get appropriate emoji for subject
     */
    getSubjectEmoji: (subject: string): string => {
        const subjectEmojis: Record<string, string> = {
            mathematics: '🔢',
            math: '🔢',
            science: '🔬',
            english: '📚',
            reading: '📖',
            writing: '✍️',
            history: '🏛️',
            geography: '🗺️',
            art: '🎨',
            music: '🎵',
            'physical education': '⚽',
            'computer science': '💻',
            languages: '🌍',
            biology: '🧬',
            chemistry: '⚗️',
            physics: '⚛️'
        };

        return subjectEmojis[subject.toLowerCase()] || '📚';
    },

    /**
     * Get safety level color
     */
    getSafetyColor: (level: 'safe' | 'caution' | 'restricted'): string => {
        switch (level) {
            case 'safe': return '#52c41a';
            case 'caution': return '#faad14';
            case 'restricted': return '#f5222d';
            default: return '#d9d9d9';
        }
    },

    /**
     * Format time duration
     */
    formatDuration: (minutes: number): string => {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    },

    /**
     * Calculate age from grade level
     */
    getAgeFromGrade: (grade: string): number => {
        const gradeToAge: Record<string, number> = {
            'K': 5, '1': 6, '2': 7, '3': 8, '4': 9, '5': 10,
            '6': 11, '7': 12, '8': 13, '9': 14, '10': 15, '11': 16, '12': 17
        };
        return gradeToAge[grade] || 10;
    },

    /**
     * Get grade level category
     */
    getGradeCategory: (grade: string): 'elementary' | 'middle' | 'high' => {
        const gradeNum = grade === 'K' ? 0 : parseInt(grade);
        if (gradeNum <= 5) return 'elementary';
        if (gradeNum <= 8) return 'middle';
        return 'high';
    },

    /**
     * Validate content for grade appropriateness
     */
    isContentAppropriate: (content: string, grade: string): boolean => {
        const age = educationUtils.getAgeFromGrade(grade);
        const category = educationUtils.getGradeCategory(grade);

        // Basic content filtering based on age
        const inappropriateTerms = {
            elementary: ['violence', 'death', 'war', 'drugs', 'alcohol'],
            middle: ['explicit', 'graphic violence', 'drugs', 'alcohol'],
            high: ['explicit content', 'graphic violence']
        };

        const terms = inappropriateTerms[category] || [];
        const lowerContent = content.toLowerCase();

        return !terms.some(term => lowerContent.includes(term));
    }
};

// Common educational constants
export const EDUCATION_CONSTANTS = {
    GRADE_LEVELS: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],

    SUBJECTS: [
        'Mathematics',
        'Science',
        'English',
        'History',
        'Geography',
        'Art',
        'Music',
        'Physical Education',
        'Computer Science',
        'Foreign Languages'
    ],

    DIFFICULTY_LEVELS: [
        { value: 'beginner', label: 'Beginner', color: '#52c41a' },
        { value: 'intermediate', label: 'Intermediate', color: '#faad14' },
        { value: 'advanced', label: 'Advanced', color: '#f5222d' }
    ],

    ACHIEVEMENT_RARITIES: [
        { value: 'common', label: 'Common', color: '#1890ff' },
        { value: 'rare', label: 'Rare', color: '#722ed1' },
        { value: 'epic', label: 'Epic', color: '#fa8c16' },
        { value: 'legendary', label: 'Legendary', color: '#f5222d' }
    ],

    SAFETY_LEVELS: [
        { value: 'safe', label: 'Safe', color: '#52c41a', icon: '🛡️' },
        { value: 'caution', label: 'Caution', color: '#faad14', icon: '⚠️' },
        { value: 'restricted', label: 'Restricted', color: '#f5222d', icon: '🚫' }
    ]
};