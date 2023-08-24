import React, { useState, useEffect } from "react";

const TextToSpeech = ({ text }) => {
    const [isPaused, setIsPaused] = useState(true);
    const [utterance, setUtterance] = useState(null);
    const [voice, setVoice] = useState(null);
    const [pitch, setPitch] = useState(1);
    const [rate, setRate] = useState(1);
    const [volume, setVolume] = useState(1);
    const [highlightIndex, setHighlightIndex] = useState(0);
    const words = text.split(' ');

    useEffect(() => {
        const synth = window.speechSynthesis;
        const u = new SpeechSynthesisUtterance(text);
        setUtterance(u);

        // Add an event listener to the speechSynthesis object to listen for the voiceschanged event
        synth.addEventListener("voiceschanged", () => {
            const voices = synth.getVoices();
            setVoice(voices[0]);
        });

        return () => {
            synth.cancel();
            synth.removeEventListener("voiceschanged", () => {
                setVoice(null);
            });
        };
    }, [text]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused) {
                setHighlightIndex((prevIndex) =>
                    prevIndex < words.length - 1 ? prevIndex + 1 : 0
                );
            }
        }, 350);

        return () => {
            clearInterval(interval);
        };
    }, [isPaused]);

    useEffect(() => {
        if (highlightIndex === 0) {
            setIsPaused(true);
        }
    }, [highlightIndex])

    const handlePlay = (e) => {
        setIsPaused(false);
        const synth = window.speechSynthesis;

        if (highlightIndex > 0) {
            synth.resume();
        } else {
            utterance.voice = voice;
            utterance.pitch = pitch;
            utterance.rate = rate;
            utterance.volume = volume;
            synth.speak(utterance);
            console.log("speaking")
        }

    };

    const handlePause = () => {
        const synth = window.speechSynthesis;
        synth.pause();
        setIsPaused(true);
    };

    const handleStop = () => {
        const synth = window.speechSynthesis;
        setIsPaused(true);
        setHighlightIndex(0);
        synth.cancel();
    };

    const handleVoiceChange = (event) => {
        const voices = window.speechSynthesis.getVoices();
        setVoice(voices.find((v) => v.name === event.target.value));
    };

    const handlePitchChange = (event) => {
        setPitch(parseFloat(event.target.value));
    };

    const handleRateChange = (event) => {
        setRate(parseFloat(event.target.value));
    };

    const handleVolumeChange = (event) => {
        setVolume(parseFloat(event.target.value));
    };

    return (
        <div>
            <label>
                Voice:
                <select value={voice?.name} onChange={handleVoiceChange}>
                    {window.speechSynthesis.getVoices().map((voice) => (
                        <option key={voice.name} value={voice.name}>
                            {voice.name}
                        </option>
                    ))}
                </select>
            </label>

            <br />

            <label>
                Pitch:
                <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={pitch}
                    onChange={handlePitchChange}
                />
            </label>

            <br />

            <label>
                Speed:
                <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={rate}
                    onChange={handleRateChange}
                />
            </label>
            <br />
            <label>
                Volume:
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                />
            </label>

            <br />

            <button onClick={handlePlay}>{"Play"}</button>
            <button onClick={handlePause}>Pause</button>
            <button onClick={handleStop}>Stop</button>

            <div className="text-container">
                {words.map((word, index) => (
                    <span
                        key={index}
                        className={index === highlightIndex ? 'highlighted' : ''}
                    >
                        {word}{' '}
                    </span>
                ))}
            </div>

        </div>
    );
};

export default TextToSpeech;