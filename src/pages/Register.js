import { useEffect, useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import zxcvbn from "zxcvbn";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { routes, apis } from "../components/URLs";
import GoogleAuth from "../components/GoogleAuth";
import { login } from "../rtk/slices/authSlice";
import { useSelector, useDispatch } from "react-redux";

function Register() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [progressValue, setprogressValue] = useState(0);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invalid, setInvalid] = useState([]);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  let dataError = [];

  const handlerUserName = (e) => {
    setUserName(e.target.value);
  };

  const handlerEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlerPassword = (e) => {
    strongPassword(e.target.value);
    setPassword(e.target.value);
  };

  const strongPassword = (password) => {
    const checkStrongPassword = zxcvbn(password);
    setprogressValue(100 * (checkStrongPassword.score / 4));
  };

  const handlerConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handlerSubmit = (e) => {
    e.preventDefault();
    dataError = [];
    const reUserName = /\w+/g;
    const reEmail = /\w+@\w+\.\w{2,}/g;
    if (username == "") dataError.push("required user name");
    else if (!reUserName.test(username)) dataError.push("invaild user name");
    if (email == "") dataError.push("required email");
    else if (!reEmail.test(email)) dataError.push("invaild email");
    if (password == "") dataError.push("required password");
    else if (progressValue <= 50) dataError.push("invaild password");
    if (confirmPassword !== password) dataError.push("password is not match");
    console.log(dataError);
    if (dataError == "") {
      let loading = document.querySelector(".loading");
      let loading_bar = document.createElement("span");
      loading_bar.className = "spinner-border";
      loading_bar.style.height = "1.2rem";
      loading_bar.style.width = "1.2rem";
      loading_bar.style.borderWidth = "0.2rem";
      loading.innerHTML = "";
      loading.appendChild(loading_bar);
      signup();
    } else setInvalid(dataError);
  };

  async function signup() {
    await fetch(apis.Register, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: username,
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === true) {
          navigate(routes.ActiveEmail, { state: { data_user: data } });
          toast.success(data.msg);
        } else {
          toast.error(data.msg);
        }
        setButton();
      })
      .catch((rej) => {
        setButton();
        toast.error(rej);
      });
  }

  const setButton = () => {
    let loading = document.querySelector(".loading");
    loading.innerHTML = "Sign Up";
  };

  const register_by_google = async (data) => {
    await fetch(apis.RegisterByGoogle, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        googleId: data.sub,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === true) {
          dispatch(login(data));
          navigate(routes.Home);
          toast.success(data.msg);
        } else {
          toast.error(data.msg);
        }
      })
      .catch((rej) => {
        setButton();
        toast.error(rej);
      });
  };

  function titleForm(title) {
    document.documentElement.style.setProperty("--logo-form", `'${title}'`);
  }

  useEffect(() => {
    titleForm("Register");
  }, []);

  useEffect(() => {
    invalid.map((inputError) => {
      toast.error(inputError);
    });
  }, [invalid]);

  return (
    <div className="container">
      <form onSubmit={handlerSubmit}>
        <Input
          type="text"
          name="user name"
          value={username}
          onChange={handlerUserName}
        />
        <Input
          type="email"
          name="email"
          value={email}
          onChange={handlerEmail}
        />
        <Input
          type="password"
          name="password"
          value={password}
          progress={progressValue}
          onChange={handlerPassword}
        />
        <Input
          type="password"
          name="confirm password"
          value={confirmPassword}
          progress="false"
          onChange={handlerConfirmPassword}
        />

        <GoogleAuth handleData={register_by_google} />

        <Button
          label="sign up"
          link={[{ to: routes.Login, label: "i have an account" }]}
        />
        {/* <Error invalid={invalid} /> */}
      </form>
    </div>
  );
}

export default Register;
