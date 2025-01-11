import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import OneToFour from "../components/OneToFour";
import FourToSix from "../components/FourToSix";

const GameRoom = () => {
  const { age } = useParams(); 
  const parsedAge = parseInt(age, 10); 

  return (
    <div>
      
      {parsedAge >= 1 && parsedAge <= 4 ? (
        <OneToFour age={parsedAge} />
      ) : parsedAge >= 5 && parsedAge <= 6 ? (
        <FourToSix age={parsedAge} />
      ) : (
        <div>Invalid age range. Please select a valid age.</div>
      )}
    </div>
  );
};

export default GameRoom;
