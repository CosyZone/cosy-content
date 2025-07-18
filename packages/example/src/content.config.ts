import { makeBlogCollection, makeMetaCollection, makeCourseCollection, makeLessonCollection, makeExperimentCollection } from "@coffic/cosy-content/schema";


export const collections = {
    blogs: makeBlogCollection('./content/blogs'),
    meta: makeMetaCollection('./content/meta'),
    courses: makeCourseCollection('./content/courses'),
    lessons: makeLessonCollection('./content/lessons'),
    experiments: makeExperimentCollection('./content/experiments'),
};
