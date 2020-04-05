const { UserInputError, AuthenticationError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { userName } = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: {
            body: "Comment body must not empty"
          }
        });
      }

      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          userName,
          createdAt: new Date().toISOString()
        });
        await post.save();
        return post;
      } else throw new UserInputError("Post not found");
    },

    deleteComment: async (_, { postId, commentId }, context) => {
      const { userName } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        const commentIdx = post.comments.findIndex(c => c.id === commentId);

        if (post.comments[commentIdx].userName === userName) {
          post.comments.splice(commentIdx, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Post not found");
      }
    }
  }
};
