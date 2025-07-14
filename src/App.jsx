import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignUpForm from "./SignUpForm.jsx";
import SignInForm from "./SignInForm.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignUpForm />} />
        <Route path="/signin" element={<SignInForm />} />
      </Routes>
    </>
  );
}

export default App;