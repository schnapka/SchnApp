import RoomUser from "./RoomUser";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";

const RoomInfo = ({ room, roomUsers }) => {
  const navigate = useNavigate();

  const leaveRoom = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col lg:w-[350px] py-8 max-h-full scrollbar-dark scrollbar-track-secondary">
      {room && (
        <div className="pl-8 pr-4">
          <h2 className="text-2xl mb-2">{room.name}</h2>
          <h3 className="mb-2 text-sm">{room.description}</h3>
          <div>
            <span className="inline-flex items-center gap-2 mb-10 text-accent cursor-pointer" onClick={leaveRoom}>
              <ExitToAppIcon /> Odejít z místnosti
            </span>
          </div>
          <div className="text-xs mb-5">UŽIVATELÉ</div>
        </div>
      )}
      {roomUsers?.map((roomUser) => (
        <RoomUser roomUser={roomUser} key={roomUser.id} />
      ))}
    </div>
  );
};

export default RoomInfo;
