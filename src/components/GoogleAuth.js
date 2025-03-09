import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

function GoogleAuth({ handleData = () => {} }) {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      //console.log(tokenResponse.access_token);
      try {
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              // "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
            },
          }
        );
        const data = await res.json();
        //console.log(data);
        console.log(data.email + "\n" + data.name);
        handleData(data);
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <>
      <hr />
      <div className="field_form">
        <button className="login_btn" type="button" onClick={() => login()}>
          <FcGoogle />
          Contiune With Google
        </button>
      </div>
    </>
  );
}

export default GoogleAuth;
