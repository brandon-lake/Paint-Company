import React, { useEffect } from 'react';

const Home = ({isLoggedIn}) => {

    useEffect(() => {
        console.log("made it");
    }, []);

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
                <h1 className="mb-4">Welcome to My Website</h1>
                <p className="lead">This is a short message describing what this page is about.</p>
            </div>
        </div>
    );
};

export default Home;