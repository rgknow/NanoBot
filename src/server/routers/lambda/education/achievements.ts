import { z } from 'zod';
import { desc, eq, and } from 'drizzle-orm';

import { authedProcedure, router } from '@/libs/trpc/lambda';
import { serverDatabase } from '@/libs/trpc/lambda/middleware';
import {
    achievements,
    userAchievements,
    NewUserAchievement
} from '@/database/schemas/education';

// Achievement management procedures
const achievementProcedure = authedProcedure.use(serverDatabase);

export const achievementsRouter = router({
    
    
// Award achievement to user (typically called by system)
awardAchievement: achievementProcedure
        .input(z.object({
            achievementId: z.string(),
            progress: z.number().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { serverDB, userId } = ctx;

            // Check if user already has this achievement
            const [existingAchievement] = await serverDB
                .select()
                .from(userAchievements)
                .where(and(
                    eq(userAchievements.userId, userId),
                    eq(userAchievements.achievementId, input.achievementId)
                ));

            if (existingAchievement) {
                return existingAchievement;
            }

            // Award the achievement
            const newUserAchievement: NewUserAchievement = {
                achievementId: input.achievementId,
                earnedAt: new Date().toISOString(),
                id: `user_achievement_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
                progress: input.progress || 100,
                userId,
            };

            const [awardedAchievement] = await serverDB
                .insert(userAchievements)
                .values(newUserAchievement)
                .returning();

            return awardedAchievement;
        }),

    
    



// Check and unlock achievements (would be called after user actions)
checkAchievements: achievementProcedure
        .mutation(async ({ ctx }) => {
            const { serverDB, userId } = ctx;

            // This is a simplified version - in a real implementation,
            // this would check various conditions and unlock achievements

            // For now, return empty array (no new achievements)
            return [];
        }),

    
    



// Get achievement progress for incomplete achievements
getAchievementProgress: achievementProcedure
        .query(async ({ ctx }) => {
            const { serverDB, userId } = ctx;

            // This would typically come from a separate achievement_progress table
            // For now, return empty array
            return [];
        }),

    
    


// Get achievement statistics
getAchievementStats: achievementProcedure
        .query(async ({ ctx }) => {
            const { serverDB, userId } = ctx;

            // Get total achievements available
            const totalAchievements = await serverDB
                .select()
                .from(achievements);

            // Get user's earned achievements
            const earnedAchievements = await serverDB
                .select()
                .from(userAchievements)
                .where(eq(userAchievements.userId, userId));

            const totalAvailable = totalAchievements.length;
            const totalEarned = earnedAchievements.length;
            const completionRate = totalAvailable > 0 ? (totalEarned / totalAvailable) * 100 : 0;

            // Calculate points and level (simplified)
            const points = earnedAchievements.reduce((total, achievement) => {
                const achievementData = totalAchievements.find(a => a.id === achievement.achievementId);
                return total + (achievementData?.points || 0);
            }, 0);

            const level = Math.floor(points / 1000) + 1; // 1000 points per level

            return {
                completionRate,
                level,
                points,
                totalAvailable,
                totalEarned,
            };
        }),

    
    



// Get achievements by category
getAchievementsByCategory: achievementProcedure
        .input(z.object({ category: z.string() }))
        .query(async ({ ctx, input }) => {
            const { serverDB } = ctx;

            const categoryAchievements = await serverDB
                .select()
                .from(achievements)
                .where(eq(achievements.category, input.category))
                .orderBy(achievements.title);

            return categoryAchievements;
        }),

    
    


// Get all available achievements
getAllAchievements: achievementProcedure
        .query(async ({ ctx }) => {
            const { serverDB } = ctx;

            const allAchievements = await serverDB
                .select()
                .from(achievements)
                .orderBy(achievements.category, achievements.title);

            return allAchievements;
        }),

    
    
// Get rare achievements
getRareAchievements: achievementProcedure
        .query(async ({ ctx }) => {
            const { serverDB } = ctx;

            const rareAchievements = await serverDB
                .select()
                .from(achievements)
                .where(eq(achievements.rarity, 'legendary'))
                .orderBy(achievements.title);

            return rareAchievements;
        }),

    
    // Get user's earned achievements
getUserAchievements: achievementProcedure
        .query(async ({ ctx }) => {
            const { serverDB, userId } = ctx;

            const userEarnedAchievements = await serverDB
                .select()
                .from(userAchievements)
                .where(eq(userAchievements.userId, userId))
                .orderBy(desc(userAchievements.earnedAt));

            return userEarnedAchievements;
        }),
});