import logo from './logo.svg';
import './App.css';
import TextToSpeech from './TextToSpeech';

function App() {
  return (
    <div className="App">
      <TextToSpeech text="In this code snippet, when the useEffect hook runs for the first time (when the component mounts), it sets up an interval that increments the highlightIndex state value every second, effectively creating a word highlighting effect. The return value of the effect is a cleanup function that clears the interval using clearInterval when the component is unmounted."/>
    </div>
  );
}

export default App;
