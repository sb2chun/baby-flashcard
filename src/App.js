import "./App.css";
import "./styles/index.css";
import FlashCardApp from "./components/FlashcardApp";

const App = () => {

  return (
    <div className="App relative min-h-screen flex flex-col">
      <FlashCardApp />
    </div>
  );
};

export default App;
