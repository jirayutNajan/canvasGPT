import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { Home } from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />          {/* path="/" */}
          <Route path=":id" element={<Home />} />     {/* path="/:id" */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App