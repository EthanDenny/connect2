// Import
import { useState, useEffect, useRef } from "react";
import { Handle, Position, NodeProps } from "reactflow";

// Import Styles
import "./Post.css";

// Import Images
import profilePic from "/sample-profile-pic.jpeg";
import tapeImg from "/tapes.svg";

export type PostData = {
  postStyle: "text" | "image" | "profile" | "new";
  image?: string;
  text: string;
  user: string;
  id: string;
};

// Post Component
const Post = (props: NodeProps<PostData>) => {
  // Destructure Post Data
  const [{ id, postStyle, name, avatar, image, text, user }, setRealData] =
    useState({ ...props.data, name: "", avatar: profilePic });

  useEffect(() => {
    const GetUserData = async () => {
      return await fetch(
        'https://f77b-2607-fea8-d5c3-7d80-9d0-c0e4-deda-8c8f.ngrok-free.app/api/collections/users/records?filter=(id="' +
          user +
          '")'
      )
        .then((response) => response.json())
        .then((users) => {
          setRealData({
            postStyle: postStyle,
            name: users.items[0].username.replace("_", " "),
            avatar:
              "https://f77b-2607-fea8-d5c3-7d80-9d0-c0e4-deda-8c8f.ngrok-free.app/api/files/_pb_users_auth_/" +
              user +
              "/" +
              users.items[0].avatar,
            text: text,
            user: user,
            image:
              "https://f77b-2607-fea8-d5c3-7d80-9d0-c0e4-deda-8c8f.ngrok-free.app/api/files/ty1dhzrx959f82n/" +
              id +
              "/" +
              image,
            id: id,
          });
        });
    };

    GetUserData();
  }, [user]);

  // ------------------ Render -----------------
  return (
    // Render Post based on the Type
    <div className="post">
      {postStyle == "profile" ? (
        <ProfilePost />
      ) : postStyle == "image" ? (
        <ImagePost
          name={name}
          avatar={avatar}
          text={text}
          image={image ? image : ""}
        />
      ) : postStyle == "text" ? (
        <TextPost name={name} avatar={avatar} text={text} />
      ) : (
        <NewPost name={"You"} avatar={avatar} setData={setRealData} />
      )}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const ProfilePost = () => {
  return (
    <div className="profile-post">
      {/* Tape */}
      <img src={tapeImg} className="tape-img" />

      {/* Container */}
      <div className="profile-container">
        <div className="relative-box">
          <div className="profile-img-container">
            <img className="profile-img" src={profilePic} />
          </div>
          <div className="profile-name">Person's Name</div>
        </div>
      </div>

      {/* Bio */}
      <div className="profile-bio">
        Hi my name is becky and I like to dance to death metal :3
      </div>

      {/* Tape */}
      <img src={tapeImg} className="bottom-tape" />
    </div>
  );
};

const TextPost = ({
  name,
  avatar,
  text,
}: {
  name: string;
  avatar: string;
  text: string;
}) => {
  return (
    <div className="text-post">
      <div className="text-post-header">
        <div className="text-post-img-container">
          <img src={avatar} className="text-post-img" />
        </div>
        <p>{name}</p>
      </div>
      <p className="text-post-content">{text}</p>
    </div>
  );
};

const ImagePost = ({
  image,
  name,
  text,
  avatar,
}: {
  image: string;
  name: string;
  text: string;
  avatar: string;
}) => {
  return (
    <div className="img-post">
      <div className="img-post-img-container">
        <img src={image} className="image-post-img" />
      </div>
      <div className="image-footer">
        <div className="image-post-profile-container">
          <img src={avatar} />
        </div>
        <div className="image-text">
          <div className="image-user">{name}</div>
          <div className="image-caption">{text}</div>
        </div>
      </div>
    </div>
  );
};

const NewPost = ({
  name,
  avatar,
  setData,
}: {
  name: string;
  avatar: string;
  setData: Function;
}) => {
  // ---------------- State -------------------------
  const [newPostData, setNewPostData] = useState({
    postStyle: "",
    text: "",
    image: "",
    avatar: avatar,
    name: name,
  });

  // -------------- Event Handlers ---------------

  // Update the post whenever user changes
  const updateNewText = (event: any) => {
    setNewPostData({
      ...newPostData,
      text: event.target.value,
    });
  };

  const updateImage = () => {
    setNewPostData({
      ...newPostData,
      image: "",
    });
    console.log("Image Added");
  };

  const createPost = (newPostData: any) => {
    // Add Post Data to the state
    // console.log('Post Added');

    setNewPostData({
      ...newPostData,
      image: { profilePic },
    });

    // Define what type of post we want to create
    if (newPostData.image !== "") {
      setNewPostData({
        ...newPostData,
        postStyle: "image",
      });
    } else {
      setNewPostData({
        ...newPostData,
        postStyle: "text",
      });
    }

    // Turn the New Post Data into a proper Post
    setData(newPostData);
  };

  // ----------------- Render -----------------
  return (
    <div className="new-post">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          createPost(newPostData);
        }}
      >
        <div className="new-container">
          <div className="text-post-header">
            <div className="text-post-img-container">
              <img src={avatar} className="text-post-img" />
            </div>
            <p>{name}</p>
          </div>

          <div className="text-area-wrapper">
            <textarea
              className="text-input"
              placeholder="What's on your mind ?"
              value={newPostData.text}
              onChange={updateNewText}
            />

            <div className="new-post-footer">
              <button type="button" className="btn">
                Cancel
              </button>
              <button type="submit" className="btn">
                Post
              </button>
            </div>
          </div>
        </div>
        {/* <p>{newPostData.text}</p> */}
      </form>
    </div>
  );
};

export default Post;
