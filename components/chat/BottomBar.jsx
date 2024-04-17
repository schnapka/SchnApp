import { useRef, useState } from "react";
import InputEmoji from "react-input-emoji";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { useAuth } from "../../src/context/AuthProvider";

const BottomBar = ({ roomUsers, handleMessageEnter }) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const recipient = useRef();
  const userId = user.id;

  const handleSendBtn = () => {
    const recipientId = recipient.current.value;
    handleMessageEnter(text, recipientId);
    setText("");
  };

  return (
    <div className="flex flex-wrap md:flex-nowrap items-center px-2 py-3 bg-background">
      <InputEmoji
        borderRadius={12}
        value={text}
        onChange={setText}
        cleanOnEnter
        onEnter={handleSendBtn}
        placeholder="Napište zprávu"
        theme="auto"
        shouldReturn={true}
      />
      <div className="flex-1 relative mx-3">
        <select className="w-full pl-4 pr-12 min-w-40 h-[42px] bg-secondary rounded-xl outline-none appearance-none cursor-pointer" ref={recipient}>
          <option value="null">Všem</option>
          {roomUsers?.map((item) => {
            return userId != item.id ? (
              <option value={item.id} key={item.id}>
                {item.nickname}
              </option>
            ) : null;
          })}
        </select>
        <ExpandMoreRoundedIcon className="absolute right-3 top-2.5 pointer-events-none" />
      </div>
      <SendRoundedIcon onClick={handleSendBtn} className="cursor-pointer md:mx-5 hover:text-white" fontSize="large" />
    </div>
  );
};

export default BottomBar;
