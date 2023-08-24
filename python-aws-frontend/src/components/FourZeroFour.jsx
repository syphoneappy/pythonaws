import React from 'react'
import './Head/FourZeroFour.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const FourZeroFour = () => {
    const navigate = useNavigate();
    const [seconds, setSeconds] = useState(10);
    useEffect(() => {
        // If seconds reach 0, redirect the user
        if (seconds === 0) {
            const authUser = localStorage.getItem("AuthToken")
            if (authUser){
                navigate('/dashboard')
            }else{
                navigate('/');
            }
        }
    
        // Decrease the timer by 1 second every second
        const timer = setInterval(() => {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }, 1000);
    
        // Clean up the timer when the component unmounts
        return () => {
          clearInterval(timer);
        };
      }, [seconds, navigate]);
  return (
    <div>
        
<div className="container">
        <div className="error-code">404</div>
        <div className="error-message">Page Not Found...Redirecting in {seconds}</div>
        <div className="animated-background">
            <div className="animated-circle"></div>
        </div>
    </div>
    </div>
  )
}

export default FourZeroFour