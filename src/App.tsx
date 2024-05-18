import Draggable from "react-draggable";
import Post from "./Post.tsx";
import "./App.css";

function App() {
  const posts = [
    {
      text: "Hi",
      image: "",
    },
    {
      text: "Hello",
      image: "",
    },
    {
      text: "Hey",
      image: "",
    },
    {
      text: "Howdy",
      image: "",
    },
  ];

  return (
    <Draggable defaultPosition={{ x: -10000, y: -10000 }}>
      <div className="main">
        {posts.map(({ text, image }, index) => {
          const radius = 500;
          const angle = Math.PI * 2 * (index / 4);

          const x = Math.cos(angle) * radius + 10000;
          const y = Math.sin(angle) * radius + 10000;

          return (
            <div
              style={{
                position: "absolute",
                left: "calc(" + x + "px + 50vh)",
                top: "calc(" + y + "px + 50vh)",
              }}
            >
              <Post
                postStyle={image !== "" ? "image" : "text"}
                image={image}
                text={text}
              />
            </div>
          );
        })}
      </div>
    </Draggable>
  );
}

export default App;
