import React, { useEffect, useState } from "react";
import { customAlphabet } from "nanoid";
import { useForm } from "react-hook-form";

import { getInnerText } from "@lukaspolak/react-get-inner-text";
import copy from "copy-to-clipboard";
import Content from "../../../../layout/content/Content";
import Head from "../../../../layout/head/Head";
import makeAnimated from "react-select/animated";
import { FormGroup, Label, Spinner, Input, Row, Col } from "reactstrap";
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  BackTo,
  PreviewCard,
  Icon,
  Button,
} from "../../../../components/Component";
import { Card } from "@mui/material";
import { RSelect } from "../../../../components/Component";
import axios from "axios";
import Bg from "../../../../images/bg.png";

const Optimizer = () => {
  const [file, setFile] = useState("");
  const animatedComponents = makeAnimated();
  const [loading, setLoading] = useState(false);
  const nanoid = customAlphabet("1234567890", 10);

  const [outputs, setOutputs] = React.useState([
    {
      id: 1,
      asin: "",
      description: "",
      key_benefits: "",
      content: "",
      generation: "",
    },
  ]);

  const deleteOutputs = () => {
    setOutputs([
      {
        id: 1,
        asin: "",
        description: "",
        key_benefits: "",
        content: "",
        generation: "",
      },
    ]);
  };

  const deleteOutput = (contactId) => {
    const newOutputs = [...outputs];
    const index = outputs.findIndex((output) => output.id === contactId);
    newOutputs.splice(index, 1);
    setOutputs(newOutputs);
  };

  const Input = () => {
    const { errors, register, handleSubmit } = useForm();

    const [formInputs, setFormInputs] = React.useState([
      {
        asin: "",
        description: "",
        key_benefits: "",
      },
    ]);

    function handleFormChange(evt) {
      const formInput = evt.target.value;
      setFormInputs({ ...formInputs, [evt.target.name]: formInput });
      console.log(formInputs);
    }

    const [languageValue, setLanguageValue] = React.useState("English");
    const handleChange = (event) => {
      setLanguageValue(event.target.value);
    };

    const [contentValue, setContentValue] = React.useState("Seo optimized");
    const handleChange2 = (event) => {
      setContentValue(event.target.value);
    };

   

    const [value2, setValue2] = React.useState("1");
    const handleChange4 = (event) => {
      setValue2(event.target.value);
    };

    function handleAddFormChange(event) {
      const newInput = {
        asin: formInputs.asin,
        description: formInputs.description,
        key_benefits: formInputs.key_benefits,
        keywords: formInputs.keywords,
        language: languageValue,
        content: contentValue,
      };

      const Generation = () => {
        setLoading(true);



            let data = JSON.stringify({
              product_name: newInput.product_name,
              description: newInput.description,
              features: newInput.key_benefits,
              keywords: newInput.keywords,
              category: newInput.category,
              unique_selling_points: newInput.unique_selling_points,
              target_audience: newInput.target_audience,
              language: newInput.language,
              content: newInput.content,
            });
            
            let config = {
              method: 'post',
              maxBodyLength: Infinity,
              url: 'https://alizon-server.herokuapp.com/api/optimize-description',
              headers: { 
                'Content-Type': 'application/json'
              },
              data : data
            };
            
            axios.request(config)
            .then((response) => {
            const newOutput = {
              id: nanoid(),
              asin: newInput.asin,
              generation: response.data,
            };

            setOutputs([...outputs, newOutput]);
            setLoading(false);
            console.log(outputs);
          })
          .catch(function (error) {
            setLoading(false);
          });
      };

      if (value2 === "3") {
        Generation(), Generation(), Generation();
      } else if (value2 === "2") {
        Generation(), Generation();
      } else if (value2 === "1") {
        Generation();
      }
    }

    return (
      <form onSubmit={handleSubmit(handleAddFormChange)}>
        <Row className="gy-2">
          <Col sm="12">
            <FormGroup>
              <Label htmlFor="default-2" className="form-label">
                ASIN
              </Label>
              <div className="form-control-wrap">
                <div className="form-icon form-icon-left">
                  <Icon name="box" />
                </div>
                <input
                  className="form-control"
                  name="asin"
                  defaultValue={formInputs.asin}
                  onChange={handleFormChange}
                  ref={register({ required: true })}
                  type="text"
                  id="asin"
                  placeholder="Insert ASIN"
                />
                {errors.asin && <p className="invalid">This field is required</p>}
              </div>
            </FormGroup>
          </Col>
          <Col sm="12">
            <FormGroup>
              <Label htmlFor="default-textarea" className="form-label">
                Product name
              </Label>
              <div className="form-control-wrap">
                <input
                  name="product_name"
                  defaultValue={formInputs.product_name}
                  className="no-resize form-control"
                  type="textarea"
                  onChange={handleFormChange}
                  ref={register({ required: true })}
                  id="product_name"
                  placeholder="Insert the name of the product"
                />
                {errors.product_name && <p className="invalid">This field is required</p>}
              </div>
            </FormGroup>
          </Col>
          <Col sm="12">
            <FormGroup>
              <Label htmlFor="default-textarea" className="form-label">
                Description
              </Label>
              <div className="form-control-wrap">
                <input
                  name="description"
                  defaultValue={formInputs.description}
                  className="no-resize form-control"
                  type="textarea"
                  onChange={handleFormChange}
                  ref={register({ required: true })}
                  id="description"
                  placeholder="Insert details of the product"
                />
                {errors.description && <p className="invalid">This field is required</p>}
              </div>
            </FormGroup>
          </Col>

          <Col sm="12">
            <FormGroup>
              <Label htmlFor="default-2" className="form-label">
                Key benefits/features
              </Label>
              <div className="form-control-wrap">
                <div className="form-icon form-icon-left">
                  <Icon name="crosshair" />
                </div>
                <input
                  className="form-control"
                  name="key_benefits"
                  onChange={handleFormChange}
                  ref={register({ required: true })}
                  defaultValue={formInputs.key_benefits}
                  type="text"
                  id="key_benefits"
                  placeholder="Insert key benefits and features"
                />
                {errors.key_benefits && <p className="invalid">This field is required</p>}
              </div>
            </FormGroup>
          </Col>

          <Col sm="12">
            <FormGroup>
              <Label htmlFor="default-2" className="form-label">
                Keywords
              </Label>
              <div className="form-control-wrap">
                <div className="form-icon form-icon-left">
                  <Icon name="pen" />
                </div>
                <input
                  className="form-control"
                  name="keywords"
                  onChange={handleFormChange}
                  ref={register({ required: true })}
                  defaultValue={formInputs.keywords}
                  type="text"
                  id="keywords"
                  placeholder="Insert keywords"
                />
                {errors.keywords && <p className="invalid">This field is required</p>}
              </div>
            </FormGroup>
          </Col>

          <Col sm="12">
            <FormGroup>
              <Label htmlFor="default-2" className="form-label">
                Category
              </Label>
              <div className="form-control-wrap">
                <div className="form-icon form-icon-left">
                  <Icon name="pen" />
                </div>
                <input
                  className="form-control"
                  name="category"
                  onChange={handleFormChange}
                  ref={register({ required: true })}
                  defaultValue={formInputs.category}
                  type="text"
                  id="category"
                  placeholder="Insert category"
                />
                {errors.category && <p className="invalid">This field is required</p>}
              </div>
            </FormGroup>
          </Col>

          <Col sm="12">
            <FormGroup>
              <Label htmlFor="default-2" className="form-label">
                Unique selling points
              </Label>
              <div className="form-control-wrap">
                <div className="form-icon form-icon-left">
                  <Icon name="pen" />
                </div>
                <input
                  className="form-control"
                  name="unique_selling_points"
                  onChange={handleFormChange}
                  ref={register({ required: true })}
                  defaultValue={formInputs.unique_selling_points}
                  type="text"
                  id="unique_selling_points"
                  placeholder="Insert unique selling points"
                />
                {errors.unique_selling_points && <p className="invalid">This field is required</p>}
              </div>
            </FormGroup>
          </Col>

          
          <Col sm="12">
            <FormGroup>
              <Label htmlFor="default-2" className="form-label">
                Target audience
              </Label>
              <div className="form-control-wrap">
                <div className="form-icon form-icon-left">
                  <Icon name="pen" />
                </div>
                <input
                  className="form-control"
                  name="target_audience"
                  onChange={handleFormChange}
                  ref={register({ required: true })}
                  defaultValue={formInputs.target_audience}
                  type="text"
                  id="target_audience"
                  placeholder="Insert target audience"
                />
                {errors.unique_selling_points && <p className="invalid">This field is required</p>}
              </div>
            </FormGroup>
          </Col>
        </Row>

        <FormGroup aria-label="gender" name="gender1">
        <Row className="!mt-8 !pl-[5px]">
            <Col xl="12">
              <div className="preview-block">
                <span className="preview-title overline-title">Language</span>
                <div className="g-4 align-center flex-wrap">
                  <div className="g">
                    <div className="custom-control custom-control-sm custom-radio">
                      <input
                        type="radio"
                        className="custom-control-input form-control"
                        name="gender"
                        onChange={handleChange}
                        defaultValue={languageValue}
                        id="customRadio1"
                        defaultChecked="true"
                      />
                      <label className="custom-control-label" htmlFor="customRadio1">
                        English
                      </label>
                    </div>
                  </div>
                  <div className="g">
                    <div className="custom-control custom-control-sm custom-radio">
                      <input
                        type="radio"
                        className="custom-control-input form-control"
                        name="gender"
                        value="Italian"
                        id="customRadio2"
                      />
                      <label className="custom-control-label" htmlFor="customRadio2">
                        Italian
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          </FormGroup>
        <FormGroup aria-label="outputs" name="outputs" defaultValue={contentValue} onChange={handleChange2}>
          <Row className="!mt-8 !pl-[5px]">
            <Col xl="12">
              <div className="preview-block">
                <span className="preview-title overline-title">Content</span>
                <div className="g-4 align-center flex-wrap">
                  <div className="g">
                    <div className="custom-control custom-control-sm custom-radio">
                      <input
                        type="radio"
                        className="custom-control-input form-control"
                        name="gender2"
                        onChange={handleChange2}
                        defaultValue={contentValue}
                        id="customRadio2"
                        defaultChecked="true"
                      />
                      <label className="custom-control-label" htmlFor="customRadio1">
                        Seo optimized
                      </label>
                    </div>
                  </div>
                  <div className="g">
                    <div className="custom-control custom-control-sm custom-radio">
                      <input
                        type="radio"
                        className="custom-control-input form-control"
                        name="gender"
                        value="Conversion optimized"
                        id="customRadio2"
                      />
                      <label className="custom-control-label" htmlFor="customRadio2">
                        Conversion optimized
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </FormGroup>
        <FormGroup aria-label="outputs" name="outputs" defaultValue={value2} onChange={handleChange4}>
          <Row className="!mt-8 !pl-[5px]">
            <Col xl="12">
              <div className="preview-block">
                <span className="preview-title overline-title">Outputs</span>
                <div className="g-4 align-center flex-wrap">
                  <div className="g">
                    <div className="custom-control custom-control-sm custom-radio">
                      <input
                        type="radio"
                        className="custom-control-input form-control"
                        name="radioSize"
                        id="customRadio3"
                        value="1"
                        defaultChecked="true"
                      />
                      <label className="custom-control-label" htmlFor="customRadio3">
                        1
                      </label>
                    </div>
                  </div>
                  <div className="g">
                    <div className="custom-control custom-control-sm custom-radio">
                      <input
                        type="radio"
                        className="custom-control-input form-control"
                        name="radioSize"
                        id="customRadio4"
                        value="2"
                      />
                      <label className="custom-control-label" htmlFor="customRadio4">
                        2
                      </label>
                    </div>
                  </div>
                  <div className="g">
                    <div className="custom-control custom-control-sm  custom-radio">
                      <input
                        type="radio"
                        className="custom-control-input form-control"
                        name="radioSize"
                        id="customRadio5"
                        value="3"
                      />
                      <label className="custom-control-label" htmlFor="customRadio5">
                        3
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </FormGroup>

        <Row className="!mt-6">
          <Col xl="12" className="!flex !flex-row-reverse">
            <Button size="lg" color="secondary" type="submit" variant="contained">
              {loading ? <Spinner size="sm" color="light" /> : "Generate"}
            </Button>
          </Col>
        </Row>
      </form>
    );
  };

  function Responses() {
    const ref = React.useRef();

    useEffect(() => {
      const messageBody = document.getElementById("responses");
      messageBody.scroll({ top: messageBody.scrollHeight, behavior: "smooth" });
    }, []);

    return (
      <div className="responses" id="responses">
        {outputs.map((output) => {
          const CardOutput = () => {
            return (
              <>
                <div className="flex flex-row-reverse text-xs text-gray-500">
                  <span>req. {output.id}</span>
                </div>
                <div ref={ref} className="!pt-6 !pb-4 !pl-4 !pr-4">
                  {output.generation}
                </div>
              </>
            );
          };

          const copyToClipboard = () => {
            const innerText = getInnerText(<div>{output.generation}</div>);
            copy(innerText);
            console.log(innerText);
          };

          return (
            <div key={output.id} className="cardoutput">
              <Card sx={{ p: 3 }} className={output.id === 1 ? "!hidden" : ""}>
                <CardOutput />
                <div className="flex flex-row-reverse">
                  <Button
                    type="button"
                    color="primary"
                    className="!mt-3 !ml-2"
                    onClick={deleteOutput}
                    variant="contained"
                  >
                    delete{" "}
                  </Button>

                  <Button
                    type="button"
                    color="primary"
                    className="!mt-3 !ml-2"
                    onClick={copyToClipboard}
                    variant="contained"
                  >
                    copy{" "}
                  </Button>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    );
  }

  const ControlBar = () => {
    return (
      <div className="!flex !flex-row-reverse">
        <Button type="button" color="secondary" sx={{ m: 2 }} onClick={deleteOutputs} variant="contained">
          Delete all
        </Button>
      </div>
    );
  };

  return (
    <React.Fragment>
      <Head title="Listing optimizers - Paragraph" />
      <Content page="component">
        <BlockHead size="lg" wide="sm" className="!pb-6">
          <BlockHeadContent>
            <div className="flex flex-row">
              <div className="flex">
                <BackTo link="/optimizers" icon="arrow-left" />
              </div>
              <div>
                <BlockTitle tag="h2" className="fw-bold !text-2xl !pt-2 !mb-1">
                  Paragraph optimizer
                </BlockTitle>
                <BlockDes>
                  <p className="lead">Get help in generating the best description for your product.</p>
                </BlockDes>
              </div>
            </div>
          </BlockHeadContent>
        </BlockHead>

        <Block size="lg" className="!pb-8">
          <Block className="!flex !h-[74vh]">
            <Col sm={4} className="!pl-0">
              <PreviewCard>
                <Input />
              </PreviewCard>
            </Col>
            <Col
              sm={8}
              className="!py-0"
              style={{
                backgroundImage: `url(${Bg})`,
                backgroundSize: "auto",
                backgroundPositionX: "center",
                backgroundColor: "rgb(238, 238, 238)",
                backgroundBlendMode: "color-dodge",
                padding: "0",
              }}
            >
              <PreviewCard className="!h-full !bg-transparent !border-0">
                <ControlBar />
                <Responses />
              </PreviewCard>
            </Col>
          </Block>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default Optimizer;
