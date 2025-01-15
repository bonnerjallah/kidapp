import React, { useEffect, useRef, useState } from 'react';
import letterstyles from '../styles/lettersstyle.module.css';
import Confetti from 'react-confetti'
import { NavLink, useParams } from 'react-router-dom';
import { DNA } from 'react-loader-spinner'


import SoundControll from '../components/SoundControll';
import WinScreen from '../components/WinScreen';

const Letters = () => {
  const { age } = useParams();
  const canvasRef = useRef(null);
  const [letters, setLetters] = useState([]);
  const [playerLetters, setPlayerLetters] = useState([]);
  const [letterCount, setLetterCount] = useState(1);
  const [poppedLetterSet, setPoppedLetter] = useState(new Set());
  const [bubbleFrequencyMap, setBubbleFrequencyMap] = useState(new Map());
  const [playerWon, setPlayerWon] = useState(false);
  const [letterAudioSound, setLetterAudioSound] = useState(null);
  // const [playerScore, setPlayerScore] = useState(0);



  // Fetch the alphabet data  
  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const response = await fetch('/alphabet.json');
        const data = await response.json();
        setLetters(data);
      } catch (error) {
        console.error('Error fetching letter:', error);
      }
    };
    fetchLetter()
  }, []);

  // Generate random player letters whenever `letters` or `letterCount` changes
  useEffect(() => {
    if (letters.length > 0 && letterCount > 0) {
      const getRandomUniqueLetter = (letters, count) => {
        const result = new Set();
        while (result.size < count && result.size < letters.length) {
          const randomLetter =
            letters[Math.floor(Math.random() * letters.length)];
          result.add(randomLetter);
        }
        return Array.from(result);
      };
      const newPlayerLetters = getRandomUniqueLetter(letters, letterCount);
      setPlayerLetters(newPlayerLetters);
    }
  }, [letters, letterCount, playerWon]);

  useEffect(() => {
    if(playerLetters.length > 0 && poppedLetterSet.size > 0) {
      checkIfPlayerWon();
    }
  }, [poppedLetterSet, playerLetters]);

  // Check if player won
  const checkIfPlayerWon = () => {
    // Check if every letter in playerLetters is in poppedLetterSet
    const allLettersPopped = playerLetters.every((letter) => poppedLetterSet.has(letter.letter));
  
    if (allLettersPopped) {
      console.log("player won");
      setPlayerWon(true); // Set the state to indicate player won
    }
  };

  // Handle player won
  const handlePlayAgain = () => {
    setPlayerWon(false); // Reset the player won state
    setPoppedLetter(new Set()); // Reset the popped letters
    if(letterCount < 5) {
      setLetterCount(letterCount + 1)
    } else {
      setLetterCount(1) // Reset to initial letter count
    };
    setBubbleFrequencyMap(new Map()); // Reset the bubble frequency map
    setPlayerLetters([]); // Reset the player letters
  };


  
  // Canvas setup
  useEffect(() => {
    if (!letters.length || playerWon) return;  // If letters are not loaded or player has won, do not proceed

    const canvas = canvasRef.current;
    if (!canvas) return; 

    let canvasPosition = null;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Update canvas position
    const updateCanvasPosition = () => {
      canvasPosition = canvas.getBoundingClientRect();
    };



    let score = 0;
    let gameFrame = 0;
    ctx.font = '50px Georgia';
    let gameSpeed = 1;  

    // Mouse Interactivity
    const mouse = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      click: false,
    };

    const handleMouseDown = (event) => {
      mouse.click = true;
      mouse.x = event.x - canvas.getBoundingClientRect().left; // Adjust mouse position to canvas position
      mouse.y = event.y - canvas.getBoundingClientRect().top; // Adjust mouse position to canvas position
    };

    const handleMouseUp = () => {
      mouse.click = false;
    };



    // Player class
    const playerLeft = new Image();
    playerLeft.src = '/spriteSheet/fishswime.png';
    const playerRight = new Image();
    playerRight.src = '/spriteSheet/fishswimeRight.png';

    class Player {
      constructor() {
        this.x = canvas.width; // Right side of the screen
        this.y = canvas.height / 2; // Center of the screen
        this.radius = 50; // Radius of player
        this.angle = 0; // Angle of rotation
        this.frameX = 0; // Frame for sprite animation
        this.frameY = 0; // Frame for sprite animation
        this.frame = 0; // Frame for sprite animation
        this.spriteWidth = 498; // Width of each sprite
        this.spriteHeight = 327; // Height of each sprite
      }
    
      update() {
        const dx = this.x - mouse.x; // Direction toward mouse
        const dy = this.y - mouse.y; // Direction toward mouse
    
        // Calculate angle (direction to mouse)
        let theta = Math.atan2(dy, dx); // Result is in radians
        this.angle = theta; // Set angle to direction to mouse

        // Smooth movement toward mouse
        if (mouse.x !== this.x) {
          this.x -= dx / 20; // Move towards the mouse
        }
        if (mouse.y !== this.y) {
          this.y -= dy / 20; // Move towards the mouse
        }
      }
    
      draw() {
        // Draw a guiding line if the mouse is clicked
        if (mouse.click) {
          ctx.lineWidth = 0.2;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      
        // Draw the player
        ctx.save();
        ctx.translate(this.x, this.y); // Move to player's position
        ctx.rotate(this.angle ); // Adjust rotation to align sprite's "forward" direction
      
        if (mouse.x >= this.x) {
          // Facing right
          ctx.drawImage(
            playerRight,
            this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight, 
            this.spriteWidth, 
            this.spriteHeight, 
            -this.spriteWidth / 8, // Center the image
            -this.spriteHeight / 8, // Center the image
            this.spriteWidth / 3,  // Scale the image
            this.spriteHeight / 3  // Scale the image
          );
        } else {
          // Facing left
          ctx.drawImage(
            playerLeft,
            this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            -this.spriteWidth / 8, // Center the image
            -this.spriteHeight / 8, // Center the image
            this.spriteWidth / 3,
            this.spriteHeight / 3
          );
        }
      
        ctx.restore();
      }
      
    }
    
    const player = new Player();


    //Enemy class
    const sharkImage = new Image();
    sharkImage.src = '/spriteSheet/shark2.png';

    class Enemy {
      constructor() {
        this.x = canvas.width - 200;
        this.y = Math.random() * (canvas.height - 90) + 50;
        this.radius = 150;
        this.speed = Math.random() * 4 + 1;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 498;
        this.spriteHeight = 304;
      }

      draw() {
        ctx.drawImage(
          sharkImage,
          this.frameX * this.spriteWidth, // X position on sprite sheet
          this.frameY * this.spriteHeight, // Y position on sprite sheet
          this.spriteWidth, // Width of a single frame
          this.spriteHeight, // Height of a single frame
          this.x - this.radius , // Adjust for drawing centered on x
          this.y - this.radius  , // Adjust for drawing centered on y
          this.spriteWidth, // Scaled width on canvas
          this.spriteHeight // Scaled height on canvas
        );
      }

      update() {
        this.x -= this.speed;
        if(this.x < 0 - this.radius * 2) { // Reset position and speed
          this.x = canvas.width + 200; // Reset position to right side
          this.y = Math.random() * (canvas.height - 90) + 50;  // Reset position to right side
          this.speed = Math.random() * 4 + 1;  // Reset speed to a new random value
        }
        if(gameFrame % 5 == 0) { 
          this.frame++;
          if(this.frame >= 12) this.frame = 0; 
          if(this.frame == 3 || this.frame == 7 || this.frame == 11) {
            this.frameX = 0;
          } else {
            this.frameX++;
          }
          if(this.frame < 3) this.frameY = 0;
          else if(this.frame < 7) this.frameY = 1;
          else if(this.frame < 11) this.frameY = 2;
          else this.frameY = 0;
        }
        //collision with player detection
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if(distance < this.radius + player.radius) {
          handlePointsLost()
        }
      }
    }

    const sharkEnemy = new Enemy();

    const handleEnemiees = () => {
      sharkEnemy.update();
      sharkEnemy.draw();
    }

    const handlePointsLost = () => {
      ctx.fillStyle = 'black';
      ctx.fillText('Points Lost', canvas.width / 2, canvas.height / 2);
      score = Math.max(score - 1, 0);
    }

    // Bubbles class
    const bubbleArray = [];

    const bubbleImage = new Image();
    bubbleImage.src = '/spriteSheet/bubbles/bubblepop01.png';


    class Bubble {
      constructor(letters) {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 4 + 1;
        this.distance = 0;
        this.counted = false;
      
        // Choose a letter if `letters` is valid and non-empty
        if (letters && letters.length > 0) {
          this.letter = letters[Math.floor(Math.random() * letters.length)];
        } else {
          this.letter = { image: "placeholder.png" }; // Default fallback
        }
      
        // Set the letter image
        this.letterImage = new Image();
        this.letterImage.src = `/images/alphaimages/${this.letter.image}`;
      
        // Randomize sound
        this.sound = Math.random() <= 0.5 ? "sound1" : "sound2";
      }
      
    
      update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
      }
    
      draw() {

        // ctx.fillStyle = 'blue';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.stroke();

        ctx.drawImage(bubbleImage, this.x - 65, this.y - 65, this.radius * 3, this.radius * 3);
        ctx.drawImage(this.letterImage, this.x - this.radius / 2, this.y - this.radius / 2, this.radius, this.radius);
      }
    }

    const bubblePop1 = document.createElement('audio');
    bubblePop1.src = '/audio/bubbles/bubbles-single1.wav';

    const bubblePop2 = document.createElement('audio');
    bubblePop2.src = '/audio/bubbles/bubbles-single2.wav';


    // Handle bubbles
    const handleBubbles = () => {
      if (gameFrame % 50 === 0 && letters.length) {
        // Add a new bubble every 50 frames
        bubbleArray.push(new Bubble(letters));
      }

      for (let i = 0; i < bubbleArray.length; i++) {
        const bubble = bubbleArray[i]; 
        bubble.update();
        bubble.draw();

        // Remove bubble if it's out of screen
        if (bubble.y < 0 - bubble.radius * 2) {
          bubbleArray.splice(i, 1);
          i--; // Adjust index after removal
          continue;
        }

        // Check for collision with the player
        if (bubble.distance < bubble.radius + player.radius) {
          if (!bubble.counted) {
            const bubbleLetter = bubble.letter;

            // Check if the popped bubble matches any player letter
            const isMatching = playerLetters.some((val) => val.letter === bubbleLetter.letter);

            if (isMatching) {
              // Play sound
              if (bubble.sound === 'sound1') bubblePop1.play();
              else bubblePop2.play();

              // setLetterAudioSound((prevSound) => {
              //   if (prevSound) {
              //     prevSound.pause();
              //     prevSound.currentTime = 0; // Reset to the beginning
              //   }
              
              //   const newSound = new Audio(bubbleLetter.lettersound);
              //   newSound.play(); // Play the new sound
              //   return newSound; // Update the state with the new sound object
              // });
              


              // Update letter frequency map
              setBubbleFrequencyMap((prevMap) => {
                const newMap = new Map(prevMap);
                newMap.set(bubbleLetter, (newMap.get(bubbleLetter.letter) || 0) + 1);
                return newMap;
              });


              setPoppedLetter((prevSet) => {
                const updatedSet = new Set(prevSet).add(bubbleLetter.letter);
                checkIfPlayerWon(updatedSet); // Pass updated state directly if needed
                return updatedSet;
              });              


              checkIfPlayerWon()

              score++;
              bubble.counted = true;
              bubbleArray.splice(i, 1);
              i--; // Adjust index after removal
            } 
          }
        }
      }
    };


    //Repeating background
    const background = new Image();
    background.src = "/images/background/bg1.png";

    const BG = {
      x1: 0,
      x2: canvas.width,
      y: 0,
      width: canvas.width,
      height: canvas.height,
    }

    const handleBackground = () => {
      BG.x1--;
      if(BG.x1 <= -BG.width + gameSpeed) BG.x1 = BG.width;
      BG.x2 -= gameSpeed;
      if(BG.x2 <= -BG.width + gameSpeed) BG.x2 = BG.width;
      ctx.drawImage(background, BG.x2, BG.y, BG.width, BG.height);
      ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height);
    }


    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      handleBackground();
      handleEnemiees()
      handleBubbles();
      player.update();
      player.draw();
      ctx.fillText(`score: ${score}`, 10, 50); 
      gameFrame++;
      requestAnimationFrame(animate);
    };

    animate(); // Start the animation loop


    // Event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', updateCanvasPosition);
    
    // Clean up
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', updateCanvasPosition);
    };

  }, [letters, letterCount, playerLetters, playerWon]); 

 

  return (
    <div>
      {letters.length === 0 ? (
        <div className={letterstyles.loadingPage}>
          <h1>Loading...</h1>
          <p>Please wait while we prepare the game.</p>
          <DNA
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
          />  
        </div>
      ) : playerWon ? (
        <div  className={letterstyles.wonContainer}>
          <Confetti
            drawShape={ctx => {
              ctx.beginPath()
              for(let i = 0; i < 22; i++) {
                const angle = 0.35 * i
                const x = (0.2 + (1.5 * angle)) * Math.cos(angle)
                const y = (0.2 + (1.5 * angle)) * Math.sin(angle)
                ctx.lineTo(x, y)
              }
              ctx.stroke()
              ctx.closePath()
            }}
          />
          <WinScreen age={age} onPlayAgain={handlePlayAgain} />
        </div>
      ) : (
        <div className={letterstyles.mainContainer}>
          <div className={letterstyles.playerLetterContainer}>
            {playerLetters && playerLetters.map((letter, index) => (
              <div key={index} className={`${letterstyles.playerLetter} ${poppedLetterSet.has(letter.letter) ? letterstyles.playerLetterPicked : ''}`}>  
                <img src={`/images/alphaimages/${letter.image}`} alt={letter.letter}  />
              </div>
            ))}
          </div>
          <canvas ref={canvasRef} className={letterstyles.canvasWrapper}></canvas>
          <SoundControll currentLetter={letterAudioSound}/>
        </div>
      )}
    </div>
  );
};

export default Letters;


