import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import NavbarIcon from "./NavbarIcon";
import { useAuth } from "../../src/context/AuthProvider";

const Navbar = ({ activeChatMenu, handleClickChatMenu }) => {
  const { logout } = useAuth();

  return (
    <div className="absolute w-full lg:w-auto lg:static flex lg:flex-col justify-between bg-primary">
      <div className="flex lg:block">
        <NavbarIcon activeChatMenu={activeChatMenu === "roomInfo"} onClick={() => handleClickChatMenu("roomInfo")} tooltip="Chat">
          <ChatRoundedIcon fontSize="inherit" />
        </NavbarIcon>
        <NavbarIcon
          activeChatMenu={activeChatMenu === "userSetting"}
          onClick={() => handleClickChatMenu("userSetting")}
          tooltip="Nastavení uživatele"
        >
          <AccountCircleOutlinedIcon fontSize="inherit" />
        </NavbarIcon>
        <NavbarIcon activeChatMenu={activeChatMenu === "chatSetting"} onClick={() => handleClickChatMenu("chatSetting")} tooltip="Nastavení aplikace">
          <SettingsOutlinedIcon fontSize="inherit" />
        </NavbarIcon>
      </div>
      <div>
        <NavbarIcon tooltip="Odhlásit se">
          <LogoutIcon fontSize="inherit" onClick={() => logout()} />
        </NavbarIcon>
      </div>
    </div>
  );
};

export default Navbar;
