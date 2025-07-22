import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import "./layout.css";

const UserSchema = yup.object({
  userName: yup
    .string()
    .required("Username is required")
    .min(2, "Username must be at least 2 characters")
    .max(20, "Username must be less than 20 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
});

const Registration = ({ onRegister }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(UserSchema),
  });

  const onSubmit = (data) => {
    onRegister({ name: data.userName, status: "online" });
  };

  return (
    <div className="registration-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card registration-card rounded-4 shadow-lg fade-in">
              <div className="registration-header rounded-top-4">
                <h2 className="mb-2">
                  <i className="bi bi-chat-heart display-6 d-block mb-3"></i>
                  Welcome to ChatApp
                </h2>
                <p className="lead">
                  Join the conversation and connect with people around the world
                </p>
              </div>
              <div className="registration-body card-body p-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label
                      htmlFor="registeredUser"
                      className="form-label font-weight-bold"
                    >
                      <i className="bi bi-person me-2"></i>
                      Choose your username
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-at"></i>
                      </span>
                      <input
                        {...register("userName")}
                        id="registeredUser"
                        type="text"
                        className={`form-control form-control-lg ${
                          errors.userName ? "is-invalid" : ""
                        }`}
                        autoFocus
                        placeholder="Enter a unique username..."
                        autoComplete="off"
                      />
                      {errors.userName && (
                        <div className="invalid-feedback">
                          <i className="bi bi-exclamation-triangle me-1"></i>
                          {errors.userName.message}
                        </div>
                      )}
                    </div>
                    <div className="form-text">
                      <i className="bi bi-info-circle me-1"></i>
                      Use letters, numbers, and underscores only (2-20
                      characters)
                    </div>
                  </div>
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-gradient-primary btn-lg"
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Join Chat Room
                    </button>
                  </div>
                </form>

                <div className="mt-4 pt-3 border-top">
                  <div className="row text-center text-muted">
                    <div className="col-4">
                      <i className="bi bi-shield-check fs-4 d-block mb-1"></i>
                      <small>Secure</small>
                    </div>
                    <div className="col-4">
                      <i className="bi bi-lightning fs-4 d-block mb-1"></i>
                      <small>Fast</small>
                    </div>
                    <div className="col-4">
                      <i className="bi bi-people fs-4 d-block mb-1"></i>
                      <small>Social</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-3">
              <small className="text-white-50">
                <i className="bi bi-info-circle me-1"></i>
                By joining, you agree to our community guidelines
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
