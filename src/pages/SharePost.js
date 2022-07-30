import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import DefaultLayout from "../components/DefaultLayout";
import { fireDb } from "../firebaseConfig";
import Post from "../components/Post";
import { useNavigate, useParams } from "react-router-dom";
import { async } from "@firebase/util";
import { toast, ToastContainer } from "react-toastify";

function SharePost() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [data, setData] = useState([]);
  const navigate=useNavigate();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();
  const getData = async () => {
    dispatch({ type: "showLoading" });
    const querySnapshot = await getDocs(collection(fireDb, "users"));

    const temp = [];
    querySnapshot.forEach((doc) => {
      temp.push({ ...doc.data(), id: doc.id });
    });
    setData(temp);
    dispatch({ type: "hideLoading" });
  };
  const getPost = () => {
    dispatch({ type: "showloading" });
    getDoc(doc(fireDb, "posts", params.id))
      .then((response) => {
        setPost({ ...response.data(), id: response.id });

        dispatch({ type: "hideloading" });
      })
      .catch(() => {
        dispatch({ type: "hideloading" });
      });
  };
  useEffect(() => {
    getData();
    getPost();
  }, []);
  const getUserName = (text) => {
    const email = text;
    const username = email.substring(0, email.length - 10);
    return username;
  };

  const addorRemoveUser = (user) => {
    if (selectedUsers.find((obj) => obj.id == user.id)) {
      const temp = selectedUsers.filter((obj) => obj.id !== user.id);
      setSelectedUsers(temp);
    } else {
      const temp = [...selectedUsers];
      temp.push(user);
      setSelectedUsers(temp);
    }
   
  };
  const SharePost=async()=>{
    
    selectedUsers.forEach((user)=>{
      dispatch({ type: "showloading" });
      const tempShares=user.shares ?? []
      tempShares.push({...post,sharedBy:JSON.parse(localStorage.getItem("batman-user")),
    });
       setDoc(doc(fireDb,"users",user.id),{...user,shares:tempShares}).then(()=>{
        dispatch({ type: "hideloading" })
       });

    });
    toast.success('Post shared successfully')
    navigate('/')
  };
  return (
    <DefaultLayout>
      {post && data && (
        <div>
          <div className="my-5">
            <img src={post.imageURL} className="h-32 w-32" />
          </div>
          <hr />
          <h1 className="text-xl font-semibold text-gray-500">Select users</h1>

          <div className="grid grid-cols-5 md:grid-cols-1 gap-5 mt-5">
            {data.map((user) => {
              const alreadySelected = selectedUsers.find(
                (obj) => obj.id === user.id
              );
              return (
                <div
                  className={`cursor-pointer card p-5 justify-center items-center flex flex-col ${
                    alreadySelected && `border-4 border-primary`
                  }`}
                  onClick={() => {
                    addorRemoveUser(user);
                  }}
                >
                  <div className="h-24 w-24 rounded-full bg-gray-500 flex justify-center items-center text-white ">
                    <span className="text-5xl font-semibold ">
                      {getUserName(user.email)[0]}
                    </span>
                  </div>
                  <h1 className="text-xl text-gray-500 mt-5">
                    {getUserName(user.email)}
                  </h1>
                </div>
              );
            })}
          </div>
          <div className="mt-5">
          <button
              className=" bg-primary h-10 rounded-sm text-white px-10"
              onClick={SharePost}
            >
              Share
            </button>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}

export default SharePost;
