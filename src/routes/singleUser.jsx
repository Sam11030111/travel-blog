import { useParams } from "react-router-dom";

const SingleUser = () => {
  const { userId } = useParams();
  console.log(userId);

  return <div>SingleUser</div>;
};

export default SingleUser;
