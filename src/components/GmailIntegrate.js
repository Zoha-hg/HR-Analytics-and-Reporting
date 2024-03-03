import React from 'react';

function GmailIntegrate() {
    const initiateAuthorization = () => {
       
        window.location.href = 'http://localhost:8000/start-gmail-authorization';
        console.log("Initiating Gmail Integration...");
    };
    initiateAuthorization();
    


    return (
        <div>
            <h1>Initiating Gmail Integration...</h1>
            <p>Please wait while we check your authorization status and redirect you accordingly.</p>
        </div>
    );
}

export default GmailIntegrate;
