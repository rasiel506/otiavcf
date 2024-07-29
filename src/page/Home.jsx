import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeCard from "../components/HomeCard";
import { v4 as uuid } from "uuid";

// icons
import { MdVideoCall as NewCallIcon } from "react-icons/md";

const Home = () => {
  const navigate = useNavigate();
  const roomId = uuid();

  useEffect(() => {
    navigate(`/room/${roomId}`);
  }, [navigate, roomId]);

  return (
    <div className="bg-darkBlue1 min-h-screen text-slate-400">
      <div className="flex h-full md:gap-2 flex-col md:flex-row">
        <div className="p-3 w-auto h-auto items-center">
          <div className="flex gap-2 md:gap-6 mb-3 md:mb-6">
            <HomeCard
              title="New Meeting"
              desc="Create a new meeting"
              icon={<NewCallIcon />}
              iconBgColor="lightYellows"
              bgColor="bg-yellow"
              route={`/room/`}
            />
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
