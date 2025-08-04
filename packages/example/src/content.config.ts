import {
    makeBlogCollection, makeMetaCollection,
    makeCourseCollection, makeLessonCollection, makeExperimentCollection, makeManualCollection, makeStoryCollection
} from "@coffic/cosy-content/schema";

export const collections = {
    blogs: makeBlogCollection('./content/blogs'),
    meta: makeMetaCollection('./content/meta'),
    courses: makeCourseCollection('./content/courses'),
    lessons: makeLessonCollection('./content/lessons'),
    experiments: makeExperimentCollection('./content/experiments'),
    manuals: makeManualCollection('./content/manuals'),
    stories: makeStoryCollection('./content/stories'),
};
