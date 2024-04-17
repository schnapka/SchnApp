import { useRef, useState } from "react";
import Input from "../Input";
import { useAuth } from "../../src/context/AuthProvider";
import { useLoading } from "../../src/context/LoadingContext";
import supabase from "../../supabase";

const UserSetting = () => {
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const [nickname, setNickname] = useState(user.user_metadata.nickname);
  const [full_name, setFull_name] = useState(user.user_metadata.full_name);
  const [avatar_url, setAvatar_url] = useState(user.user_metadata.avatar_url);
  // Ref pro input typu file
  const fileInputRef = useRef();

  // Funkce pro otevření dialogu pro výběr souborů
  const handleAvatarClick = () => {
    console.log("D");
    fileInputRef.current.click();
  };

  // Funkce pro zpracování změny avatara
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Vytvoření Image objektu
      const image = new Image();
      // Nastavení zdroje obrázku na soubor vybraný uživatelem
      image.src = URL.createObjectURL(file);

      image.onload = () => {
        // Vytvoření canvas elementu
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 100;
        canvas.height = 100;

        // Výpočet rozměrů pro crop tak, aby byl obrázek na středu
        const scale = Math.max(canvas.width / image.width, canvas.height / image.height);
        const x = (image.width * scale - canvas.width) / 2;
        const y = (image.height * scale - canvas.height) / 2;

        // Aplikace resize a crop
        ctx.drawImage(image, x > 0 ? -x : 0, y > 0 ? -y : 0, image.width * scale, image.height * scale);

        // Vytvoření data URL z canvasu
        const dataUrl = canvas.toDataURL("image/jpg");

        // Nastavení upraveného obrázku do stavu
        setAvatar_url(dataUrl);
      };
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatar_url) return null; // Pokud není avatar_url nastaven, ukončit funkci

    // Převedení data URL na Blob objekt
    const response = await fetch(avatar_url);
    const blob = await response.blob();

    // Nastavení názvu souboru
    const fileName = `${user.id}_${Date.now()}.jpg`;

    // Nahrání Blob objektu do Supabase Storage
    const { data, error } = await supabase.storage.from("avatars").upload(fileName, blob, {
      contentType: "image/jpeg",
      upsert: true, // Přepíše existující soubor se stejným názvem
    });
    if (error) {
      console.error("Nahrávání selhalo:", error.message);
      return null;
    }

    console.log("Avatar nahraný:", data.fullPath);
    return data.fullPath;
    // Zde můžete aktualizovat URL avatara v databázi nebo ve stavu aplikace
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    showLoading();

    const avatar_url_storage = await handleAvatarUpload();
    // const avatar_url_storage = avatar_url;
    if (avatar_url_storage === null) {
      console.error("Nelze uploadovat avatar URL:");
    }

    const avatar_full_path = "https://fbyqkslfwfqdqsnuhuax.supabase.co/storage/v1/object/public/" + avatar_url_storage;

    // const { data, error } = await supabase.from("profiles").update({ nickname, avatar_url, full_name }).eq("id", user.id);
    const { data, error } = await supabase.auth.updateUser({
      data: { nickname, avatar_url: avatar_full_path, full_name },
    });

    if (error) {
      console.error("Chyba při aktualizaci profilu:", error);
      return false;
    }

    console.log("Profil byl úspěšně aktualizován:", data);
    hideLoading();
    window.location.reload();
  };
  return (
    <div className="flex flex-col lg:w-[350px] py-8 max-h-full scrollbar-dark scrollbar-track-secondary">
      <div className="pl-8 pr-4">
        <img src={avatar_url} className="mb-3 rounded-full" />
        <h2 className="text-2xl mb-2">{full_name}</h2>
        <h3 className="mb-2 text-sm">{user.email}</h3>
        <form onSubmit={handleSubmit} className="py-10 border-t-4 border-background">
          <Input text="Email*" type="text" required={true} value={user.email} disabled={true} />
          <Input text="Nickname*" type="text" required={true} value={nickname} onChange={setNickname} />
          <Input text="Celé jméno*" type="text" required={true} value={full_name} onChange={setFull_name} />
          <div className="flex flex-col mb-5">
            <label className="pb-2 text-xs text-left uppercase" htmlFor="avatar">
              Avatar
            </label>
            <img src={avatar_url} className="rounded-full w-10 h-10 cursor-pointer" onClick={handleAvatarClick} />
            <input type="file" id="avatar" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
          </div>
          <button type="submit" className="w-full h-10 text-primary bg-accent rounded transition hover:bg-accentHover">
            Uložit
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSetting;
