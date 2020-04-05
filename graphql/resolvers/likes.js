const { UserInputError, AuthenticationError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Mutation: {
    likePost: async (_, { postId }, context) => {
      const { userName } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find(like => like.userName === userName)) {
          // Post already liked, unlike it

          post.likes = post.likes.filter(like => like.userName !== userName);
          await post.save();
        } else {
          //Post not liked
          post.likes.push({
            userName,
            createdAt: new Date().toISOString()
          });
        }

        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    }
  }
};
