import { useEffect, useState } from "react";
import supabase from "../../supabase";
import Header from "./Header";
import Footer from "./Footer";
import CategoriesList from "./CategoriesList";
import { useAuth } from "../../src/context/AuthProvider";
import { useLoading } from "../../src/context/LoadingContext";

// Hlavní komponenta pro zobrazení úvodní stránky
const LandingPage = ({ setRoom }) => {
  const { user, logout } = useAuth(); // Hooky pro autentizaci
  const { showLoading, hideLoading } = useLoading(); // Hooky pro zobrazení indikátoru načítání
  const [categories, setCategories] = useState([]); // Stav pro ukládání kategorií

  useEffect(() => {
    const fetchData = async () => {
      showLoading(); // Zobrazení indikátoru načítání
      const { data, error } = await supabase.from("categories").select(`*, rooms!inner(*)`);
      if (error) {
        console.error("Chyba při načítání kategorií:", error.message);
      } else {
        setCategories(data); // Uložení dat do stavu
      }
      hideLoading(); // Skrytí indikátoru načítání
    };

    fetchData(); // Volání funkce pro načtení dat
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-text bg-primary">
      {/* Záhlaví stránky */}
      <Header user={user} logout={logout} />
      <main className="flex-grow self-center flex flex-wrap justify-center items-center container mx-auto">
        {/* Úvodní obsah stránky */}
        <div className="lg:w-1/2 pt-10">
          <img className="max-h-[800px] mx-auto" src="/landingpage.png" alt="SchnApp!" />
        </div>
        <div className="lg:w-1/2 px-10 text-center lg:text-left">
          <h1 className="mt-10 mb-3 text-4xl">Moderní komunikace pro každého</h1>
          <h2 className="mb-5 text-lg">
            Naše platforma přináší bezproblémovou komunikaci do vašeho digitálního života. S naší aplikací můžete zůstat ve spojení s přáteli, rodinou
            a kolegy, a to vše na jednom místě. Bezpečnost, pohodlí a široká škála tematických místností - to je to, co dělá naši aplikaci nezbytnou
            pro každodenní online interakci.
          </h2>
        </div>
        {/* Komponenta pro zobrazení seznamu kategorií */}
        <CategoriesList categories={categories} setRoom={setRoom} />
      </main>
      {/* Zápatí stránky */}
      <Footer />
    </div>
  );
};

export default LandingPage;
