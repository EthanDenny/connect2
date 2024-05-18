// Import
import { Handle, Position } from 'reactflow';
import './Post.css';

// Import Styles
import './Post.css';

// Import Images
import profilePic from '/sample-profile-pic.png';

import { NodeProps } from 'reactflow';

export type PostData = {
  postStyle: 'text' | 'image' | 'profile';
  image?: string;
  text: string;
};

// Post Component
const Post = (props: NodeProps<PostData>) => {
  // Destructure Post Data
  const { postStyle, image, text } = props.data;

  // ------------------ Render -----------------
  return (
    // Render Post based on the Type
    <div className="post">
      {postStyle == 'profile' ? (
        <ProfilePost />
      ) : postStyle == 'image' ? (
        <ImagePost />
      ) : (
        <TextPost />
      )}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
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
      <div className="img-post-profile-container">
        <img src={profilePic} />
      </div>
      <div>Hailey Kinsella</div>
    </div>
  );
};

const ProfilePost = () => {};

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
