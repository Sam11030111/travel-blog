import {
  fetchCategories,
  fetchPosts,
  fetchSpecificCategory,
  fetchSpecificPost,
  fetchSpecificUser,
} from "../utils/fetch";

// Loader for the explore page
export const exploreLoader = async () => {
  const categories = await fetchCategories();
  const originalPosts = await fetchPosts();
  return { categories, originalPosts };
};

// Loader for the write page
export const writeLoader = async ({ params }) => {
  const categories = await fetchCategories();
  const { postId } = params;

  let post = null;
  if (postId) {
    post = await fetchSpecificPost(postId);
  }

  return { categories, post };
};

// Loader for the singlePost page
export const singlePostLoader = async ({ params }) => {
  const postId = params.postId;

  const post = await fetchSpecificPost(postId);

  let user = null;
  let category = null;
  if (post && post.userId && post.categoryId) {
    user = await fetchSpecificUser(post.userId);
    category = await fetchSpecificCategory(post.categoryId);
  }

  return { post, user, category };
};
