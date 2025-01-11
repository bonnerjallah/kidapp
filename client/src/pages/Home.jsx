import React, { useState } from 'react';
import homestyle from '../styles/homestyle.module.css';
import { NavLink , Outlet} from 'react-router-dom';

import SoundControll from '../components/SoundControll';




const Home = () => {
  // Use React state to track the slider value
  const [age, setAge] = useState(1);

  const handleSliderChange = (e) => {
    setAge(e.target.value);
  };


  return (
    <>
        <div className={homestyle.mainContainer}>
            <div>
                <h1 className={homestyle.header}> <span>Tinker</span> <span style={{marginLeft: "-0.5rem"}}>Tots</span></h1>
            </div>

            <div className={homestyle.playContainer}>
                <div className={homestyle.ageRange}>
                <h4>Age range</h4>
                <input
                    type="range"
                    min="1"
                    max="6"
                    value={age}
                    className={homestyle.ageRangeSlider}
                    onChange={handleSliderChange} // Track the slider value
                />
                    <div className={homestyle.ageValue}>{age}</div>
                </div>

                <NavLink to={`/GameRoom/${age}`}  >
                    <button className={homestyle.playButton}>Play</button>
                </NavLink>
            </div>

        <SoundControll />

        </div>
       <Outlet />
    </>
  );
};

export default Home;
