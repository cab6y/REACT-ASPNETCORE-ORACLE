import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import SignUp from './Pages/Identity/SignUp';
import SignIn from './Pages/Identity/SignIn';
import Navbar from './components/Navbar';
import Users from './Pages/Identity/Users'
import Todos from './Pages/Todos/Todos'
import './App.css';

function App() {
    return (
        <Router>
            <Navbar />
            <div className="page-content" style={{ marginTop: '80px' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/todos" element={<Todos />} />

                </Routes>
            </div>
        </Router>
    );
}

export default App;
