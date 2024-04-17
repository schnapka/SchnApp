import { useState } from "react";
import { useAuth } from "../../src/context/AuthProvider";
import supabase from "../../supabase";
import Input from "../Input";
import Modal from "../modal/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { useLoading } from "../../src/context/LoadingContext";

// Komponenta Register pro registraci uživatele
const Register = ({ setRegisterWidget }) => {
  // Hooky z kontextu pro autentizaci a načítání
  const { register } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  // Lokální stavy pro ukládání uživatelského vstupu a stavu modálního okna
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [full_name, setFull_name] = useState("");
  const [isModalTypeOpen, setIsModalTypeOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // Funkce pro odeslání formuláře a zpracování registrace
  const handleSubmit = async (event) => {
    event.preventDefault(); // Zabrání výchozímu chování formuláře
    showLoading(); // Zobrazí indikátor načítání

    // Kontrola dostupnosti nickname
    const isAvailable = await isNicknameAvailable(nickname);
    if (!isAvailable) {
      // Otevření modálního okna s varováním, pokud nickname není dostupný
      openModal("Nickname již existuje, zvolte prosím jiný", "bg-warning");
      return;
    }

    // Metadata pro registraci
    const metaData = { nickname, avatar_url: "/user.png", full_name };

    try {
      // Pokus o registraci uživatele s email, heslo a metadata
      const { data, error } = await register(email, password, metaData);

      if (!error && data) {
        if (!data.user.identities.length) {
          openModal("Uživatel pod tímto emailem již existuje", "bg-warning");
        } else {
          // Úspěšná registrace
          openModal("Registrace byla úspěšná. Potvrďte prosím svoji registraci na e-mailu.", "bg-success");
        }
      } else if (error) {
        // Zpracování chyb od Supabase
        openModal(error.message, "bg-warning");
        console.log("Error:", error.message);
      }
    } catch (error) {
      // Zachycení a logování chyby
      openModal(error.message, "bg-warning");
      console.error("Error:", error.message);
    } finally {
      // Skrytí indikátoru načítání po dokončení procesu
      hideLoading();
    }
  };

  // Funkce pro kontrolu dostupnosti nickname
  async function isNicknameAvailable(nickname) {
    const { data, error } = await supabase.from("profiles").select("nickname").ilike("nickname", nickname);
    if (error) {
      console.error("Došlo k chybě při ověřování nickname:", error.message);
      return false; // Při chybě považujeme nickname za nedostupný
    }
    return data.length === 0; // Dostupnost nickname
  }

  // Funkce pro otevření a zavření modálního okna
  const openModal = (content, type) => {
    setIsModalTypeOpen(type);
    setModalContent(content);
  };

  const closeModal = () => {
    setIsModalTypeOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-secondary bg-opacity-80" onClick={setRegisterWidget}>
      <div className="max-w-3xl w-full">
        <form onSubmit={handleSubmit} className="relative bg-primary p-8 rounded-lg text-text text-center" onClick={(e) => e.stopPropagation()}>
          <CloseIcon className="absolute right-4 top-4 cursor-pointer" onClick={setRegisterWidget} />
          <h2 className="mb-6 text-3xl font-bold">Registrace</h2>
          <div className="flex flex-col sm:flex-row sm:gap-10">
            <div className="flex-1">
              <Input text="Email*" type="email" required={true} value={email} onChange={setEmail} />
              <Input text="Heslo*" type="password" required={true} value={password} onChange={setPassword} />
            </div>
            <div className="flex-1">
              <Input text="Nickname*" type="text" required={true} value={nickname} onChange={setNickname} />
              <Input text="Jméno a příjmení" type="text" required={false} value={full_name} onChange={setFull_name} />
            </div>
          </div>
          <button type="submit" className="w-full p-3 mb-6 rounded-lg bg-green-500 hover:bg-green-700 text-white font-semibold focus:outline-none">
            Registrovat se
          </button>
        </form>
      </div>
      <Modal isModalTypeOpen={isModalTypeOpen} modalContent={modalContent} onClose={closeModal} />
    </div>
  );
};

export default Register;
