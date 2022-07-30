import React from "react";
import { AiOutlineComment, AiFillHeart, AiOutlineClose,AiOutlineShareAlt } from "react-icons/ai";
import DefaultLayout from "../components/DefaultLayout";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { fireDb } from "../firebaseConfig";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { getDefaultNormalizer } from "@testing-library/react";
import moment from "moment";
import SharePost from "./SharePost";

function PostDesc() {
  const currentUser = JSON.parse(localStorage.getItem("batman-user"));
  const [alreadyliked, setAlreadyliked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showlikes, setShowlikes] = useState(false);
  const [post, setPost] = useState(null);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const getUserName = (text) => {
    const email = text;
    const username = email.substring(0, email.length - 10);
    return username;
  };
  const getData = () => {
    dispatch({ type: "showloading" });
    getDoc(doc(fireDb, "posts", params.id))
      .then((response) => {
        setPost({ ...response.data(), id: response.id });
        if (response.data().likes.find((user) => user.id == currentUser.id)) {
          setAlreadyliked(true);
        } else {
          setAlreadyliked(false);
        }
        dispatch({ type: "hideloading" });
      })
      .catch(() => {
        dispatch({ type: "hideloading" });
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const likeorUnlikePost = () => {
    let updatedlikes = post.likes;
    if (alreadyliked) {
      updatedlikes = post.likes.filter((user) => user.id !== currentUser.id);
    } else {
      updatedlikes.push({
        id: currentUser.id,
        email: currentUser.email,
      });
    }

    setDoc(doc(fireDb, "posts", post.id), { ...post, likes: updatedlikes })
      .then(() => {
        getData();
        
      })
      .catch(() => {
        toast.error("error occured");
      });
  };

  const addComment = () => {
    let updatedComments = post.comments;

    updatedComments.push({
      id: currentUser.id,
      email: currentUser.email,
      commentText,
      createdOn:moment().format('DD-MM-YYYY')
    });
    setDoc(doc(fireDb, "posts", post.id), {
      ...post,
      comments: updatedComments,
    })
      .then(() => {
        getData();
        setCommentText('')
      })
      .catch(() => {
        toast.error("error occured");
      });
  };

  return (
    <DefaultLayout>
      <div className="flex w-full justify-center space-x-5 ">
        {post && (
          <>
            {/* likes display purpose */}

            {showlikes && (
              <div className="w-96">
                <div className="flex justify-between">
                  <h1 className="text-xl font-semibold text-gray-500">
                    Liked By
                  </h1>
                  <AiOutlineClose
                    color="gray"
                    className="cursor-pointer "
                    onClick={() => setShowlikes(false)}
                  ></AiOutlineClose>
                </div>
                <hr />
                {post.likes.map((like) => {
                  return (
                    <div className="flex item items-center card-sm p-4 mt-2">
                      <div className="h-8 w-8 rounded-full bg-gray-500 flex justify-center item-center text-white mr-2 ">
                        <span className="text-2xl ">
                          {getUserName(like.email)[0]}
                        </span>
                      </div>
                      <span>{getUserName(like.email)}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* post info purpose */}
            <div className="cursor-pointer h-[500px] w-[500px]">
              <div className="flex item items-center card-sm p-4">
                <div className="h-8 w-8 rounded-full bg-gray-500 flex justify-center item-center text-white mr-2 ">
                  <span className="text-2xl ">
                    {getUserName(post.user.email)[0]}
                  </span>
                </div>
                <span>{getUserName(post.user.email)}</span>
              </div>
              <div className="w-full text-center flex justify-center card-sm">
                <img src={post.imageURL} alt="" className="h-full w-full" />
              </div>
              <div className="card-sm p-2 flex w-full items-center space-x-5">
                <div className="flex space-x-2 items-center">
                  <AiFillHeart
                    size={25}
                    onClick={likeorUnlikePost}
                    color={alreadyliked ? "red" : "black"}
                  />
                  <h1
                    className="underline font-semibiold cursor-pointer"
                    onClick={() => setShowlikes(true)}
                  >
                    {post.likes.length}
                  </h1>
                </div>
                <div className="flex space-x-2 items-center">
                  <AiOutlineComment size={25} />
                  <h1
                    className="underline text-xl cursor-pointer"
                    onClick={() => setShowComments(true)}
                  >
                    {post.comments.length}
                  </h1>
                </div>
                <div>
                <AiOutlineShareAlt onClick={()=>navigate(`/sharepost/${post.id}`)} size={25} color='gray' className="cursor-pointer"/>
                </div>
              </div>
            </div>

            {/* comments info purpose */}
            {showComments && (
              <div className="w-96">
                <div className="flex justify-between">
                  <h1 className="text-xl font-semibold text-gray-500">
                    Comments
                  </h1>
                  <AiOutlineClose
                    color="gray"
                    className="cursor-pointer "
                    onClick={() => setShowComments(false)}
                  ></AiOutlineClose>
                </div>
                {post.comments.map((comment)=>{
                  return <div className="card-sm mt-2 p-2">
                    <h1 className="text-xl text-gray-700">{comment.commentText}</h1> 
                    <hr/>
                    <h1 className="text-right text-md">By <b>{getUserName(comment.email)}</b> On {comment.createdOn}</h1>
                    </div> 
                })}
                <div className="flex flex-col">
                <textarea
                  className="border-dashed border-gray-500 border-2  md:w-full my-5 p-5"
                  rows="2"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                ></textarea>
                <button
                  className=" bg-primary h-10 rounded-sm text-white px-5 mt-2 w-20 text-center"
                  onClick={addComment}
                >
                  Add
                </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DefaultLayout>
  );
}
export default PostDesc;
