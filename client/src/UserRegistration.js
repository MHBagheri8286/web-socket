import React from "react";
import {Navigate, useNavigate} from 'react-router-dom';

const UserRegistration = () => {

  return (
    <div className="user-registration" id="userRegistration">
      <h2>Register Yourself First!</h2>
      <div className="row">
        <form >

        </form>
        <div className="col-md-11">
          <div className="well">
            <label htmlFor="registeredUser">Enter username:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              id="registeredUser"
            />
            {/* <button type="submit">

            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
