import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { fireDb, app } from "../firebaseConfig";
import { useSelector, useDispatch } from "react-redux";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((store) => store);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");

  const register = () => {
    dispatch({ type: "showLoading" });
    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        const userData = {
          email: user.email,
          profilePicUrl: "",
          bio: "Hi, I am in gotham",
        };

        setDoc(doc(fireDb, "users", user.uid), userData);

        toast.success("Registration Successfull");
        dispatch({ type: "hideLoading" });
        navigate('/login');
      })
      .catch((error) => {
        console.log(error);

        toast.error("Something Went Wrong");
        dispatch({ type: "hideLoading" });
      });
  };

 
  return (
    <div className="h-screen flex justify-between  flex-col overflow-x-hidden bg-primary">
      {/* topcorner */}
      {loading && <Loader />}
      <div className="flex justify-start">
        <div className="h-40 bg-white w-96 transform -skew-x-[25deg] -ml-10 flex items-center justify-center ">
          <h1 className="text-center text-6xl font-semibold text-primary skew-x-[25deg]">
            DANGER
          </h1>
        </div>
      </div>

      {/* form */}
      <div className="flex justify-center bg-primary">
        <div className="w-[420px] flex flex-col space-y-5 card p-10">
          <h1 className="text-4xl text-white font-semibold"> Gotham Entry</h1>
          <hr />
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            className="border border-gray-600 h-10 rounded-sm focus:border-primary-500 pl-5  text-white-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="border border-gray-600 h-10 rounded-sm focus:border-primary-500 pl-5  text-white-400"
          />
          <input
            type="password"
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
            placeholder="confirm-password"
            className="border border-gray-600 h-10 rounded-sm focus:border-primary-500 pl-5  text-white-400"
          />
          <div className="flex justify-end">
            <button
              className=" bg-white h-10 rounded-sm text-primary px-10 "
              onClick={register}
            >
              REGISTER
            </button>
          </div>
          <hr />
          <Link to="/Login" className="text-[14px] text-white">
            ALREADY REGISTERED? CLICK HERE TO LOGIN
          </Link>
        </div>
      </div>

      {/* bottomcorner */}

      <div className="flex justify-end">
        <div className="h-40 bg-white  w-96 transform skew-x-[25deg] -mr-10 flex items-center justify-center ">
          <h1 className="text-center text-6xl font-semibold text-primary -skew-x-[25deg]">
            SAFE
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Register;
