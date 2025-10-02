/**
 * Educational Components Index
 * 
 * Main export file for all educational UI components
 */

export { default as CourseBrowser } from './CourseBrowser';
export { default as SafetyDashboard } from './SafetyDashboard';
export { default as StudentProgressCards } from './StudentProgressCards';

// Re-export types if needed
export type { CourseBrowserProps } from './CourseBrowser';
export type { SafetyDashboardProps } from './SafetyDashboard';
export type { StudentProgressProps } from './StudentProgressCards';

// Utility functions for educational components
export const educationUtils = {
    
    
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
            '1': 6, '2': 7, '3': 8, '10': 15, '4': 9, '11': 16,
            '5': 10, '12': 17, 'K': 5, '6': 11, '7': 12, '8': 13, '9': 14
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
     * Get safety level color
     */
getSafetyColor: (level: 'safe' | 'caution' | 'restricted'): string => {
        switch (level) {
            case 'safe': { return '#52c41a';
            }
            case 'caution': { return '#faad14';
            }
            case 'restricted': { return '#f5222d';
            }
            default: { return '#d9d9d9';
            }
        }
    },

    
    /**
     * Get appropriate emoji for subject
     */
getSubjectEmoji: (subject: string): string => {
        const subjectEmojis: Record<string, string> = {
            english: '📚',
            history: '🏛️',
            math: '🔢',
            art: '🎨',
            mathematics: '🔢',
            geography: '🗺️',
            reading: '📖',
            'computer science': '💻',
            science: '🔬',
            biology: '🧬',
            chemistry: '⚗️',
            writing: '✍️',
            languages: '🌍',
            music: '🎵',
            'physical education': '⚽',
            physics: '⚛️'
        };

        return subjectEmojis[subject.toLowerCase()] || '📚';
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
            high: ['explicit content', 'graphic violence'],
            middle: ['explicit', 'graphic violence', 'drugs', 'alcohol']
        };

        const terms = inappropriateTerms[category] || [];
        const lowerContent = content.toLowerCase();

        return !terms.some(term => lowerContent.includes(term));
    }
};

// Common educational constants
export const EDUCATION_CONSTANTS = {
    ACHIEVEMENT_RARITIES: [
        { color: '#1890ff', label: 'Common', value: 'common' },
        { color: '#722ed1', label: 'Rare', value: 'rare' },
        { color: '#fa8c16', label: 'Epic', value: 'epic' },
        { color: '#f5222d', label: 'Legendary', value: 'legendary' }
    ],

    DIFFICULTY_LEVELS: [
        { color: '#52c41a', label: 'Beginner', value: 'beginner' },
        { color: '#faad14', label: 'Intermediate', value: 'intermediate' },
        { color: '#f5222d', label: 'Advanced', value: 'advanced' }
    ],

    GRADE_LEVELS: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],

    SAFETY_LEVELS: [
        { color: '#52c41a', icon: '🛡️', label: 'Safe', value: 'safe' },
        { color: '#faad14', icon: '⚠️', label: 'Caution', value: 'caution' },
        { color: '#f5222d', icon: '🚫', label: 'Restricted', value: 'restricted' }
    ],

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
    ]
};