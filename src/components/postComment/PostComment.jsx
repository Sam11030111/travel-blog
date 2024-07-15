import { useContext, useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import useSWR from "swr";

import { AuthContext } from "../../context/AuthContext";
import { fetchSpecificUser } from "../../utils/fetch";

const fetcher = async (url) => {
  const res = await fetch(url);

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message);
    throw error;
  }

  return data;
};

const PostComment = () => {
  const { postId } = useParams();
  const { auth } = useContext(AuthContext);
  const descRef = useRef();
  const [error, setError] = useState("");
  const [userComments, setUserComments] = useState([]);

  const {
    data: comments,
    isLoading,
    mutate,
  } = useSWR(
    `http://localhost:3000/php/comments.php?postId=${postId}`,
    fetcher
  );

  useEffect(() => {
    const fetchCommentsWithUser = async () => {
      if (comments) {
        const commentsWithUser = await Promise.all(
          comments.map(async (comment) => {
            const user = await fetchSpecificUser(comment.userId);
            return { ...comment, user };
          })
        );
        setUserComments(commentsWithUser);
      }
    };

    fetchCommentsWithUser();
  }, [comments]);

  const handleSubmit = async () => {
    setError("");
    try {
      const res = await fetch("http://localhost:3000/php/comments.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          userId: auth.user.id,
          description: descRef.current.value,
        }),
      });

      if (!res.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await res.json();

      if (data.success) {
        console.log("Comment posted successfully");
        descRef.current.value = "";
        mutate();
      }

      if (data.error) {
        setError(data.error);
      }
    } catch (error) {
      console.log("Failed to post comment:", error);
      console.log("An error occurred while posting the comment");
    }
  };

  return (
    <div className="mt-[50px]">
      <h1 className="text-xl font-bold mb-[30px]">Comments</h1>
      {auth.isLoggedIn === true ? (
        <div className="flex items-center justify-between gap-[30px]">
          <textarea
            rows={5}
            className="w-full p-3 border-1 border-textarea rounded-md text-[var(--textColor)] bg-[var(--navbarBg)]"
            placeholder="Write a comment..."
            ref={descRef}
          />
          <button
            onClick={handleSubmit}
            className=" bg-blue-500 py-2 px-4 text-white font-bold rounded-md cursor-pointer"
          >
            Send
          </button>
        </div>
      ) : (
        <Button variant="primary">
          <Link to="/login">Login to write a comment</Link>
        </Button>
      )}
      {error && (
        <Alert className="mt-3 max-w-max" variant="danger">
          {error}
        </Alert>
      )}
      <div className="mt-[30px]">
        {userComments?.map((comment) => (
          <div key={comment.id} className="mt-5 border-b w-full md:w-[80%]">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={comment.user.image || "/noavatar.png"}
                className="w-10 border aspect-square rounded-full object-cover"
              />
              <div className="flex flex-col gap-1 text-[var(--softTextColor)]">
                <span className="font-semibold">{comment.user.name}</span>
                <span className="text-sm">{comment.createdAt}</span>
              </div>
            </div>
            <p className="text-md font-light mb-3">{comment.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostComment;
