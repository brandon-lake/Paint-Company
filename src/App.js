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
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const loggedIn = localStorage.getItem("loggedIn");
        return loggedIn ? JSON.parse(loggedIn) : false;
    });
    const [userRole, setUserRole] = useState(() => {
        const userRole = localStorage.getItem("paintRole");
        return userRole ? userRole : UserRole.NONE;
    });
    const [currentUser, setCurrentUser] = useState(() => {
        const currentUser = localStorage.getItem("paintUser");
        return currentUser ? currentUser : "";
    });

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
                <Header userRole={userRole} setUserRole={setUserRole} setIsLoggedIn={setIsLoggedIn} currentUser={currentUser} setCurrentUser={setCurrentUser}/>
            }
            <Switch>
                <Route path='/login' render={(props) => (
                    <LoginPage {...props} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} setCurrentUser={setCurrentUser} />
                    )}
                />

                <PrivateRoute path="/" exact component={Home} isLoggedIn={isLoggedIn} />
                <PrivateRoute path="/home" component={Home} isLoggedIn={isLoggedIn} />

                {userRole !== "admin"
                    ? <PrivateRoute path="/stock" component={PaintStock} isLoggedIn={isLoggedIn} />
                    : <PrivateRoute to="/" />
                }

                {userRole === "crud"
                    ? <PrivateRoute path="/board" component={PaintBoard} isLoggedIn={isLoggedIn} />
                    : <PrivateRoute to="/" />
                }
                {userRole === "admin"
                    ? <Route path="/users" component={UserManagement} isLoggedIn={isLoggedIn} />
                    : <Route to="/" />
                }
            </Switch>
            </div>
        </Router>      
        </div>
    );
}

export default App;
