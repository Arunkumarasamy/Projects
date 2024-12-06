import React, { useState, useRef } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  BackTo,
  PreviewCard,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { Steps, Step } from "react-step-builder";
import { Row, Col, FormGroup, Button } from "reactstrap";

const ProductInfo = (props) => {
  const [formData, setFormData] = useState({
    tokenAddress: "",
    contribute: "",
    telegram: "",
  });

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { errors, handleSubmit, register } = useForm();

  const submitForm = (data) => {
    //window.location.reload();
    props.next();
  };

  return (
    <div className="flex align-middle justify-center">
      <form className="content clearfix" onSubmit={handleSubmit(submitForm)}>
        <Row className="gy-3">
          <Col md="12">
            <FormGroup>
              <label className="form-label" htmlFor="fw-token-address">
                Product Asin
              </label>
              <div className="form-control-wrap">
                <input
                  type="text"
                  className="form-control"
                  id="fw-token-address"
                  name="tokenAddress"
                  ref={register({ required: true })}
                  onChange={(e) => onInputChange(e)}
                />
                {errors.tokenAddress && <span className="invalid">This field is required</span>}
              </div>
            </FormGroup>
          </Col>
          <Col md="12" className="mt-1">
            <label className="form-label pb-1">Select option</label>
            <ul className="d-flex flex-wrap g-2 flex-column">
              <li>
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    className="custom-control-input"
                    name="ethRadio"
                    id="fw-lt1eth"
                    ref={register({ required: true })}
                    checked={formData.contribute === "leEth" ? true : false}
                    onChange={() => setFormData({ ...formData, contribute: "leEth" })}
                  />
                  {errors.ethRadio && <span className="invalid">This field is required</span>}
                  <label className="custom-control-label" htmlFor="fw-lt1eth">
                    Option 1
                  </label>
                </div>
              </li>
              <li>
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    className="custom-control-input"
                    name="ethRadio"
                    id="fw-ov1eth"
                    ref={register({ required: true })}
                    checked={formData.contribute === "ovEth" ? true : false}
                    onChange={() => setFormData({ ...formData, contribute: "ovEth" })}
                  />
                  <label className="custom-control-label" htmlFor="fw-ov1eth">
                    Option 2
                  </label>
                </div>
              </li>
            </ul>
          </Col>
        </Row>
        <div className="actions clearfix">
          <ul>
            <li>
              <Button color="primary" type="submit">
                Submit
              </Button>
            </li>
          </ul>
        </div>
      </form>
    </div>
  );
};

const Header = (props) => {
  return (
    <div className="steps clearfix">
      <ul>
        <li className={props.current >= 1 ? "first done" : "first"}>
          <a href="#wizard-01-h-0" onClick={(ev) => ev.preventDefault()}>
            <span className="number"></span> <h5>Input</h5>
          </a>
        </li>

        <li className={props.current === 2 ? "last done" : "last"}>
          <a href="#wizard-01-h-2" onClick={(ev) => ev.preventDefault()}>
            <span className="current-info audible">current step: </span>
            <span className="number"></span> <h5>Results</h5>
          </a>
        </li>
      </ul>
    </div>
  );
};

const Success = (props) => {
  return (
    <div className="d-flex justify-content-center align-items-center p-3">
      <BlockTitle tag="h6" className="text-center">
        Results
      </BlockTitle>
    </div>
  );
};

const config = {
  before: Header,
};

const MarketFeedback = () => {
  return (
    <React.Fragment>
      <div className="marketfeedback nk-content nk-content-fluid">
        <Head title="Market feedback" />
        <Content page="component">
          <BlockHead size="lg" className="!pb-6">
            <BlockHeadContent>
              <div className="flex flex-row justify-center text-center">
                <div className="flex"></div>
                <div>
                  <BlockTitle tag="h2" className="fw-bold !text-2xl !pt-2 !mb-1">
                    Market Feedback{" "}
                  </BlockTitle>
                  <BlockDes>
                    <p className="lead">This tool let you analyze products review and...</p>
                  </BlockDes>
                </div>
              </div>
            </BlockHeadContent>
          </BlockHead>
<div className="flex align-middle justify-center mt-2">
          <Block >
            <PreviewCard>
              <div className="nk-wizard nk-wizard-simple is-alter wizard clearfix">
                <Steps config={config}>
                  <Step component={ProductInfo} className="max-w-[450px]"/>
                  <Step component={Success} />
                </Steps>
              </div>
            </PreviewCard>
          </Block>
          </div>
        </Content>
      </div>
    </React.Fragment>
  );
};

export default MarketFeedback;
