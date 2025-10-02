import { StateCreator } from 'zustand/vanilla';

import { trpc } from '@/libs/trpc';
import { EducationStore } from '@/store/education/store';
import { Action, setNamespace } from '@/utils/storeDebug';

import type { EducationStoreState } from '../../initialState';

const n = setNamespace('education-rag');

export interface EducationRAGAction {
    /**
     * 获取知识库列表
     */
    fetchKnowledgeBases: (filters?: {
        subject?: string;
        grade?: string;
        difficulty?: string;
        isPublic?: boolean;
    }) => Promise<void>;

    /**
     * 创建知识库
     */
    createKnowledgeBase: (params: {
        name: string;
        description?: string;
        subject: string;
        grade: string;
        difficulty?: string;
        contentType?: string;
        tags?: string[];
        isPublic?: boolean;
    }) => Promise<void>;

    /**
     * 更新知识库
     */
    updateKnowledgeBase: (id: string, params: Partial<{
        name: string;
        description: string;
        subject: string;
        grade: string;
        difficulty: string;
        tags: string[];
        isPublic: boolean;
    }>) => Promise<void>;

    /**
     * 删除知识库
     */
    deleteKnowledgeBase: (id: string) => Promise<void>;

    /**
     * 设置当前活动知识库
     */
    setActiveKnowledgeBase: (id: string) => void;

    /**
     * 语义搜索教育内容
     */
    semanticSearch: (params: {
        query: string;
        courseId?: string;
        lessonId?: string;
        subject?: string;
        grade?: string;
        difficulty?: string;
        concepts?: string[];
        knowledgeBaseIds?: string[];
        limit?: number;
    }) => Promise<void>;

    /**
     * 清除搜索结果
     */
    clearSearchResults: () => void;

    /**
     * 开始AI导师会话
     */
    startTutorSession: (params: {
        courseId?: string;
        lessonId?: string;
        knowledgeBaseId?: string;
        tutorPersonality?: string;
        sessionType?: string;
        topic?: string;
        difficulty?: string;
    }) => Promise<void>;

    /**
     * 结束AI导师会话
     */
    endTutorSession: (feedback?: {
        helpfulVotes: number;
        unhelpfulVotes: number;
        overallRating: number;
        comments?: string;
    }) => Promise<void>;

    /**
     * 向AI导师提问
     */
    queryAiTutor: (query: string, context?: string) => Promise<string>;

    /**
     * 提供导师反馈
     */
    provideTutorFeedback: (interactionId: string, feedback: {
        isHelpful: boolean;
        isCorrect?: boolean;
        comprehensionLevel?: string;
        comments?: string;
    }) => Promise<void>;

    /**
     * 处理教育内容
     */
    processEducationalContent: (params: {
        content: string;
        courseId?: string;
        lessonId?: string;
        knowledgeBaseId: string;
        learningObjectives?: string[];
        concepts?: string[];
        prerequisites?: string[];
        difficulty?: string;
        contentType?: string;
    }) => Promise<void>;

    /**
     * 验证内容质量
     */
    validateContent: (params: {
        chunkId: string;
        validationType: 'accuracy' | 'relevance' | 'appropriateness';
        accuracyScore?: number;
        relevanceScore?: number;
        clarityScore?: number;
        appropriatenessScore?: number;
        feedback?: string;
        suggestions?: string;
        flaggedIssues?: string[];
    }) => Promise<void>;

    /**
     * 获取个性化推荐
     */
    getPersonalizedRecommendations: (params?: {
        courseId?: string;
        subject?: string;
        limit?: number;
    }) => Promise<void>;

    /**
     * 生成学习路径
     */
    generateLearningPath: (params: {
        targetObjectives: string[];
        currentKnowledge?: string[];
        difficulty?: string;
        timeConstraints?: number;
    }) => Promise<void>;

    /**
     * 更新RAG配置
     */
    updateRAGConfig: (config: Partial<EducationStoreState['ragConfig']>) => void;

    /**
     * 获取知识库统计
     */
    getKnowledgeBaseStats: (knowledgeBaseId: string) => Promise<any>;
}

export const educationRAGSlice: StateCreator<
    EducationStore,
    [['zustand/devtools', never]],
    [],
    EducationRAGAction
