import React, { useState, useRef, useEffect, useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import speaker_icon_light from '../assets/speaker_light.svg';
import speaker_icon_dark from '../assets/speaker_dark.svg';

const PauseIcon = (isDarkMode, side = 30) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={side} height={side}>
    <rect stroke={isDarkMode ? "white" : "black"} x="6" y="4" width="4" height="16" rx="1"/>
    <rect stroke={isDarkMode ? "white" : "black"} x="14" y="4" width="4" height="16" rx="1"/>
  </svg>
);
const PlayIcon = (isDarkMode, side = 30) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={side} height={side}>
    <polygon points="5,3 19,12 5,21" stroke={isDarkMode ? "white" : "black"} />
  </svg>
);

const TextToSpeech = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const utteranceRef = useRef(null);
  const { isDarkMode, ttsVoices, ttsVoice, setTtsVoice, ttsRate, setTtsRate, isSmallScreen } = useContext(SettingsContext);

  const handlePlay = () => {
    if (!text) return;
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.rate = ttsRate;
    const selectedVoice = ttsVoices.find(v => v.voiceURI === ttsVoice);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    synth.speak(utterance);
    setIsSpeaking(true);
    setHasPlayed(true);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const side = isSmallScreen ? '24' : '30';
  let Icon = <img src={isDarkMode ? speaker_icon_dark : speaker_icon_light} alt="Speaker Icon" width={side - 4} height={side - 4} />;
  if (isSpeaking) {
    Icon = PauseIcon(isDarkMode, side);
  } else if (hasPlayed) {
    Icon = PlayIcon(isDarkMode, side);
  }

  return (
    <div className='w-7 h-7 md:w-8 md:h-8 flex items-center justify-center'>
      <button
          onClick={isSpeaking ? handleStop : handlePlay}
          className={`rounded focus:outline-none transition-colors`}
          aria-label={isSpeaking ? 'Pause reading' : hasPlayed ? 'Play reading' : 'Read aloud'}
          >
          {Icon}
      </button>
    </div>
  );
};

export default TextToSpeech;
