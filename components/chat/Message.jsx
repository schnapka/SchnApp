import { formatDistance } from "date-fns";
import { cs } from "date-fns/locale";
import convertLinks from "../../src/utils/convertLinks";
import DirectionsIcon from "@mui/icons-material/Directions";
import { useAuth } from "../../src/context/AuthProvider";
import { theme } from "../../src/theme/default";

const Message = ({ message, nowDateTime }) => {
  console.log(nowDateTime);
  const { user } = useAuth();
  const processedMessage = convertLinks(message.message);
  const userData = user.user_metadata;

  const dateObject = new Date(message.created_at);
  const localDateTime = dateObject.toLocaleString();
  const timeAgo = formatDistance(message.created_at, nowDateTime, { addSuffix: true, locale: cs });
  const show_avatar = "show_avatar" in userData ? userData.show_avatar : theme.show_avatar;
  const show_nickname = "show_nickname" in userData ? userData.show_nickname : theme.show_nickname;
  const show_time = "show_time" in userData ? userData.show_time : theme.show_time;
  const accent_color = message.sender.accent_color ? message.sender.accent_color : theme.accent_color;
  const text_color = message.sender.text_color ? message.sender.text_color : theme.text_color;
  const time_color = message.sender.time_color ? message.sender.time_color : theme.time_color;
  const bubble_color = message.sender.bubble_color ? message.sender.bubble_color : theme.bubble_color;
  console.log(show_nickname);
  // Dynamicky určuje třídy na základě podmínek
  const targetRoom = message.recipient_id === null;
  const messageAlignment = user.id == message.sender_id ? "text-right messageReverse" : "";
  return (
    <div className={`flex relative ${messageAlignment} gap-4 mr-5`}>
      <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
        {show_avatar ? (
          <img
            className="w-full h-full object-cover"
            src={message.sender?.avatar_url ? message.sender?.avatar_url : message.recipient?.avatar_url}
            alt={message.sender?.full_name}
          />
        ) : (
          <div style={{ backgroundColor: accent_color }} className="flex items-center justify-center h-10 text-primary uppercase">
            {show_nickname ? message.sender.nickname[0][0] : message.sender.email[0]}
          </div>
        )}
      </div>
      <div style={{ backgroundColor: bubble_color, color: bubble_color }} className="p-2 mt-2  rounded-lg triangle">
        <div className={`flex ${messageAlignment ? "justify-end" : ""} text-text items-baseline gap-2`}>
          {targetRoom ? (
            // public zprávy
            <span style={{ color: accent_color }} className="text-[12px] font-bold opacity-70">
              {show_nickname ? message.sender.nickname : message.sender.email}
            </span>
          ) : (
            // soukromé zprávy
            <>
              {messageAlignment ? (
                // odesílatel soukromé zprávy
                <>
                  <span style={{ color: accent_color }} className="text-[12px] font-bold">
                    {show_nickname ? user.identities[0].identity_data.nickname : user.email}
                  </span>
                  <span style={{ color: accent_color }}>
                    <DirectionsIcon fontSize="inherit" className="self-center" />
                  </span>
                  <span style={{ color: accent_color }} className="text-[12px] font-bold">
                    {show_nickname ? message.recipient.nickname : message.recipient.email}
                  </span>
                </>
              ) : (
                // příjemce soukromé zprávy
                <>
                  <span style={{ color: accent_color }} className="text-[12px] font-bold">
                    {message.sender.nickname}
                  </span>
                  <span style={{ color: accent_color }}>
                    <DirectionsIcon fontSize="inherit" className="self-center" />
                  </span>
                  <span style={{ color: accent_color }} className="text-[12px] font-bold">
                    {user.identities[0].identity_data.nickname}
                  </span>
                </>
              )}
            </>
          )}
          {show_time && (
            <span
              style={{ color: time_color }}
              className="text-xxs cursor-default"
              data-tooltip-id="tooltip"
              data-tooltip-place="top"
              data-tooltip-html={`<span class="text-xs">${localDateTime}</span>`}
            >
              {timeAgo}
            </span>
          )}
        </div>
        <div
          style={{ color: text_color }}
          className={`text-sm text-balance font-semibold`}
          dangerouslySetInnerHTML={{ __html: processedMessage }}
        ></div>
      </div>
    </div>
  );
};

export default Message;
