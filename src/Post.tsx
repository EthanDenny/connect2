import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import "./Post.css";

import { NodeProps } from "reactflow";

const handleStyle = { left: 10 };

export type PostData = {
  postStyle: "text" | "image" | "profile";
  image?: string;
  text: string;
};

const Post = (props: NodeProps<PostData>) => {
  const { postStyle, image, text } = props.data;

  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

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
