import { FormControlLabel, Switch } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { useAuth } from "../../src/context/AuthProvider";
import { useLoading } from "../../src/context/LoadingContext";
import { useState } from "react";
import { MuiColorInput } from "mui-color-input";
import supabase from "../../supabase";
import { theme } from "../../src/theme/default";

const ChatSetting = () => {
  const { user } = useAuth();
  const userData = user.user_metadata;
  const { showLoading, hideLoading } = useLoading();
  const [show_avatar, setshow_avatar] = useState("show_avatar" in userData ? userData.show_avatar : theme.show_avatar);
  const [show_nickname, setshow_nickname] = useState("show_nickname" in userData ? userData.show_nickname : theme.show_nickname);
  const [show_time, setshow_time] = useState("show_time" in userData ? userData.show_time : theme.show_time);
  const [accent_color, setaccent_color] = useState("accent_color" in userData ? userData.accent_color : theme.accent_color);
  const [text_color, settext_color] = useState("text_color" in userData ? userData.text_color : theme.text_color);
  const [time_color, settime_color] = useState("time_color" in userData ? userData.time_color : theme.time_color);
  const [bubble_color, setbubble_color] = useState("bubble_color" in userData ? userData.bubble_color : theme.bubble_color);

  const full_name = userData.full_name;
  const avatar_url = userData.avatar_url;
  const email = user.email;
  const nickname = user.identities[0].identity_data.nickname;

  const AccentSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "#4EAC6D", // Barva přepínače v zapnutém stavu
      "&:hover": {
        backgroundColor: alpha("#4EAC6D", theme.palette.action.hoverOpacity), // Barva pozadí při najetí myši v zapnutém stavu
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#4EAC6D", // Barva dráhy přepínače v zapnutém stavu
    },
    "& .MuiSwitch-switchBase": {
      color: "#ccC0CB", // Barva přepínače ve vypnutém stavu
      "&:hover": {
        backgroundColor: alpha("#FFC0CB", theme.palette.action.hoverOpacity), // Barva pozadí při najetí myši ve vypnutém stavu
      },
    },
    "& .MuiSwitch-switchBase + .MuiSwitch-track": {
      backgroundColor: "#ccC0CB", // Barva dráhy přepínače ve vypnutém stavu
    },
  }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    showLoading();

    const { data, error } = await supabase.auth.updateUser({
      data: { show_avatar, show_nickname, show_time, accent_color, text_color, time_color, bubble_color },
    });

    if (error) {
      console.error("Chyba při aktualizaci profilu:", error);
      return false;
    }

    console.log("Profil byl úspěšně aktualizován:", data);
    window.location.reload();
  };
  return (
    <div className="flex flex-col lg:w-[350px] py-8 max-h-full scrollbar-dark scrollbar-track-secondary">
      <div className="pl-8 pr-4">
        <img src={avatar_url} className="mb-3 rounded-full" />
        <h2 className="text-2xl mb-2">{full_name}</h2>
        <h3 className="mb-2 text-sm">{email}</h3>
        <div className="border-t-4 pt-10 border-background">
          <div className="flex relative text-right messageReverse gap-4">
            <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden">
              {show_avatar ? (
                <img className="w-full h-full object-cover" src={avatar_url} alt={full_name} />
              ) : (
                <div style={{ backgroundColor: accent_color }} className="flex items-center justify-center text-primary uppercase">
                  {show_nickname ? nickname[0] : email[0]}
                </div>
              )}
            </div>
            <div style={{ backgroundColor: bubble_color, color: bubble_color }} className="p-2 mt-2 rounded-lg triangle">
              <div className="flex justify-end items-baseline gap-2">
                <span style={{ color: accent_color }} className="text-[12px] font-bold opacity-70">
                  {show_nickname ? nickname : email}
                </span>

                {show_time && (
                  <span style={{ color: time_color }} className="text-xxs">
                    před 2 minutami
                  </span>
                )}
              </div>
              <div style={{ color: text_color }} className="text-sm text-balance text-text">
                Lorem ipsum
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="py-10">
          <FormControlLabel
            control={<AccentSwitch checked={show_avatar} onChange={() => setshow_avatar(!show_avatar)} />}
            label="Zobrazovat avatar"
          />
          <FormControlLabel
            control={<AccentSwitch checked={show_nickname} onChange={() => setshow_nickname(!show_nickname)} />}
            label="Zobrazovat nickname"
          />
          <FormControlLabel control={<AccentSwitch checked={show_time} onChange={() => setshow_time(!show_time)} />} label="Zobrazovat čas" />

          <div className="mt-5">Primární barva</div>
          <MuiColorInput size="small" format="hex" className="colorInput" value={accent_color} onChange={setaccent_color} isAlphaHidden />

          <div className="mt-5">Barva textu zprávy</div>
          <MuiColorInput size="small" format="hex" className="colorInput" value={text_color} onChange={settext_color} isAlphaHidden />

          <div className="mt-5">Barva času</div>
          <MuiColorInput size="small" format="hex" className="colorInput" value={time_color} onChange={settime_color} isAlphaHidden />

          <div className="mt-5">Barva bubliny zprávy</div>
          <MuiColorInput size="small" format="hex" className="colorInput" value={bubble_color} onChange={setbubble_color} isAlphaHidden />
          <button type="submit" className="w-full h-10 mt-8 text-primary bg-accent rounded transition hover:bg-accentHover">
            Uložit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatSetting;
