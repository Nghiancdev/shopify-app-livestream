import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const Auth = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const navigate = useNavigate();
  console.log("token: ", token);
  const session = {
    session_token: token,
  };
  useEffect(() => {
    axios
      .post(`https://api.windoo.vn/api/auth/login/user`, session, {
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Login posted successfully:", response.data);

        if (response.status === 200) {
          sessionStorage.setItem("shop_domain", response.data.domain_shop);
          sessionStorage.setItem("access_token", response.data.access_token);
          sessionStorage.setItem("token", response.headers["x-authorization"]);
          sessionStorage.setItem("user_name", response.data.user_name);
          sessionStorage.setItem("user_avatar", response.data.user_avatar);
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error posting comment:", error);
        // Xử lý lỗi tại đây nếu cần
      });
  }, []);
  return <div>Auth </div>;
};

export default Auth;
