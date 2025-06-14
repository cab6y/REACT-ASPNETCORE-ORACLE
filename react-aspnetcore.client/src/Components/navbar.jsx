import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { checkSession, logout } from '../../services/identity/userservice';

function NavbarComponent() {
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const storedUsername = sessionStorage.getItem("username");
        const token = sessionStorage.getItem("token");

        if (storedUsername && token) {
            checkSession()
                .then(isValid => {
                    if (isValid) {
                        setUsername(storedUsername);
                    } else {
                        sessionStorage.clear();
                        setUsername(null);
                    }
                })
                .catch(err => {
                    console.error("Session kontrolü baþarýsýz:", err);
                    sessionStorage.clear();
                    setUsername(null);
                });
        }
    }, []);

    const handleLogout = async () => {
        await logout();
        sessionStorage.clear();
        window.location.href = "/signin";
    };

    return (
        <Navbar bg="light" expand="lg" fixed="top" className="shadow-sm w-100">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img
                        src="/vite.svg"
                        width="30"
                        height="30"
                        className="d-inline-block align-top me-2"
                        alt="logo"
                    />
                    Cihan ABAY
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                    </Nav>

                    {/* ORTADA USERS */}
                    {username && (
                        <Nav className="mx-auto">
                            <Nav.Link as={Link} to="/users">Users</Nav.Link>
                        </Nav>
                    )}

                    <Nav className="ms-auto">
                        {username ? (
                            <NavDropdown title={`Welcome, ${username}`} id="user-nav-dropdown">
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
                                <Nav.Link as={Link} to="/signin">Sign In</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;
