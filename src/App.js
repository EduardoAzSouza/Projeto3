import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// components
import Footer from "./components/Footer";
import Navbar from './components/Navbar';

// pages
import Pessoas from "./pages/Pessoas/Pessoas";
import Empresas from "./pages/Empresas/Empresas";

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="container">
          <Routes>
            <Route
            path="/pessoas"
            element={ <Pessoas /> }
            />
            <Route
            path="/empresas"
            element={ <Empresas />}
            />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
