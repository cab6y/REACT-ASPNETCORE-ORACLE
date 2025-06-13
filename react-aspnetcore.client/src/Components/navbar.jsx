import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

function NavbarComponent() {
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
                    StokTakip
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;
