import { useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import { ColorContext } from "./extras/ColorContext";
import UpMenu from "./components/UpMenu";
import Particle from "./components/Particle";
import Home from "./pages/HomePage";
import SimpleIntro from "./components/SimpleIntro";
import FeatureIntro from "./components/FeatureIntro";
import FaqComponent from "./components/FaqComponent";
import FaqList from "./components/FaqList";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ScrapResult from "./pages/ScrapResult";
import NewsLater from "./components/NewsLater";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [color, setColor] = useState<string>("");
  const [point, setPoint] = useState<number>(0);
  const handleColorChange = (color: string) => {
    setColor(color);
  };
  const handlePointChange = (p: number) => {
    setPoint(p);
  };

  return (
    <div className="overflow-hidden">
      <UpMenu />

      <ColorContext.Provider
        value={{
          color: color,
          point: point,
          setPoint: handlePointChange,
          setColor: handleColorChange,
        }}
      >
        {location.pathname === "/" && (
          <SimpleIntro
            tag="WEBPARSER.ONLINE"
            heading="Ultimate Website Scrapper"
            subtitle="Scrap SEO of Any Website"
            btntext="Scrap Websites"
          />
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/siteparser/:clientId" element={<ScrapResult />} />
        </Routes>
      </ColorContext.Provider>
      <FaqList />
      <NewsLater/>
      <Footer />
    </div>
  );
}

export default App;
