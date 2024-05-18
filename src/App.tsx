import Draggable from "react-draggable";
import Post from "./Post.tsx";
import "./App.css";

function App() {
  return (
    <Draggable defaultPosition={{ x: -10000, y: -10000 }}>
      <div className="main">
        <Post postStyle="text" text="" />
        <Post postStyle="image" image="" text="" />
      </div>
    </Draggable>
  );
}

export default App;
