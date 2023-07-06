import "./Navbar.css";
import { Button } from 'primereact/button';
import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import PrimeReact from 'primereact/api';
import logo from "../Assets/logo-dark2.png";

const Navbar = () => {

  const [theme, setTheme] = useState('dark');

  const changeMyTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    PrimeReact?.changeTheme?.(`md-${theme}-indigo`, `md-${newTheme}-indigo`
      , 'app-theme', () =>
      setTheme(newTheme)
    );
  };

  return (
    <nav id="nav">
      <Link to="/">
        <div className="logo">
          <img src={logo} alt="logo"/>
        </div>
      </Link>
      <div id="switchtheme">
          <Button rounded outlined
            className={`${theme === 'dark' ? 'bg-gray-100 text-black' : 'bg-gray-700 text-white'}`}
            onClick={() => changeMyTheme()}>
            <span className={`pr-1 pi pi-${theme === 'dark' ? 'sun' : 'moon'}`}></span>
          </Button>
      </div>
      <ul id="nav-links">
        <li>
          <NavLink to="/pessoas">
            <h2>Pessoas</h2>
          </NavLink>
        </li>
        <li>
          <NavLink to="/empresas">
            <h2>Empresas</h2>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
