import Messages from "./Messages";
import BottomBar from "./BottomBar";

const Chat = ({ messages, roomUsers, handleMessageEnter }) => {
  return (
    <div className="max-h-screen pt-16 lg:pt-0 flex-1 flex flex-col bg-primary">
      <Messages roomMessages={messages} />
      <BottomBar roomUsers={roomUsers} handleMessageEnter={handleMessageEnter} />
    </div>
  );
};

export default Chat;
