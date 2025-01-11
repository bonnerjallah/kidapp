import homestyle from '../styles/homestyle.module.css';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Volume2, VolumeOff, Music, HomeIcon } from 'lucide-react';



const SoundControll = ({currentLetter}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPlayLetterSound, setIsPlayLetterSound] = useState(true);
  const [audio, setAudio] = useState(null); 
  const [sound, setSound] = useState(true);

  console.log("current letter", currentLetter);


  useEffect(() => {
    const backgroundMusic = new Audio('/audio/New R.mp3');
    backgroundMusic.loop = true;
    setAudio(backgroundMusic);

    if(isPlaying) {
      backgroundMusic.play();
    } else {
      backgroundMusic.pause();
    }

  return () => {
      backgroundMusic.pause();
    }
  }, [isPlaying])

  const toggleMusic = () => {
    if(audio) {
      if(isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  }


  useEffect(() => {
    if(!currentLetter) return;

    const lettersound = new Audio(`${currentLetter.lettersound}`);

    setSound(lettersound);

    if(lettersound && isPlayLetterSound) {
      lettersound.play();
    } else {
      lettersound.pause();
    }

    return () => {
      if(lettersound && isPlayLetterSound) {
        lettersound.pause();
      }
    }

  }, [currentLetter])

  const toggleLetterSound = () => {
    if(sound) {
      if(isPlayLetterSound) {
        sound.pause();
      } else {
        sound.play();
      }
      setIsPlayLetterSound(!isPlayLetterSound);
    }
  }
 

  


  return (
    <div className={homestyle.soundContainer}>
      <div onClick={() => toggleLetterSound()}>
        {isPlayLetterSound ? (
          <span><Volume2 size={45} /></span>
        ) : (
          <span><VolumeOff size={45} /></span>
        )}
      </div>

      <div onClick={() => toggleMusic()}>
        {isPlaying ? (
            <span><Music size={45} /></span>
          ) : (
            <span><VolumeOff size={45} /></span>    
        )}
      </div>

      <NavLink to={"/"}>
        <HomeIcon size={45} />
      </NavLink>

      
    </div>
  );
};

export default SoundControll;
