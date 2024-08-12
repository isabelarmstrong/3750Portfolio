import React  from "react";
import { Route, Routes} from "react-router-dom";
import Records from "./components/records.js";
import Create from "./components/create.js";
import Lose from "./components/lose.js"
import Game from "./components/games.js";
import Win from "./components/win.js";


const App = () => {
  return (
    <div>
      <Routes>
        <Route path = "/" element={<Create />} />
        <Route path="/game" element={<Game />} />
        <Route path = "/lose" element={<Lose />} />
        <Route path = "/win" element={<Win />} />
      </Routes>
    </div>
  );
}
export default App;
