import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div className="layout-container">
            <header className="main-header">
                <nav className="navbar">
                    <Link to="/" className="nav-logo">TIC-TAC-TOC</Link>
                    <div className="nav-links">
                        <Link to="/" className="nav-link">Inicio</Link>
                        <Link to="/solo" className="nav-link">Solo</Link>
                        <Link to="/multi" className="nav-link">Multiplayer</Link>
                    </div>
                </nav>
            </header>

            <main className="content-area">
                <Outlet />
            </main>

            <footer className="main-footer">
                <p>&copy; 2026 Retro-Futurist Tic-Tac-Toe</p>
            </footer>
        </div>
    );
};

export default MainLayout;
