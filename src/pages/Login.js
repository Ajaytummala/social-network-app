import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { app, fireDb } from "../firebaseConfig";

function Login() {
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store);
  const navigate=useNavigate()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    dispatch({ type: "showLoading" });
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        getDoc(doc(fireDb, "users", user.uid)).then((user) => {
          localStorage.setItem(
            "batman-user",
            JSON.stringify({ ...user.data(), id: user.id })
          );
          navigate('/')
          toast.success("Login Successfull");
        });
        dispatch({ type: "hideLoading" });
        
      })

      .catch((error) => {
        toast.error("Login Failed");
        dispatch({ type: "hideLoading" });
      });
  };


  return (
    <div className="h-screen flex justify-between  flex-col overflow-x-hidden">
      {loading && <Loader />}
      {/* topcorner */}
      <div className="flex justify-start">
        <div className="h-40 bg-primary w-96 transform -skew-x-[25deg] -ml-10 flex items-center justify-center ">
          <h1 className="text-center text-6xl font-semibold text-white skew-x-[25deg]">
            DANGER
          </h1>
        </div>
      </div>

      {/* form */}
      <div className="flex justify-center">
        <div className="w-[420px] flex flex-col space-y-5 card p-10">
          <h1 className="text-4xl text-primary font-semibold"> Gotham Entry</h1>
          <hr />
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            className="border border-gray-300 h-10 rounded-sm focus:border-primary-500 pl-5"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="border border-gray-300 h-10 rounded-sm focus:border-primary-500 pl-5"
          />
          <div className="flex justify-end">
            <button
              className=" bg-primary h-10 rounded-sm text-white px-10"
              onClick={login}
            >
              LOGIN
            </button>
          </div>
          <hr />
          <Link to="/register" className="text-[14px] text-primary">
            NOT YET REGISTER? CLICK HERE TO REGISTER
          </Link>
        </div>
      </div>

      {/* bottomcorner */}

      <div className="flex justify-end">
        <div className="h-40 bg-primary w-96 transform skew-x-[25deg] -mr-10 flex items-center justify-center ">
          <h1 className="text-center text-6xl font-semibold text-white -skew-x-[25deg]">
            SAFE
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Login;
