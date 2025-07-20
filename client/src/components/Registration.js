import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const UserSchema = yup.object({
  userName: yup.string().required(),
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
    <div className="user-registration" id="userRegistration">
      <h2>Register Yourself First!</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-11">
            <div className="well">
              <label htmlFor="registeredUser">Enter username:</label>
              <input
                type="text"
                className="form-control"
                {...register("userName")}
                placeholder="Enter username"
                autoComplete="off"
              />
              {errors.userName && (
                <div className="invalid-feedback d-block">
                  {errors.userName.message}
                </div>
              )}
              <button type="submit" className="btn btn-default btn-success">
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Registration;
