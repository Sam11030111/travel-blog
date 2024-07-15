import Lottie from "react-lottie";
import animationData from "../../lotties/travel.json";

const Home = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="text-center">
      <Lottie options={defaultOptions} height={400} width={400} />
      <h1 className="text-5xl font-bold mb-3 font-dancing-script">
        Travel Blog
      </h1>
      <p className="text-lg">Share inspiring stories and travel tips!</p>
      <p className="text-lg">Let’s build a travel community together!</p>
    </div>
  );
};

export default Home;
