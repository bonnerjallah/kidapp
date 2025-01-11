import SoundControll from "./SoundControll";
import { NavLink, useParams } from "react-router-dom";

import onetofourstyle from "../styles/onetofourstyle.module.css";

import {House} from "lucide-react"


const OneToFour = () => {

    const {age} = useParams();


  return (
    <div className={onetofourstyle.mainContainer}>
        <div className={onetofourstyle.headerWrapper}>
            <h1>Header</h1>
        </div>

       

       


        <div className={onetofourstyle.selectionContainer}>
            
            <NavLink to={`/Letters/${age}`}>
                <div>
                </div>
            </NavLink>

            <NavLink>
                <div>
                </div>
            </NavLink>

            <NavLink>
                <div>
                </div>
            </NavLink>

            <NavLink>
                <div>
                </div>
            </NavLink>
            
        </div>

        <SoundControll />

    </div>
  )
}

export default OneToFour
