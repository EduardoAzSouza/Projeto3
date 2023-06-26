import "./Footer.css";
import logo from "../Assets/logo.png";

const Footer = () => {
  return (
    <footer id="footer">
      
      <div className="logo">
        <img src={logo} alt="logo"/>
        <p>Front-end Project by DU &copy; 2023</p>
      </div>
    </footer>
  );
};

export default Footer;
