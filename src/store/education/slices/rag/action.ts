import { StateCreator } from 'zustand/vanilla';

import { trpc } from '@/libs/trpc';
import { EducationStore } from '@/store/education/store';
import { setNamespace } from '@/utils/storeDebug';

import type { EducationStoreState } from '../../initialState';

const n = setNamespace('education-rag');

export interface EducationRAGAction {
    /**
     * 清除搜索结果
     */
    clearSearchResults: () => void;

    /**
     * 创建知识库
     */
    createKnowledgeBase: (params: {
        contentType?: string;
        description?: string;
        difficulty?: string;
        grade: string;
        isPublic?: boolean;
        name: string;
        subject: string;
        tags?: string[];
    }) => Promise<void>;

    /**
     * 删除知识库
     */
    deleteKnowledgeBase: (id: string) => Promise<void>;

    /**
     * 结束AI导师会话
     */
    endTutorSession: (feedback?: {
        comments?: string;
        helpfulVotes: number;
        overallRating: number;
        unhelpfulVotes: number;
    }) => Promise<void>;

    /**
     * 获取知识库列表
     */
    fetchKnowledgeBases: (filters?: {
        difficulty?: string;
        grade?: string;
        isPublic?: boolean;
        subject?: string;
    }) => Promise<void>;

    /**
     * 生成学习路径
     */
    generateLearningPath: (params: {
        currentKnowledge?: string[];
        difficulty?: string;
        targetObjectives: string[];
        timeConstraints?: number;
    }) => Promise<void>;

    /**
     * 获取知识库统计
     */
    getKnowledgeBaseStats: (knowledgeBaseId: string) => Promise<any>;

    /**
     * 获取个性化推荐
     */
    getPersonalizedRecommendations: (params?: {
        courseId?: string;
        limit?: number;
        subject?: string;
    }) => Promise<void>;

    /**
     * 处理教育内容
     */
    processEducationalContent: (params: {
        concepts?: string[];
        content: string;
        contentType?: string;
        courseId?: string;
        difficulty?: string;
        knowledgeBaseId: string;
        prerequisites?: string[];
        learningObjectives?: string[];
        lessonId?: string;
    }) => Promise<void>;

    /**
     * 提供导师反馈
     */
    provideTutorFeedback: (interactionId: string, feedback: {
        comments?: string;
        comprehensionLevel?: string;
        isCorrect?: boolean;
        isHelpful: boolean;
    }) => Promise<void>;

    /**
     * 向AI导师提问
     */
    queryAiTutor: (query: string, context?: string) => Promise<string>;

    /**
     * 语义搜索教育内容
     */
    semanticSearch: (params: {
        concepts?: string[];
        courseId?: string;
        difficulty?: string;
        grade?: string;
        knowledgeBaseIds?: string[];
        lessonId?: string;
        query: string;
        subject?: string;
        limit?: number;
    }) => Promise<void>;

    /**
     * 设置当前活动知识库
     */
    setActiveKnowledgeBase: (id: string) => void;

    /**
     * 开始AI导师会话
     */
    startTutorSession: (params: {
        courseId?: string;
        difficulty?: string;
        knowledgeBaseId?: string;
        lessonId?: string;
        sessionType?: string;
        topic?: string;
        tutorPersonality?: string;
    }) => Promise<void>;

    /**
     * 更新知识库
     */
    updateKnowledgeBase: (id: string, params: Partial<{
        description: string;
        difficulty: string;
        grade: string;
        isPublic: boolean;
        name: string;
        tags: string[];
        subject: string;
    }>) => Promise<void>;

    /**
     * 更新RAG配置
     */
    updateRAGConfig: (config: Partial<EducationStoreState['ragConfig']>) => void;

    /**
     * 验证内容质量
     */
    validateContent: (params: {
        accuracyScore?: number;
        appropriatenessScore?: number;
        chunkId: string;
        clarityScore?: number;
        feedback?: string;
        flaggedIssues?: string[];
        relevanceScore?: number;
        suggestions?: string;
        validationType: 'accuracy' | 'relevance' | 'appropriateness';
    }) => Promise<void>;
}

export const educationRAGSlice: StateCreator<
    EducationStore,
    [['zustand/devtools', never]],
    [],
    EducationRAGAction
