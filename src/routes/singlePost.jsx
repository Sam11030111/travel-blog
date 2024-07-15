import { useLoaderData } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import PostComment from "../components/postComment/PostComment";

const SinglePost = () => {
  const [placeDetail, setPlaceDetail] = useState(null);
  const { post, user, category } = useLoaderData();
  const mapRef = useRef(null);

  const getCategoryStyle = (title) => {
    switch (title) {
      case "Urban":
        return "bg-slate-500";
      case "Historical":
        return "bg-yellow-800";
      case "Jungle":
        return "bg-green-800";
      case "Ocean":
        return "bg-sky-400";
      case "Mountain":
        return "bg-teal-600	";
      default:
        return "bg-red-300";
    }
  };

  useEffect(() => {
    if (post.placeId) {
      const initMap = async () => {
        const map = new google.maps.Map(mapRef.current, {
          zoom: 15,
          center: { lat: -33.8688, lng: 151.2195 }, // Initial center
          mapId: "DEMO_MAP_ID",
        });

        const service = new google.maps.places.PlacesService(map);
        service.getDetails({ placeId: post.placeId }, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            setPlaceDetail(place);
            map.setCenter(place.geometry.location);
            new google.maps.marker.AdvancedMarkerElement({
              map,
              position: place.geometry.location,
            });
          }
        });
      };

      initMap();
    }
  }, [post.placeId]);

  return (
    <div className="max-w-[475px] sm:max-w-[640px] md:max-w-[768px] md:px-10 lg:max-w-[1024px] mx-auto px-20 pt-10 pb-20">
      <div className="flex items-center gap-5">
        <div className="flex-1 flex flex-col items-start gap-3">
          <h1 className="text-[30px] sm:text-[40px] xl:text-[50px] font-bold mb-3">
            {post?.title}
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-3 gap-3">
            <div className="flex items-center gap-3">
              <img
                src={user?.image || "/noavatar.png"}
                className="w-[50px] aspect-square rounded-full object-cover border"
              />
              <div className="flex flex-col gap-2 font-medium text-xl">
                <span>Author</span>
                <span className="text-lg font-medium text-[var(--softTextColor)] bg-[var(--navbarBg)] text-center rounded-md border border-black py-1 px-2">
                  {user?.name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={category?.img}
                className="w-[50px] aspect-square rounded-full object-cover"
              />
              <div className="flex flex-col gap-2 font-medium text-xl">
                <span>Type</span>
                <span
                  className={`${getCategoryStyle(
                    category.title
                  )} text-lg font-medium text-white bg-[var(--navbarBg)] text-center rounded-md border border-black py-[2px] px-2`}
                >
                  {category.title}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img src="/pin.png" className="w-10 aspect-square object-cover" />
            <p>{placeDetail?.name}</p>
          </div>
        </div>
        <div className="hidden md:flex flex-1 h-[350px] relative">
          <img
            src={post?.image || "/no-picture.png"}
            className={
              post?.image
                ? "rounded-xl shadow-md object-cover"
                : "relative object-contain"
            }
          />
        </div>
      </div>
      <div className="w-full mt-5">
        <p className="break-words">{post?.description}</p>
      </div>
      <div
        ref={mapRef}
        className="h-[300px] w-full rounded-xl shadow-lg mt-10"
      ></div>
      <PostComment />
    </div>
  );
};

export default SinglePost;
