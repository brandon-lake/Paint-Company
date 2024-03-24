import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, isLoggedIn, ...rest }) => {
    
    useEffect(() => {
        console.log(isLoggedIn);
    }, [isLoggedIn]);

    return (
        <Route {...rest} render={(props) => (
            isLoggedIn
                ? <Component {...props} />
                : <Redirect to='/login' />
        )} />
    )
};

export default PrivateRoute;
