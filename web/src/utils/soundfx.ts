import Pop1Sound from "../assets/sounds/pop1.wav";
import Pop2Sound from "../assets/sounds/pop2.wav";
import Pop3Sound from "../assets/sounds/pop3.wav";
const sounds = [Pop1Sound, Pop2Sound, Pop3Sound];
const getRandomSound = () => {
  return sounds[Math.floor(Math.random() * sounds.length)];
};

export const playPopSound = () => {
  const audio = new Audio(getRandomSound());
  audio.volume = 0.7;
  audio.playbackRate = 1;
  audio.play();
};
