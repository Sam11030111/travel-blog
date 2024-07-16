import { useState, useContext } from "react";
import { useLoaderData } from "react-router-dom";

import SingleCard from "../card/SingleCard";
import { AuthContext } from "../../context/AuthContext";
import Alert from "react-bootstrap/Alert";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { IoFilterCircleOutline } from "react-icons/io5";
import { IoArrowDownCircleOutline } from "react-icons/io5";
import { IoArrowUpCircleOutline } from "react-icons/io5";

const Cards = () => {
  const { auth } = useContext(AuthContext);
  const { categories, originalPosts } = useLoaderData();
  const [posts, setPosts] = useState(originalPosts);
  const [sortCriteria, setSortCriteria] = useState("date_desc");

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const fetchSortedPosts = async (sort) => {
    try {
      const res = await fetch(
        `http://localhost:3000/php/posts.php?sort=${sort}`
      );
      const sortedPosts = await res.json();
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Failed to fetch sorted posts:", error);
    }
  };

  const handleSortSelect = (eventKey) => {
    setSortCriteria(eventKey);
    fetchSortedPosts(eventKey);
  };

  const getSortButtonTitle = () => {
    switch (sortCriteria) {
      case "date_desc":
        return "Date Descending";
      case "date_asc":
        return "Date Ascending";
      case "title":
        return "Title";
      default:
        return "Date Descending";
    }
  };

  return (
    <div className="p-10">
      {auth.isLoggedIn && (
        <div className="mb-5">
          <DropdownButton
            align="end"
            title={
              <>
                <div className="flex items-center gap-2">
                  <IoFilterCircleOutline className="text-lg" />
                  <span className="font-bold">
                    Sort By
                    <span className="font-normal"> {getSortButtonTitle()}</span>
                  </span>
                </div>
              </>
            }
            id="dropdown-menu-align-end"
            onSelect={handleSortSelect}
          >
            <Dropdown.Item
              eventKey="date_desc"
              className="flex items-center gap-1"
            >
              Date
              <IoArrowDownCircleOutline />
              (default)
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="date_asc"
              className="flex items-center gap-1"
            >
              Date
              <IoArrowUpCircleOutline />
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="title">Title</Dropdown.Item>
          </DropdownButton>
        </div>
      )}
      {posts?.length === 0 && (
        <Alert variant="warning" className="w-max mx-auto">
          There are no posts now!
        </Alert>
      )}
      {posts?.length > 0 && (
        <div className=" max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 place-items-center">
          {posts.map((post) => (
            <div key={post.id}>
              <SingleCard
                post={post}
                categories={categories}
                onDelete={handleDeletePost}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cards;
