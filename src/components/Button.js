import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../rtk/slices/resetPasswordSlice";

export const AnimationButtonLoadingStart = () => {
  let loading = document.querySelector(".loading");
  let loading_bar = document.createElement("span");
  loading_bar.className = "spinner-border";
  loading_bar.style.height = "1.2rem";
  loading_bar.style.width = "1.2rem";
  loading_bar.style.borderWidth = "0.2rem";
  loading.innerHTML = "";
  loading.appendChild(loading_bar);
};

export const AnimationButtonLoadingStop = (label = "Submit") => {
  let loading = document.querySelector(".loading");
  loading.innerHTML = label;
};

function Button({ label = "Submit", link }) {
  const access = useSelector((state) => state.resetPassword);
  const dispatch = useDispatch();
  return (
    <div className="field_form submit_form">
      <button className="btn  btn-success loading" type="submit">
        {label}
      </button>
      <div>
        {link?.map((link, i) => {
          return (
            <Link
              onClick={() => {
                if (link.access == "resetpassword")
                  dispatch(resetPassword(true));
              }}
              key={i}
              to={link.to}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Button;
