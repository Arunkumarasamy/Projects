import React, { useState } from "react";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from "../../components/Component";
import { Spinner, FormGroup } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = ({ history }) => {
  const [passState, setPassState] = useState(false);
  const [loading, setLoading] = useState(false);
  const { errors, register, handleSubmit } = useForm();

  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [passw, setPassw] = useState("");

  const onFormSubmit = () => {
    setLoading(true);

    const config = {
      method: "post",
      url: "https://api.agilensmart.com/Users/Register",
      headers: {},
      data: { username: user, email: email, password: passw },
    };

    console.log(config.data);

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setLoading(false);
        history.push(`${process.env.PUBLIC_URL}/auth-success`)
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };
  return (
    <React.Fragment>
      <Head title="Register" />
      <div className="bg-login">
        <PageContainer>
          <Block className="nk-block-middle nk-auth-body  wide-xs">
            <div className="brand-logo pb-4 text-center">
              <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link">
                <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
                <img className="logo-dark logo-img logo-img-lg" src={Logo} alt="logo-dark" />
              </Link>
            </div>
            <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
              <BlockHead>
                <BlockContent>
                  <BlockTitle tag="h4">Register</BlockTitle>
                  <BlockDes>
                    <p>Create New Headlinema Account</p>
                  </BlockDes>
                </BlockContent>
              </BlockHead>
              <form className="is-alter" onSubmit={handleSubmit(onFormSubmit)}>
                <FormGroup>
                  <label className="form-label" htmlFor="name">
                    Username
                  </label>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      id="user"
                      name="user"
                      placeholder="Enter your name"
                      onChange={(e) => setUser(e.target.value)}
                      ref={register({ required: true })}
                      className="form-control-lg form-control"
                    />
                    {errors.user && <p className="invalid">This field is required</p>}
                  </div>
                </FormGroup>
                <FormGroup>
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Email
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      bssize="lg"
                      id="email"
                      name="email"
                      onChange={(e) => setEmail(e.target.value)}
                      ref={register({ required: true })}
                      className="form-control-lg form-control"
                      placeholder="Enter your email address or username"
                    />
                    {errors.email && <p className="invalid">This field is required</p>}
                  </div>
                </FormGroup>
                <FormGroup>
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <a
                      href="#password"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setPassState(!passState);
                      }}
                      className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                    >
                      <Icon name="eye" className="passcode-icon icon-show"></Icon>

                      <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                    </a>
                    <input
                      type={passState ? "text" : "password"}
                      id="passw"
                      name="passw"
                      onChange={(e) => setPassw(e.target.value)}
                      ref={register({ required: "This field is required" })}
                      placeholder="Enter your passcode"
                      className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                    />
                    {errors.passw && <span className="invalid">{errors.passw.message}</span>}
                  </div>
                </FormGroup>
                <FormGroup>
                  <Button type="submit" color="primary" size="lg" className="btn-block">
                    {loading ? <Spinner size="sm" color="light" /> : "Register"}
                  </Button>
                </FormGroup>
              </form>
              <div className="form-note-s2 text-center pt-4">
                {" "}
                Already have an account?{" "}
                <Link to={`${process.env.PUBLIC_URL}/auth-login`}>
                  <strong>Sign in instead</strong>
                </Link>
              </div>
            </PreviewCard>
          </Block>
          <AuthFooter />
        </PageContainer>
      </div>
    </React.Fragment>
  );
};

export default Register;
