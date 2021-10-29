import { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, TextField } from "@material-ui/core";
import logo from "../Assets/svgs/logo.svg";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { deriveKeyAction } from "../Redux/actions/encryptionAction";
import { Storage } from "react-jhipster";
import { Auth as AuthConstants } from "../Constants";
import { fetchEncryptedPassword } from "../Utils/Utils";
import toast from "react-hot-toast";

const LoginForm = ({ setIsLogin }) => {
  const [firstLogin, setFirstLogin] = useState(true);
  const dispatch = useDispatch();
  const { encryptedPassword } = useSelector((state) => state.encryption);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid Email Address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
  });

  const submitHandler = async (email, password) => {
    if (password && email && !formik.errors.password && !formik.errors.email) {
      let existingStorage = Storage.local.get(AuthConstants.USER_DATA);
      if (existingStorage) {
        let found = existingStorage.filter(
          (data) => data.email === formik.values.email
        );
        if (found && found.length > 0) {
          const tempPassword = await fetchEncryptedPassword(email, password);
          if (found[0].password === tempPassword) {
            setFirstLogin(false);
            await dispatch(deriveKeyAction(email, password));
          } else {
            toast.error("Incorrect Email or Password");
          }
        } else {
          await dispatch(deriveKeyAction(email, password));
        }
      } else {
        await dispatch(deriveKeyAction(email, password));
      }
    }
  };

  useEffect(() => {
    if (encryptedPassword) {
      if (firstLogin) {
        let existingStorage = Storage.local.get(AuthConstants.USER_DATA);
        if (!existingStorage) {
          Storage.local.set(AuthConstants.USER_DATA, []);
          existingStorage = [];
        }
        if (existingStorage) {
          const myObj = [
            ...existingStorage,
            {
              email: formik.values.email,
              password: encryptedPassword,
              data: null,
            },
          ];
          Storage.local.set(AuthConstants.USER_DATA, myObj);
        }
      }
      setIsLogin(true);
    }
  }, [encryptedPassword, setIsLogin, formik, firstLogin]);

  return (
    <LoginContainer>
      <form noValidate>
        <img src={logo} alt="lastpass-logo" />
        <TextField
          required
          id="email"
          name="email"
          className="mui-textfield"
          label="Email address"
          type="email"
          autoFocus={true}
          variant="standard"
          margin="normal"
          autoComplete="email"
          value={formik.values.email}
          // error={formik.touched.email && formik.errors.email}
          helperText={formik.touched.email && formik.errors.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          inputProps={{ form: { autocomplete: "off" } }}
        />
        <TextField
          required
          id="password"
          name="password"
          className="mui-textfield"
          label="Master Password"
          type="password"
          variant="standard"
          margin="normal"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          autoComplete="password"
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button
          className="mui-button"
          variant="contained"
          onClick={() =>
            submitHandler(formik.values.email, formik.values.password)
          }
        >
          Login
        </Button>
      </form>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  margin-top: 25vh;
  form {
    max-width: 30rem;
    height: 30vh;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    background: white;
    padding: 40px;
    border-radius: 0.6rem;
    border: 1px solid rgb(245, 247, 248);
    box-shadow: rgb(0 0 0 / 25%) 0px 2px 4px 0px;

    img {
      width: 13rem;
      margin: 0 auto;
      margin-top: -3.5rem;
      margin-bottom: -3.5rem;
      padding: 0;
      border: 0;
      display: flex;
    }

    .mui-button {
      margin-top: 2.2rem;
      border-radius: 2rem;
      opacity: 1;
      background-color: rgba(210, 45, 39);
      font-family: "Open Sans", sans-serif;
      font-size: 1rem;
      font-weight: 700;
      height: 3rem;
      text-align: center;
      :hover {
        opacity: 0.9;
        background-color: rgba(210, 45, 39);
      }
    }
  }
`;

export default LoginForm;
