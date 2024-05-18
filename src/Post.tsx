// Import
import { Handle, Position } from 'reactflow';
import './Post.css';

// Import Styles
import './Post.css';

// Import Images
import profilePic from '/sample-profile-pic.png';

import { NodeProps } from 'reactflow';
import { useState } from 'react';

export type PostData = {
  postStyle: 'text' | 'image' | 'profile' | 'new';
  image?: string;
  text: string;
};

// Post Component
const Post = (props: NodeProps<PostData>) => {
  // Destructure Post Data
  const [{ postStyle, image, text }, setRealData] = useState(
    props.data
  );

  // ------------------ Render -----------------
  return (
    // Render Post based on the Type
    <div className="post">
      {postStyle == 'profile' ? (
        <ProfilePost />
      ) : postStyle == 'image' ? (
        <ImagePost />
      ) : postStyle == 'text' ? (
        <TextPost />
      ) : (
        <NewPost setData={setRealData} />
      )}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const ProfilePost = () => {
  return (
    <div className="profile-post">
      <div className="profile-img-container">
        <img className="profile-img" src={profilePic} />
      </div>
      <div className="profile-name">Hailey Kinsella</div>
    </div>
  );
};

const TextPost = () => {
  return (
    <>
      <div className="text-post">
        <div className="text-post-header">
          <div className="text-post-img-container">
            <img src={profilePic} className="text-post-img" />
          </div>
          <p>Brittany</p>
        </div>
        <p className="text-post-content">
          Live laugh love. This is the dumbest fucking thing I have
          ever seen. Down with tay tay. She looks like she would clap
          after the plane lands. This displases me. Travis deserves so
          much better.
        </p>
      </div>
    </>
  );
};

const ImagePost = () => {
  return (
    <div className="img-post">
      <div className="img-post-img-container">
        <img src={profilePic} className="image-post-img" />
      </div>
      <div className="image-footer">
        <div className="image-post-profile-container">
          <img src={profilePic} />
        </div>
        <div className="image-text">
          <div className="image-user">Hailey Kinsella</div>
          <div className="image-caption">
            I LOVE DISNEY PRINCESSSS YAY SO MUCH
          </div>
        </div>
      </div>
    </div>
  );
};

const NewPost = ({ setData }: { setData: Function }) => {
  // ---------------- State -------------------------
  const [newPostData, setNewPostData] = useState({
    postStyle: '',
    text: '',
    image: '',
  });

  // -------------- Event Handlers ---------------

  // Update the post whenever user changes
  const updateNewText = (event) => {
    setNewPostData({
      ...newPostData,
      text: event.target.value,
    });
  };

  const updateImage = (event) => {
    setNewPostData({
      ...newPostData,
      image: '',
    });
    console.log('Image Added');
  };

  const createPost = (newPostData) => {
    // Add Post Data to the state
    // console.log('Post Added');

    // Define what type of post we want to create
    if (newPostData.image !== '') {
      setNewPostData({
        ...newPostData,
        postStyle: 'image',
      });
    } else {
      setNewPostData({
        ...newPostData,
        postStyle: 'text',
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
        <textarea
          placeholder="What is on your mind ?"
          value={newPostData.text}
          onChange={updateNewText}
        />
        <img />
        <div className="new-post-footer">
          <button type="button" className="btn">
            Add Image
          </button>
          <button type="submit" className="btn">
            Post
          </button>
        </div>
        <p>{newPostData.text}</p>
      </form>
    </div>
  );
};

// const PostProfile = () => {
//   return <></>;
// };

// const PostImage = () => {
//   return <></>;
// };

// const PostText = ({ text }: { text: string }) => {
//   return (
//     <>
//       <p>{text}</p>
//     </>
//   );
// };

// const PostFooter = () => {
//   return <></>;
// };

export default Post;
