import "./App.css";
import { Route, Routes, HashRouter } from "react-router-dom";
import NotFound from "./components/not-found";
import Home from "./components/home";
import Ballances from "./components/ballances";
function App() {
  return (
    <>
      <HashRouter basename="/">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Ballances />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
