import { blogRepo, courseRepo, experimentRepo, lessonRepo, metaRepo } from "@coffic/cosy-content";

export const collections = {
    blogs: blogRepo.makeBlogCollection('./content/blogs'),
    meta: metaRepo.makeMetaCollection('./content/meta'),
    courses: courseRepo.makeCourseCollection('./content/courses'),
    lessons: lessonRepo.makeLessonCollection('./content/lessons'),
    experiments: experimentRepo.makeExperimentCollection('./content/experiments'),
};
