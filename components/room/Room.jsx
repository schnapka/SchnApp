import { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import RoomInfo from "../roomInfo/RoomInfo";
import { useNavigate, useParams } from "react-router-dom";
import Chat from "../chat/Chat";
import supabase from "../../supabase";
import { useAuth } from "../../src/context/AuthProvider";
import UserSetting from "../setting/UserSetting";
import { useLoading } from "../../src/context/LoadingContext";
import ChatSetting from "../setting/ChatSetting";

const Room = () => {
  const navigate = useNavigate(); // Hook pro programové navigace
  const { showLoading, hideLoading } = useLoading(); // Hooky pro zobrazení/skrytí indikátoru načítání
  const { categoryHash, roomHash } = useParams(); // Parametry URL, získává hash kategorie a místnosti

  // Stavy pro správu UI a dat komponenty
  const [activeChatMenu, setActiveChatMenu] = useState("roomInfo"); // Aktivní část chatovacího menu
  const { user } = useAuth(); // Uživatelské údaje z auth kontextu
  const [roomInfo, setRoomInfo] = useState(null); // Informace o místnosti
  const [messages, setMessages] = useState([]); // Zprávy v místnosti
  const [onlineUsers, setOnlineUsers] = useState([]); // Seznam online uživatelů v místnosti

  // Načítání informací o místnosti
  useEffect(() => {
    const fetchRoomInfo = async () => {
      const { data, error } = await supabase.from("rooms").select(`*, categories (*)`).eq("hash", roomHash).eq("categories.hash", categoryHash);
      if (error) {
        console.error("Error fetching room info:", error.message); // Logování chyby při načítání informací o místnosti
        navigate("/"); // Přesměrování uživatele při chybě
      } else if (data.length === 1) {
        setRoomInfo(data[0]); // Nastavení informací o místnosti, pokud je nalezena
      } else {
        navigate("/"); // Přesměrování, pokud místnost není nalezena
      }
    };

    showLoading();
    fetchRoomInfo();
  }, []);

  // Načítání zpráv pro místnost
  useEffect(() => {
    if (roomInfo === null) return;

    const fetchMessages = async () => {
      // Definice polí uživatele pro dotaz
      const userFields =
        "id, email, nickname, full_name, avatar_url, show_avatar, show_nickname, show_time, accent_color, text_color, time_color, bubble_color";
      const query = `
        *,
        sender:sender_id (${userFields}),
        recipient:recipient_id (${userFields})
      `;

      const { data, error } = await supabase
        .from("messages")
        .select(query)
        .or(`room_public.eq.${roomInfo.id}_public,room_sender.eq.${roomInfo.id}_${user.id},room_recipient.eq.${roomInfo.id}_${user.id}`)
        .limit(50);

      if (error) {
        console.error("Error fetching messages:", error.message); // Logování chyby při načítání zpráv
      } else if (data.length) {
        setMessages(data); // Nastavení zpráv, pokud jsou nalezeny
      }
    };

    fetchMessages();
  }, [roomInfo]);

  // useEffect pro sledování online uživatelů v místnosti
  useEffect(() => {
    // Vytvoření kanálu pro sledování online uživatelů
    const channel = supabase.channel(`${categoryHash}_${roomHash}`);

    // Funkce pro aktualizaci seznamu online uživatelů
    const updateOnlineUsers = () => {
      const presences = channel.presenceState();
      const userIds = Object.values(presences).flatMap((presence) =>
        presence.map(({ user_id: id, ...rest }) => ({
          id,
          ...rest,
        }))
      );

      // Odstranění duplicitních uživatelů
      const uniqueUsers = Array.from(new Map(userIds.map((user) => [user.id, user])).values());
      setOnlineUsers(uniqueUsers);
      hideLoading();
    };

    // Přihlášení k odběru online uživatelů
    channel
      .on("presence", { event: "sync" }, () => {
        updateOnlineUsers();
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // Sledování aktuálního uživatele v kanálu při úspěšném přihlášení k odběru
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: user?.id,
            email: user?.email,
            ...user?.user_metadata,
          });
          updateOnlineUsers();
        }
      });

    // Odhlášení od kanálu při odmontování komponenty
    return () => {
      channel.unsubscribe();
    };
  }, [user, categoryHash, roomHash]);

  // useEffect pro odběr změn zpráv v místnosti
  useEffect(() => {
    if (roomInfo === null) return;
    const channelA = supabase.channel(roomInfo.id);

    channelA
      .on("postgres_changes", { event: "*", schema: "public", table: "messages", filter: `room_sender=eq.${roomInfo.id}_${user.id}` }, addNewMessage)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages", filter: `room_public=eq.${roomInfo.id}_public` }, addNewMessage)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `room_recipient=eq.${roomInfo.id}_${user.id}` },
        addNewMessage
      )
      .subscribe();
  }, [roomInfo]);

  // Funkce pro přidání nové zprávy
  const handleMessageEnter = async (message, recipient_id) => {
    if (message.trim() === "") return;

    const room_sender = `${roomInfo.id}_${user.id}`;
    const room_recipient = `${roomInfo.id}_${recipient_id}`;

    try {
      const { data, error } = await supabase.from("messages").insert([
        {
          rooms_id: roomInfo.id,
          recipient_id: recipient_id === "null" ? null : recipient_id,
          sender_id: user.id,
          message,
          room_recipient,
          room_sender: recipient_id === "null" ? null : room_sender,
          room_public: recipient_id === "null" ? `${roomInfo.id}_public` : null,
        },
      ]);

      if (error) throw error; // Pokud dojde k chybě, vyvoláme výjimku, která bude zachycena v catch bloku

      // Tady můžete přidat kód pro aktualizaci UI, pokud je to potřeba
    } catch (error) {
      console.error("Failed to send message:", error.message); // Logování chyby, pokud operace selže
    }
  };

  const addNewMessage = async (payload) => {
    const message = payload.new; // Extrahuje novou zprávu z payloadu

    // Pokud je zpráva veřejná, načte profil odesílatele a přidá zprávu do seznamu
    if (message.room_public !== null) {
      const sender = message.sender_id; // ID odesílatele zprávy
      const { data, error } = await supabase.from("profiles").select(`*`).eq("id", sender);
      if (error) {
        console.error("Error fetching sender profile:", error.message); // Logování chyby při načítání profilu odesílatele
        return; // Přerušíme funkci, pokud dojde k chybě
      }
      message.sender = data[0]; // Přiřadíme profil odesílatele k zprávě
      setMessages((prev) => [...prev, message]); // Přidáme zprávu do seznamu
      return; // Ukončíme funkci, pokud byla zpráva veřejná
    }

    // Pokud jsem příjemcem zprávy, načte profil odesílatele a přidá zprávu do seznamu
    if (message.recipient_id === user.id) {
      const sender = message.sender_id; // ID odesílatele zprávy
      const { data, error } = await supabase.from("profiles").select(`*`).eq("id", sender);
      if (error) {
        console.error("Error fetching sender profile for recipient:", error.message); // Logování chyby
        return; // Přerušíme funkci, pokud dojde k chybě
      }
      message.sender = data[0]; // Přiřadíme profil odesílatele k zprávě
      setMessages((prev) => [...prev, message]); // Přidáme zprávu do seznamu
    }

    // Pokud jsem odesílatelem zprávy, načte profil příjemce a přidá zprávu do seznamu
    if (message.sender_id === user.id) {
      const recipient = message.recipient_id; // ID příjemce zprávy
      const { data, error } = await supabase.from("profiles").select(`*`).eq("id", recipient);
      if (error) {
        console.error("Error fetching recipient profile for sender:", error.message); // Logování chyby
        return; // Přerušíme funkci, pokud dojde k chybě
      }
      message.sender = user.user_metadata; // Uložíme metadata odesílatele k zprávě
      message.recipient = data[0]; // Přiřadíme profil příjemce k zprávě
      setMessages((prev) => [...prev, message]); // Přidáme zprávu do seznamu
    }
  };

  const handleClickChatMenu = (menu) => {
    if (menu === activeChatMenu) {
      setActiveChatMenu(null);
    } else {
      setActiveChatMenu(menu);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch w-screen h-screen lg:overflow-hidden text-text bg-secondary">
      <Navbar activeChatMenu={activeChatMenu} handleClickChatMenu={handleClickChatMenu} />
      {activeChatMenu !== null && (
        <div className="absolute mt-16 lg:mt-0 inset-0 lg:static bg-secondary lg:bg-transparent z-10">
          {activeChatMenu === "roomInfo" && <RoomInfo room={roomInfo} roomUsers={onlineUsers} />}
          {activeChatMenu === "userSetting" && <UserSetting />}
          {activeChatMenu === "chatSetting" && <ChatSetting />}
        </div>
      )}
      <Chat roomUsers={onlineUsers} messages={messages} handleMessageEnter={handleMessageEnter} />
    </div>
  );
};

export default Room;
