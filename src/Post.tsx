import "./Post.css";
const Post = ({
  postStyle,
  image,
  text,
}: {
  postStyle: "text" | "image" | "profile";
  image?: string;
  text: string;
}) => {
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
