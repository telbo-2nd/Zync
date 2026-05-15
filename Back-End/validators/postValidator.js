const JOI=require('joi');

exports.createPostSchema=JOI.object({
    content:JOI.string().trim().min(3).max(1000).required(),
    privacy:JOI.string().valid('Public','Private','Friends-only').default('Public'),
});

exports.updatePostSchema=JOI.object({
    content:JOI.string().trim().min(3).max(1000).optional(),
    privacy:JOI.string().valid('Public','Private','Friends-only').optional(),
}).min(1);