> = (set, get) => ({
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
                    knowledgeBasesMap,
                    knowledgeBasesInit: true,
                    knowledgeBasesLoading: false,
                },
                false,
                n('fetchKnowledgeBases/success'),
            );
        } catch (error) {
            set({ knowledgeBasesLoading: false }, false, n('fetchKnowledgeBases/error', error));
        }
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

    deleteKnowledgeBase: async (id) => {
        try {
            await trpc.education.rag.deleteKnowledgeBase.mutate({ id });
            const { knowledgeBasesMap, activeKnowledgeBaseId } = get();
            const updatedMap = { ...knowledgeBasesMap };
            delete updatedMap[id];

            set(
                {
                    knowledgeBasesMap: updatedMap,
                    activeKnowledgeBaseId: activeKnowledgeBaseId === id ? undefined : activeKnowledgeBaseId,
                },
                false,
                n('deleteKnowledgeBase/success', id),
            );
        } catch (error) {
            console.error('Failed to delete knowledge base:', error);
        }
    },

    setActiveKnowledgeBase: (id) => {
        set({ activeKnowledgeBaseId: id }, false, n('setActiveKnowledgeBase', id));
    },

    semanticSearch: async (params) => {
        set({ searchLoading: true, currentSearchQuery: params.query }, false, n('semanticSearch/start'));

        try {
            const results = await trpc.education.rag.semanticSearch.mutate(params);
            const searchResults = results.map((result: any) => ({
                id: result.chunk.id,
                text: result.chunk.text,
                similarity: result.similarity,
                concepts: result.chunk.concepts,
                learningObjectives: result.chunk.learningObjectives,
                courseId: result.chunk.courseId,
                lessonId: result.chunk.lessonId,
            }));

            set(
                {
                    searchResults,
                    searchLoading: false,
                },
                false,
                n('semanticSearch/success'),
            );
        } catch (error) {
            set({ searchLoading: false }, false, n('semanticSearch/error', error));
        }
    },

    clearSearchResults: () => {
        set(
            {
                searchResults: [],
                currentSearchQuery: '',
            },
            false,
            n('clearSearchResults'),
        );
    },

    startTutorSession: async (params) => {
        try {
            const session = await trpc.education.rag.startTutorSession.mutate(params);
            const { tutorSessionHistory } = get();

            set(
                {
                    currentTutorSession: {
                        id: session.id,
                        courseId: session.courseId,
                        lessonId: session.lessonId,
                        topic: session.topic,
                        difficulty: session.difficulty,
                        tutorPersonality: session.tutorPersonality,
                        status: session.status,
                        startedAt: session.startedAt,
                        interactions: [],
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

    queryAiTutor: async (query, context) => {
        const { currentTutorSession } = get();

        try {
            const response = await trpc.education.rag.queryAiTutor.mutate({
                query,
                sessionId: currentTutorSession?.id,
                context,
                tutorPersonality: currentTutorSession?.tutorPersonality || 'encouraging',
                difficulty: currentTutorSession?.difficulty,
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

    processEducationalContent: async (params) => {
        try {
            await trpc.education.rag.processContent.mutate(params);
        } catch (error) {
            console.error('Failed to process educational content:', error);
        }
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
                            status: validation.status,
                            overallScore: validation.overallScore,
                            feedback: validation.feedback,
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

    getPersonalizedRecommendations: async (params) => {
        try {
            // const recommendations = await trpc.education.rag.getPersonalizedRecommendations.query(params || {});
            // Mock recommendations for now
            const recommendations = [
                {
                    id: '1',
                    title: 'Advanced Physics Concepts',
                    description: 'Explore quantum mechanics and relativity',
                    relevanceScore: 0.95,
                    contentType: 'interactive',
                    difficulty: 'advanced',
                    concepts: ['quantum mechanics', 'relativity', 'wave-particle duality'],
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

    generateLearningPath: async (params) => {
        try {
            // const learningPath = await trpc.education.rag.generateLearningPath.mutate(params);
            // Mock learning path for now
            const learningPath = {
                id: 'path_1',
                targetObjectives: params.targetObjectives,
                steps: [
                    {
                        id: 'step_1',
                        title: 'Foundation Concepts',
                        description: 'Learn the basic concepts required',
                        estimatedTime: 30,
                        prerequisites: [],
                        resources: ['kb_1', 'kb_2'],
                    },
                ],
                difficulty: params.difficulty || 'beginner',
                estimatedDuration: 120,
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

    updateRAGConfig: (config) => {
        const { ragConfig } = get();
        set(
            { ragConfig: { ...ragConfig, ...config } },
            false,
            n('updateRAGConfig', config),
        );
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
});