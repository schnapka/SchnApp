import { Route, Routes } from "react-router-dom";
import Login from "../components/login/Login";
import Room from "../components/room/Room";
import Register from "../components/register/Register";
import AuthRoute from "../components/AuthRoute";
import LandingPage from "../components/landingPage/LandingPage";

function App() {
  return (
    <Routes>
      <Route element={<AuthRoute />}>
        <Route index element={<LandingPage />} />
        <Route path="chat">
          <Route path=":categoryHash">
            <Route path=":roomHash" element={<Room />} />
          </Route>
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
