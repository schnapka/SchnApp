import { createContext, useState, useContext, useEffect } from "react";
import supabase from "../../supabase";

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

const register = async (email, password, metaData) => {
  return supabase.auth.signUp({ email, password, options: { data: metaData } });
};

const login = async (email, password) => {
  return supabase.auth.signInWithPassword({ email, password });
};

const logout = async () => {
  return supabase.auth.signOut();
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      const { user: currentUser } = data;
      setUser(currentUser ?? null);
      setLoading(false);
    };

    getUser();

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session.user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={{ user, register, login, logout }}> {!loading && children}</AuthContext.Provider>;
};

export default AuthProvider;
