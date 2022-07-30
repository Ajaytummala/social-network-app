import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { fireDb } from "../firebaseConfig";
import DefaultLayout from "../components/DefaultLayout";
import { useParams } from "react-router-dom";
import { async } from "@firebase/util";
import Post from "../components/Post";

function Profile() {
  const [user, SetUser] = useState(null);
  const params = useParams();
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();
  const getPosts = async () => {
    dispatch({ type: "showLoading" });
    const querySnapshot = await getDocs(collection(fireDb, "posts"));
    const temp = [];
    querySnapshot.forEach((doc) => {
      temp.push({ ...doc.data(), id: doc.id });
    });
    const filterPosts = temp.filter((post) => post.user.id === params.id);
    console.log(filterPosts);
    setPosts(filterPosts);
    dispatch({ type: "hideLoading" });
  };
  const getUser = async () => {
    const result = await getDoc(doc(fireDb, "users", params.id));
    SetUser(result.data());
  };

  useEffect(() => {
    getPosts();
    getUser();
  }, []);
  const getUserName = (text) => {
    const email = text;
    const username = email.substring(0, email.length - 10);
    return username;
  };
  return (
    <DefaultLayout>
      {user && (
        <>
          <div>
            <div className="flex item items-center card-sm p-4">
              <div className="h-24 w-24 rounded-full bg-gray-500 flex justify-center items-center text-white mr-2 ">
                <span className="text-7xl ">{getUserName(user.email)[0]}</span>
              </div>
             <div className="flex flex-col space-y-1">
             <span>{getUserName(user.email)}</span>
              <span>{user.email}</span>
              <hr/>
              <span>{user.bio
              }</span>
             </div>
            </div>
          </div>
          <div className="mt-10">
            <div className="card-sm p-2">
              <h1>Posts uploaded by {getUserName(user.email)}</h1>

            </div>
            <div className="grid grid-cols-4 md:grid-cols-1 gap-10 mt-5">
     {posts.map((post)=>{
        return <Post post={post}/>
      })}

     </div>
          </div>
        </>
      )}
    </DefaultLayout>
  );
}

export default Profile;
