import { Routes, Route } from "react-router-dom";

import { Dish } from "../pages/Dish";
import { Edit } from "../pages/Edit";
import { Favorites } from "../pages/Favorites";
import { Home } from "../pages/Home";
import { New } from "../pages/New";

export function AppRoutes({ isAdmin }) {
  return (
    <Routes>
      <Route path="/" element={<Home isAdmin={isAdmin} />} />
      <Route path="/new" element={<New isAdmin={isAdmin} />} />
      <Route path="/edit/:id" element={<Edit isAdmin={isAdmin} />} />
      <Route path="/dish/:id" element={<Dish isAdmin={isAdmin} />} />
      <Route path="/favorites" element={<Favorites isAdmin={isAdmin} />} />
    </Routes>
  );
}