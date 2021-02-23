import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/Auth";

import routes from "../../constants/routes";

import "./styles.css";

export default function Header() {
  const { Logout } = useAuth();
  const location = useLocation();

  function handleClick() {
    Logout();
  }

  return (
    <header className="app-header">
      <div className="container">
        <span className="logo-text">
          u<span className="logo-text-secondary">.</span>Panel
        </span>
        <nav className="menu">
          <Link
            to={routes.HOME}
            className={
              location.pathname === routes.HOME
                ? "menu-item active"
                : "menu-item"
            }
          >
            Lista
          </Link>
          <Link
            to={routes.ADD_USER}
            className={
              location.pathname === routes.ADD_USER
                ? "menu-item active"
                : "menu-item"
            }
          >
            Adicionar usuário
          </Link>
        </nav>
        <div className="menu-logout" onClick={handleClick}>
          Logout
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21.651"
            height="22"
            viewBox="0 0 21.651 22"
          >
            <path
              d="M17.674,2.362a10.824,10.824,0,1,1-12.58,0A1.051,1.051,0,0,1,6.621,2.7l.69,1.227a1.047,1.047,0,0,1-.288,1.353,7.333,7.333,0,1,0,8.726,0,1.041,1.041,0,0,1-.284-1.349l.69-1.227a1.046,1.046,0,0,1,1.519-.34Zm-4.54,9.162V1.048A1.045,1.045,0,0,0,12.086,0h-1.4A1.045,1.045,0,0,0,9.642,1.048V11.524a1.045,1.045,0,0,0,1.048,1.048h1.4A1.045,1.045,0,0,0,13.134,11.524Z"
              transform="translate(-0.563)"
              fill="#f2f2f2"
            />
          </svg>
        </div>
      </div>
    </header>
  );
}
