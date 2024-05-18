import { Handle, Position } from "reactflow";
import "./Post.css";

import { NodeProps } from "reactflow";

export type PostData = {
  postStyle: "text" | "image" | "profile";
  image?: string;
  text: string;
};

const Post = (props: NodeProps<PostData>) => {
  const { postStyle, image, text } = props.data;

  return (
    <div className="post">
      {postStyle == "profile" ? (
        <PostProfile />
      ) : (
        <>
          {postStyle == "image" && <PostImage />}
          <PostText text={text} />
          <PostFooter />
        </>
      )}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const PostProfile = () => {
  return <></>;
};

const PostImage = () => {
  return <></>;
};

const PostText = ({ text }: { text: string }) => {
  return (
    <>
      <p>{text}</p>
    </>
  );
};

const PostFooter = () => {
  return <></>;
};

export default Post;
