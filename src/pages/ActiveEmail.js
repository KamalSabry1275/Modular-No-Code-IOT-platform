import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Input from "../components/Input";
import { useFetch } from "../hooks/useFetch";
import { apis, routes } from "../components/URLs";
import { useNavigate } from "react-router-dom";
import VerificationCodeInput from "../components/VerificationCodeInput";
import { login } from "../rtk/slices/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const statusUser = {
  sentEmail: "sentEmail",
  activeEmail: "activeEmail",
};

export const ActiveEmail = () => {
  const location = useLocation();
  const data_user = location.state?.data_user;

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [activeEmail, setActiveEmail] = useState(statusUser.sentEmail);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleCode = (c) => {
    setCode(c);
  };

  const sentCodeForEmail = async () => {
    await fetch(apis.SendEmailVerify, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === true) {
          toast.info(data.msg);
          if (data.msg !== "This Email is already verified") {
            setActiveEmail(statusUser.activeEmail);
          }
        } else toast.error(data.msg);
      })
      .catch((rej) => toast.error(rej));
  };

  const handleActiveEmail = async () => {
    await fetch(apis.VerifyEmail, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        verifyCode: code,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === true) {
          dispatch(login(data_user));
          navigate(routes.Home);
          toast.success(data.msg);
        } else toast.error(data.msg);
      })
      .catch((rej) => toast.error(rej));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeEmail == statusUser.sentEmail && email != "") {
      sentCodeForEmail();
    } else if (activeEmail == statusUser.sentEmail && code == "") {
      toast.info("Email is empty");
    } else if (activeEmail == statusUser.activeEmail && code != "") {
      handleActiveEmail();
    } else if (activeEmail == statusUser.activeEmail && code == "") {
      toast.info("Code is empty");
    }
  };

  function titleForm(title) {
    document.documentElement.style.setProperty("--logo-form", `'${title}'`);
  }

  useEffect(() => {
    titleForm("Active Email");
  }, []);

  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit}>
          {activeEmail == statusUser.sentEmail ? (
            <>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={handleEmail}
              />
            </>
          ) : (
            <>
              {" "}
              <div className="check_code">
                <label>Code</label>
                <VerificationCodeInput onChange={handleCode} />
              </div>
            </>
          )}

          <Button label="next" />
        </form>
      </div>
    </>
  );
};
