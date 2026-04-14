import React, { useRef } from "react";
import {Mic } from 'lucide-react';
import {MicOff } from 'lucide-react';
interface Props {
  setInputText: React.Dispatch<React.SetStateAction<string>>;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend?: () => void;
}

const SpeechToText: React.FC<Props> = ({ setInputText }) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = () => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition: SpeechRecognition = new SpeechRecognitionClass();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      // 🔥 THIS is the key line
      setInputText(transcript);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  return (
    <div>
      <button onClick={startListening}><Mic></Mic></button>
      <button onClick={stopListening}><MicOff></MicOff></button>
    </div>
  );
};

export default SpeechToText;