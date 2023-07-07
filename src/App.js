import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// components
import Footer from "./components/Footer";
import Navbar from './components/Navbar';

// pages
import Pessoas from "./pages/Pessoas";
import Empresas from "./pages/Empresas";
import Home from "./pages/Home";
import NotFound from './pages/NotFound';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="container">
          <Routes>
            <Route
            path='/'
            element={ <Home /> }  
            />  
            <Route
            path="/pessoas"
            element={ <Pessoas /> }
            />
            <Route
            path="/empresas"
            element={ <Empresas />}
            />
            <Route
            path="*"
            element={ <NotFound />}
            />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
