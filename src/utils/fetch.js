// Fetch users
export const fetchUsers = async () => {
  try {
    const res = await fetch("http://localhost:3000/php/users.php", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
};

// Fetch specific user
export const fetchSpecificUser = async (userId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/php/users.php?id=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
};

// Fetch categories
export const fetchCategories = async () => {
  try {
    const res = await fetch("http://localhost:3000/php/categories.php", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
};

// Fetch specific category
export const fetchSpecificCategory = async (categoryId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/php/categories.php?id=${categoryId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch a category:", error);
    return null;
  }
};

// Fetch all posts
export const fetchPosts = async () => {
  try {
    const res = await fetch("http://localhost:3000/php/posts.php", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

// Fetch specific post
export const fetchSpecificPost = async (postId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/php/posts.php?id=${postId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
};
