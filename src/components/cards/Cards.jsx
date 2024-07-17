import { useState, useContext } from "react";
import { useLoaderData } from "react-router-dom";

import SingleCard from "../card/SingleCard";
import { AuthContext } from "../../context/AuthContext";
import Alert from "react-bootstrap/Alert";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { IoFilterCircleOutline } from "react-icons/io5";
import { IoArrowDownCircleOutline } from "react-icons/io5";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import { IoSearchSharp } from "react-icons/io5";

const Cards = () => {
  const { auth } = useContext(AuthContext);
  const { categories: originalCategories, originalPosts } = useLoaderData();
  const [posts, setPosts] = useState(originalPosts);
  const [sortCriteria, setSortCriteria] = useState("date_desc");
  const [selectedCategoryId, setSelectedCategoryId] = useState("0");
  const [searchQuery, setSearchQuery] = useState("");

  // Create a new categories array with "All" included
  const categories = [
    { id: "0", title: "All", img: "" },
    ...originalCategories,
  ];

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const fetchPosts = async (categoryId, sort) => {
    try {
      const res = await fetch(
        `http://localhost:3000/php/posts.php?category=${categoryId}&sort=${sort}`
      );
      const filteredPosts = await res.json();
      setPosts(filteredPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const handleSortSelect = (eventKey) => {
    setSortCriteria(eventKey);
    fetchPosts(selectedCategoryId, eventKey);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategoryId(category.id);
    fetchPosts(category.id, sortCriteria);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
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

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="p-10">
      <div className="mb-5 flex flex-wrap justify-between">
        <ButtonToolbar
          className="mb-3 gap-3"
          aria-label="Toolbar with Button groups"
        >
          <ButtonGroup className="me-2" aria-label="First group">
            {categories.map((category) => (
              <Button
                key={category.id}
                className={`${
                  selectedCategoryId === category.id
                    ? "bg-[var(--sortBtn)]"
                    : "bg-[var(--navbarBg)] text-[var(--textColor)]"
                }`}
                onClick={() => handleCategorySelect(category)}
              >
                {category.title}
              </Button>
            ))}
          </ButtonGroup>
          <InputGroup>
            <InputGroup.Text id="btnGroupAddon">
              <IoSearchSharp className="text-lg" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search for title..."
              aria-label="Input group example"
              aria-describedby="btnGroupAddon"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </ButtonToolbar>
        {auth.isLoggedIn && posts?.length > 0 && (
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
        )}
      </div>
      {filteredPosts?.length === 0 && (
        <Alert variant="warning" className="w-max mx-auto">
          There are no posts now!
        </Alert>
      )}
      {filteredPosts?.length > 0 && (
        <div className=" max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 place-items-center">
          {filteredPosts.map((post) => (
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
