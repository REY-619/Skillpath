import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { PeoplePage } from "./pages/PeoplePage";
import { PersonPage } from "./pages/PersonPage";
import { CareersPage } from "./pages/CareersPage";
import { CareerPage } from "./pages/CareerPage";
import { SkillMapPage } from "./pages/SkillMapPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<PeoplePage />} />
        <Route path="people/:personId" element={<PersonPage />} />
        <Route path="careers" element={<CareersPage />} />
        <Route path="careers/:careerId" element={<CareerPage />} />
        <Route path="skills" element={<SkillMapPage />} />
      </Route>
    </Routes>
  );
}
