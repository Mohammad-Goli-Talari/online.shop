import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignUpForm from "./SignUpForm.jsx";
import SignInForm from "./SignInForm.jsx";
import ForgetPassword from "./ForgetPassword";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignUpForm />} />
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
      </Routes>
    </>
  );
}

export default App;