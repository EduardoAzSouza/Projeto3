import "./Navbar.css";

import { NavLink, Link } from "react-router-dom";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    if (query) {
      return navigate(`/search?q=${query}`);
    }
  };

  return (
    <nav id="nav">
      <Link to="/">
        <h2>Project React</h2>
      </Link>
      <form id="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Pesquisar"
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
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
