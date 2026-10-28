import client from './client';

export const commentsApi = {
  getPostComments: (postId) => client.get(`/posts/${postId}/comments`),
  getCommentById: (commentId) => client.get(`/comments/${commentId}`),
  createComment: (postId, content) => client.post(`/posts/${postId}/comments`, { content }),
  updateComment: (commentId, data) => client.patch(`/comments/${commentId}`, data),
  deleteComment: (commentId) => client.delete(`/comments/${commentId}`),
  getCommentLikes: (commentId) => client.get(`/comments/${commentId}/like`),
  voteComment: (commentId, type) => client.post(`/comments/${commentId}/like`, { type }),
  deleteCommentVote: (commentId) => client.delete(`/comments/${commentId}/like`)
};
