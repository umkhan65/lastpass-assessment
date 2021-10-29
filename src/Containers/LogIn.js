import { useState } from "react";
import LoginForm from "../Components/LoginForm";
import InfoField from "../Components/InfoField";

const LogIn = () => {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <div>
      {!isLogin ? <LoginForm setIsLogin={setIsLogin} /> : <InfoField />}
    </div>
  );
};

export default LogIn;
