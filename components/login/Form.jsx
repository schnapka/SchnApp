import { useState } from "react";
import { useAuth } from "../../src/context/AuthProvider";
import { useNavigate } from "react-router-dom";
import Input from "../Input";
import { useLoading } from "../../src/context/LoadingContext";
import Register from "../register/Register";

const Form = () => {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { login } = useAuth();
  const [registerWidget, setRegisterWidget] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    showLoading();
    try {
      const { data, error } = await login(email, password);

      if (data.user && data.session) {
        navigate("/");
      }

      if (error) {
        console.log("Error:", error);
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      hideLoading();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="relative bg-primary rounded-lg text-text text-center">
        <Input text="Email*" type="email" required={true} value={email} onChange={setEmail} />
        <Input text="Heslo*" type="password" required={true} value={password} onChange={setPassword} />
        <button type="submit" className="w-full p-3 mb-6 rounded-lg bg-green-500 hover:bg-green-700 text-white font-semibold focus:outline-none">
          Přihlásit se
        </button>
      </form>
      <button className="block mx-auto" onClick={() => setRegisterWidget(true)}>
        Registrace
      </button>
      {registerWidget && <Register setRegisterWidget={() => setRegisterWidget(false)} />}
    </>
  );
};

export default Form;
