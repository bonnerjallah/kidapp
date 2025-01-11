import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { HomeIcon } from "lucide-react";

import letterstyles from '../styles/lettersstyle.module.css';

const WinScreen = ({ age, onPlayAgain }) => {
  useEffect(() => {
    const applause = new Audio("/audio/applause.mp3");
    applause.play();

    // Clean up audio when the component unmounts
    return () => {
      applause.pause();
      applause.currentTime = 0; // Reset to the beginning
    };
  }, []); // Runs only once on component mount

  return (
    <div className={letterstyles.playAgainButtonWrapper}>
      <h1>You Won!</h1>
      <p>Congratulations!</p>
      <button onClick={onPlayAgain}>Play Again</button>
      <NavLink to={`/GameRoom/${age}`}>
        <HomeIcon size={25} />
      </NavLink>
    </div>
  );
};

export default WinScreen;
