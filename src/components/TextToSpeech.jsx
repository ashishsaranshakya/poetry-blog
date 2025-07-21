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

const RestartIcon = (isDarkMode, side = 30) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={side} height={side} fill="none" stroke={isDarkMode ? 'white' : 'black'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-3.51-7.03" />
    <polyline points="21 3 21 9 15 9" />
  </svg>
);

const TextToSpeech = ({ text, title }) => {
  const [ttsState, setTtsState] = useState('initial');
  const utteranceRef = useRef(null);
  const { isDarkMode, ttsVoices, ttsVoice, setTtsVoice, ttsRate, setTtsRate, isSmallScreen } = useContext(SettingsContext);

  const createUtterance = (content, onend) => {
    const selectedVoice = ttsVoices.find(v => v.voiceURI === ttsVoice);
    const utter = new window.SpeechSynthesisUtterance(content);
    utter.rate = ttsRate;
    if (selectedVoice) {
      utter.voice = selectedVoice;
      if (selectedVoice.lang) utter.lang = selectedVoice.lang;
    }
    utter.onend = onend;
    utter.onerror = () => setTtsState('initial');
    return utter;
  };

  const poeticPoem = text ? text.replace(/\n+/g, '. ') : '';

  const handleStart = () => {
    if (!text && !title) return;
    const synth = window.speechSynthesis;
    if (synth.speaking || synth.paused) {
      synth.cancel();
    }
    setTtsState('playing');
    if (title) {
      const titleUtter = createUtterance(title, () => {
        setTimeout(() => {
          if (poeticPoem) {
            const poemUtter = createUtterance(poeticPoem, () => setTtsState('initial'));
            utteranceRef.current = poemUtter;
            synth.speak(poemUtter);
          } else {
            setTtsState('initial');
          }
        }, 200);
      });
      utteranceRef.current = titleUtter;
      synth.speak(titleUtter);
    } else if (poeticPoem) {
      const poemUtter = createUtterance(poeticPoem, () => setTtsState('initial'));
      utteranceRef.current = poemUtter;
      synth.speak(poemUtter);
    }
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setTtsState('paused');
  };

  const handleResume = () => {
    window.speechSynthesis.resume();
    setTtsState('playing');
  };

  const handleRestart = () => {
    window.speechSynthesis.cancel();
    setTtsState('initial');
  };


  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      setTtsState('initial');
    };
  }, []);

  const side = isSmallScreen ? '24' : '30';
  let Icon;
  if (ttsState === 'initial') {
    Icon = <img src={isDarkMode ? speaker_icon_dark : speaker_icon_light} alt="Speaker Icon" width={side - 4} height={side - 4} />;
  } else if (ttsState === 'playing') {
    Icon = PauseIcon(isDarkMode, side);
  } else if (ttsState === 'paused') {
    Icon = PlayIcon(isDarkMode, side);
  }

  let buttonHandler, ariaLabel;
  if (ttsState === 'initial') {
    buttonHandler = handleStart;
    ariaLabel = 'Read aloud';
  } else if (ttsState === 'playing') {
    buttonHandler = handlePause;
    ariaLabel = 'Pause reading';
  } else if (ttsState === 'paused') {
    buttonHandler = handleResume;
    ariaLabel = 'Play reading';
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='w-7 h-7 md:w-8 md:h-8 flex items-center justify-center'>
        <button
          onClick={buttonHandler}
          className={`rounded focus:outline-none transition-colors`}
          aria-label={ariaLabel}
        >
          {Icon}
        </button>
      </div>
      {ttsState === 'paused' && (
        <button
          onClick={handleRestart}
          className='mt-1 rounded-full flex items-center justify-center'
          aria-label='Restart reading'
        >
          {RestartIcon(isDarkMode, 20)}
        </button>
      )}
    </div>
  );
};

export default TextToSpeech;
