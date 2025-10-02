import { router } from '@/libs/trpc/lambda';

import { coursesRouter } from './courses';
import { lessonsRouter } from './lessons';
import { progressRouter } from './progress';
import { achievementsRouter } from './achievements';
import { educationalRAGRouter } from './rag';
import guardrailsRouter from './guardrails';

export const educationRouter = router({
    courses: coursesRouter,
    lessons: lessonsRouter,
    progress: progressRouter,
    achievements: achievementsRouter,
    rag: educationalRAGRouter,
    guardrails: guardrailsRouter,
});