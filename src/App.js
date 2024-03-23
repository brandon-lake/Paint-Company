import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { UserRole } from './consts/UserRoles';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import PaintBoard from './components/PaintBoard';
import UserManagement from './components/UserManagement';
import PaintStock from './components/PaintStock';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(UserRole.NONE);
    const [currentUser, setCurrentUser] = useState("");

    useEffect(() => {
        const user = localStorage.getItem("paintUser");
        if (user) {
            setIsLoggedIn(true);
            setCurrentUser(user);
        }
        const userRole = localStorage.getItem("paintRole");
        if (userRole) {
            setUserRole(userRole);
        }
    }, []);

    return (
        <div className="App">
        <Router>
            <div>
            {userRole !== "none" && 
                <Header userRole={userRole} setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} currentUser={currentUser} setCurrentUser={setCurrentUser}/>
            }
            <Switch>
                <Route path='/login' render={(props) => (
                    <LoginPage {...props} setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} isLoggedIn={isLoggedIn} setCurrentUser={setCurrentUser} />
                    )}
                />

                <PrivateRoute path="/" exact component={Home} isLoggedIn={isLoggedIn} />
                <PrivateRoute component={Home} isLoggedIn={isLoggedIn} />

                {userRole !== "admin" ? (
                    <PrivateRoute path="/stock" component={PaintStock} />
                    ) : (
                    <PrivateRoute to="/" />
                )}

                {userRole === "crud" ? (
                    <PrivateRoute path="/board" component={PaintBoard} />
                    ) : (
                    <PrivateRoute to="/" />
                )}
                {userRole === "admin" ? (                
                    <Route path="/users" component={UserManagement} />
                    ) : (
                    <Route to="/" />
                )}
            </Switch>
            </div>
        </Router>      
        </div>
    );
}

export default App;