> = (set, get) => ({
    clearSearchResults: () => {
        set(
            {
                currentSearchQuery: '',
                searchResults: [],
            },
            false,
            n('clearSearchResults'),
        );
    },

    createKnowledgeBase: async (params) => {
        try {
            const newKB = await trpc.education.rag.createKnowledgeBase.mutate(params);
            const { knowledgeBasesMap } = get();

            set(
                {
                    knowledgeBasesMap: {
                        ...knowledgeBasesMap,
                        [newKB.id]: newKB,
                    },
                },
                false,
                n('createKnowledgeBase/success', newKB.id),
            );
        } catch (error) {
            console.error('Failed to create knowledge base:', error);
        }
    },

    deleteKnowledgeBase: async (id) => {
        try {
            await trpc.education.rag.deleteKnowledgeBase.mutate({ id });
            const { knowledgeBasesMap, activeKnowledgeBaseId } = get();
            const updatedMap = { ...knowledgeBasesMap };
            delete updatedMap[id];

            set(
                {
                    activeKnowledgeBaseId: activeKnowledgeBaseId === id ? undefined : activeKnowledgeBaseId,
                    knowledgeBasesMap: updatedMap,
                },
                false,
                n('deleteKnowledgeBase/success', id),
            );
        } catch (error) {
            console.error('Failed to delete knowledge base:', error);
        }
    },

    endTutorSession: async (feedback) => {
        const { currentTutorSession } = get();
        if (!currentTutorSession) return;

        try {
            // await trpc.education.rag.endTutorSession.mutate({
            //   sessionId: currentTutorSession.id,
            //   feedback,
            // });

            set(
                { currentTutorSession: undefined },
                false,
                n('endTutorSession/success'),
            );
        } catch (error) {
            console.error('Failed to end tutor session:', error);
        }
    },

    fetchKnowledgeBases: async (filters) => {
        const { knowledgeBasesLoading, knowledgeBasesInit } = get();
        if (knowledgeBasesLoading) return;

        set({ knowledgeBasesLoading: true }, false, n('fetchKnowledgeBases/start'));

        try {
            const knowledgeBases = await trpc.education.rag.getKnowledgeBases.query(filters || {});
            const knowledgeBasesMap = knowledgeBases.reduce((acc, kb) => {
                acc[kb.id] = kb;
                return acc;
            }, {} as Record<string, any>);

            set(
                {
                    knowledgeBasesInit: true,
                    knowledgeBasesLoading: false,
                    knowledgeBasesMap,
                },
                false,
                n('fetchKnowledgeBases/success'),
            );
        } catch (error) {
            set({ knowledgeBasesLoading: false }, false, n('fetchKnowledgeBases/error', error));
        }
    },

    getPersonalizedRecommendations: async (params) => {
        try {
            // const recommendations = await trpc.education.rag.getPersonalizedRecommendations.query(params || {});
            // Mock recommendations for now
            const recommendations = [
                {
                    description: 'Explore quantum mechanics and relativity',
                    id: '1',
                    contentType: 'interactive',
                    title: 'Advanced Physics Concepts',
                    concepts: ['quantum mechanics', 'relativity', 'wave-particle duality'],
                    relevanceScore: 0.95,
                    difficulty: 'advanced',
                },
            ];

            set(
                { personalizedRecommendations: recommendations },
                false,
                n('getPersonalizedRecommendations/success'),
            );
        } catch (error) {
            console.error('Failed to get personalized recommendations:', error);
        }
    },

    processEducationalContent: async (params) => {
        try {
            await trpc.education.rag.processContent.mutate(params);
        } catch (error) {
            console.error('Failed to process educational content:', error);
        }
    },

    generateLearningPath: async (params) => {
        try {
            // const learningPath = await trpc.education.rag.generateLearningPath.mutate(params);
            // Mock learning path for now
            const learningPath = {
                id: 'path_1',
                difficulty: params.difficulty || 'beginner',
                steps: [
                    {
                        id: 'step_1',
                        description: 'Learn the basic concepts required',
                        title: 'Foundation Concepts',
                        estimatedTime: 30,
                        prerequisites: [],
                        resources: ['kb_1', 'kb_2'],
                    },
                ],
                estimatedDuration: 120,
                targetObjectives: params.targetObjectives,
            };

            set(
                { learningPath },
                false,
                n('generateLearningPath/success'),
            );
        } catch (error) {
            console.error('Failed to generate learning path:', error);
        }
    },

    provideTutorFeedback: async (interactionId, feedback) => {
        try {
            // await trpc.education.rag.provideTutorFeedback.mutate({
            //   interactionId,
            //   ...feedback,
            // });
        } catch (error) {
            console.error('Failed to provide tutor feedback:', error);
        }
    },

    getKnowledgeBaseStats: async (knowledgeBaseId) => {
        try {
            const stats = await trpc.education.rag.getKnowledgeBaseStats.query({ knowledgeBaseId });
            return stats;
        } catch (error) {
            console.error('Failed to get knowledge base stats:', error);
            return null;
        }
    },

    semanticSearch: async (params) => {
        set({ currentSearchQuery: params.query, searchLoading: true }, false, n('semanticSearch/start'));

        try {
            const results = await trpc.education.rag.semanticSearch.mutate(params);
            const searchResults = results.map((result: any) => ({
                id: result.chunk.id,
                similarity: result.similarity,
                text: result.chunk.text,
                concepts: result.chunk.concepts,
                courseId: result.chunk.courseId,
                learningObjectives: result.chunk.learningObjectives,
                lessonId: result.chunk.lessonId,
            }));

            set(
                {
                    searchLoading: false,
                    searchResults,
                },
                false,
                n('semanticSearch/success'),
            );
        } catch (error) {
            set({ searchLoading: false }, false, n('semanticSearch/error', error));
        }
    },

    queryAiTutor: async (query, context) => {
        const { currentTutorSession } = get();

        try {
            const response = await trpc.education.rag.queryAiTutor.mutate({
                context,
                query,
                difficulty: currentTutorSession?.difficulty,
                sessionId: currentTutorSession?.id,
                tutorPersonality: currentTutorSession?.tutorPersonality || 'encouraging',
            });

            // Update current session with new interaction
            if (currentTutorSession && response.interaction) {
                const updatedSession = {
                    ...currentTutorSession,
                    interactions: [...currentTutorSession.interactions, response.interaction],
                };

                set(
                    { currentTutorSession: updatedSession },
                    false,
                    n('queryAiTutor/success'),
                );
            }

            return response.response;
        } catch (error) {
            console.error('Failed to query AI tutor:', error);
            return 'I apologize, but I encountered an error. Please try again.';
        }
    },

    updateKnowledgeBase: async (id, params) => {
        try {
            const updatedKB = await trpc.education.rag.updateKnowledgeBase.mutate({ id, ...params });
            const { knowledgeBasesMap } = get();

            set(
                {
                    knowledgeBasesMap: {
                        ...knowledgeBasesMap,
                        [id]: updatedKB,
                    },
                },
                false,
                n('updateKnowledgeBase/success', id),
            );
        } catch (error) {
            console.error('Failed to update knowledge base:', error);
        }
    },

    setActiveKnowledgeBase: (id) => {
        set({ activeKnowledgeBaseId: id }, false, n('setActiveKnowledgeBase', id));
    },

    startTutorSession: async (params) => {
        try {
            const session = await trpc.education.rag.startTutorSession.mutate(params);
            const { tutorSessionHistory } = get();

            set(
                {
                    currentTutorSession: {
                        courseId: session.courseId,
                        difficulty: session.difficulty,
                        id: session.id,
                        lessonId: session.lessonId,
                        status: session.status,
                        interactions: [],
                        topic: session.topic,
                        startedAt: session.startedAt,
                        tutorPersonality: session.tutorPersonality,
                    },
                    tutorSessionHistory: [session.id, ...tutorSessionHistory],
                },
                false,
                n('startTutorSession/success', session.id),
            );
        } catch (error) {
            console.error('Failed to start tutor session:', error);
        }
    },

    updateRAGConfig: (config) => {
        const { ragConfig } = get();
        set(
            { ragConfig: { ...ragConfig, ...config } },
            false,
            n('updateRAGConfig', config),
        );
    },

    validateContent: async (params) => {
        try {
            const validation = await trpc.education.rag.validateContent.mutate(params);
            const { contentValidationMap } = get();

            set(
                {
                    contentValidationMap: {
                        ...contentValidationMap,
                        [params.chunkId]: {
                            feedback: validation.feedback,
                            overallScore: validation.overallScore,
                            status: validation.status,
                            validatedAt: validation.validatedAt,
                            validatorId: validation.validatorId,
                        },
                    },
                },
                false,
                n('validateContent/success', params.chunkId),
            );
        } catch (error) {
            console.error('Failed to validate content:', error);
        }
    },
});