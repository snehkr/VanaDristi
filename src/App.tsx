import { Routes, Route } from "react-router-dom";
import Header from "@/components/layout/Header";
import DashboardPage from "./pages/DashboardPage";
import PlantDetailPage from "./pages/PlantDetailPage";
import ManagePlantsPage from "./pages/ManagePlantsPage";
import IdentifyPlantPage from "./pages/IdentifyPlantPage";
import IdentifiedPlantsPage from "./pages/IdentifiedPlantsPage";

function App(): React.ReactElement {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <div
        className="absolute top-0 left-0 w-full h-full -z-10 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/plant/:plantId" element={<PlantDetailPage />} />
          <Route path="/manage-plants" element={<ManagePlantsPage />} />
          <Route path="/identify" element={<IdentifyPlantPage />} />
          <Route
            path="/identifications"
            element={<IdentifiedPlantsPage />}
          />{" "}
          {/* <-- Add new route */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
