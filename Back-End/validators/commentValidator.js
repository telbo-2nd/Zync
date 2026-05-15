const JOI = require('joi');

exports.createCommentSchema = JOI.object({
    content: JOI.string().trim().min(1).max(500).required()
});

