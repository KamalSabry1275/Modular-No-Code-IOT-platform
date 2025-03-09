import { useEffect, useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Error from "../components/Error";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import zxcvbn from "zxcvbn";
import { apis, routes } from "../components/URLs";
import VerificationCodeInput from "../components/VerificationCodeInput";

const statusUser = {
  login: "login",
  sentEmail: "sentEmail",
  sentCode: "sentCode",
  resetPassword: "resetPassword",
};

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invalid, setInvalid] = useState([]);
  const [resetPassword, setResetPassword] = useState(statusUser.sentEmail);
  const [progressValue, setprogressValue] = useState(0);

  const navigate = useNavigate();

  let dataError = [];

  const handleEmail = async (e) => {
    setEmail(e.target.value);
  };

  const handleCode = (c) => {
    setCode(c);
  };

  const handlePassword = (e) => {
    strongPassword(e.target.value);
    setPassword(e.target.value);
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const strongPassword = (password) => {
    const checkStrongPassword = zxcvbn(password);
    setprogressValue(100 * (checkStrongPassword.score / 4));
  };

  const handlerSubmit = (e) => {
    e.preventDefault();
    const reEmail = /\w+@\w+\.\w{2,}/g;
    dataError = [];

    if (email != "" && resetPassword == statusUser.sentEmail) {
      if (!reEmail.test(email)) dataError.push("invaild email");
      else {
        sentCodeForEmail();
      }
    } else if (code != "" && resetPassword == statusUser.sentCode) {
      console.log(code);
      setResetPassword(statusUser.resetPassword);
    } else if (resetPassword == statusUser.resetPassword) {
      if (progressValue <= 50) dataError.push("invaild password");
      if (confirmPassword !== password) dataError.push("password is not match");

      if (dataError == "") hundleResetPassword();
    }

    setInvalid(dataError);
  };

  const hundleResetPassword = async () => {
    await fetch(apis.ResetPassword, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        token: code,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === true) {
          toast.success(data.msg);
          setResetPassword(statusUser.login);
          navigate(routes.Login);
        } else toast.error(data.msg);
      })
      .catch((rej) => toast.error("operation is invalid"));
  };

  const sentCodeForEmail = async () => {
    await fetch(apis.ForgetPassword, {
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
          setResetPassword(statusUser.sentCode);
        } else toast.error(data.msg);
      })
      .catch((rej) => toast.error("operation is invalid"));
  };

  const titleForm = (title) => {
    document.documentElement.style.setProperty("--logo-form", `'${title}'`);
  };

  useEffect(() => {
    titleForm("reset password");
  }, []);

  useEffect(() => {
    invalid.map((inputError) => {
      toast.error(inputError);
    });
  }, [invalid]);

  return (
    <div className="container">
      <form onSubmit={handlerSubmit}>
        {resetPassword == statusUser.sentEmail && (
          <Input
            type="email"
            name="email"
            value={email}
            onChange={handleEmail}
          />
        )}
        {resetPassword == statusUser.sentCode && (
          <div className="check_code">
            <label>Code</label>
            <VerificationCodeInput onChange={handleCode} />
          </div>
        )}{" "}
        {resetPassword == statusUser.resetPassword && (
          <>
            <Input
              type="password"
              name="password"
              progress={progressValue}
              value={password}
              onChange={handlePassword}
            />

            <Input
              type="password"
              name="confirm password"
              value={confirmPassword}
              onChange={handleConfirmPassword}
              progress="false"
            />
          </>
        )}
        <Button label="next" />
      </form>
    </div>
  );
}
export default ResetPassword;
