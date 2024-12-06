import React, { useEffect, useState } from "react";
import { customAlphabet } from "nanoid";
import { getInnerText } from "@lukaspolak/react-get-inner-text";
import copy from "copy-to-clipboard";
import Content from "../../../../layout/content/Content";
import Head from "../../../../layout/head/Head";
import makeAnimated from "react-select/animated";
import { FormGroup, Label, Input, Row, Col } from "reactstrap";
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  BackTo,
  PreviewCard,
  CodeBlock,
  OverlineTitle,
  OutlinedInput,
  Icon,
  Button,
} from "../../../../components/Component";
import {
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  RadioGroup,
  FormControl,
  MenuItem,
  Typography,
} from "@mui/material";
import { RSelect } from "../../../../components/Component";

const Optimizer = () => {
  const [file, setFile] = useState("");
  const animatedComponents = makeAnimated();

  const [outputs, setOutputs] = React.useState([
    {
      id: 1,
      asin: "",
      productinfo: "",
      benefitsfeatures: "",
      keywords: "",
    },
  ]);

  const deleteOutputs = () => {
    setOutputs([
      {
        id: 1,
        asin: "",
        productinfo: "",
        benefitsfeatures: "",
        keywords: "",
      },
    ]);
  };

  const deleteOutput = (contactId) => {
    const newOutputs = [...outputs];
    const index = outputs.findIndex((output) => output.id === contactId);
    newOutputs.splice(index, 1);
    setOutputs(newOutputs);
  };

  const nanoid = customAlphabet("1234567890", 10);

  function Input() {
    const [formInputs, setFormInputs] = React.useState([
      {
        id: "",
        asin: "",
        productinfo: "",
        benefitsfeatures: "",
        toneofvoice: "",
        contenttype: "",
        outputsnr: "",
      },
    ]);

    const toneofvoices = [
      {
        value: "Witty",
        label: "Witty",
      },
      {
        value: "Voice two",
        label: "Voice two",
      },
      {
        value: "Voice Three",
        label: "Voice Three",
      },
      {
        value: "Voice Four",
        label: "Voice Four",
      },
    ];

    function handleFormChange(evt) {
      const formInput = evt.target.value;
      setFormInputs({ ...formInputs, [evt.target.name]: formInput });
    }

    const [toneofvoiceout, setToneofvoice] = React.useState("Witty");
    const handleChange2 = (event) => {
      setToneofvoice(event.value);
    };

    const [value, setValue] = React.useState("Seo optimized");
    const handleChange3 = (event) => {
      setValue(event.target.value);
    };

    const [value2, setValue2] = React.useState("1");
    const handleChange4 = (event) => {
      setValue2(event.target.value);
    };

    function handleAddFormChange(event) {
      const newInput = {
        id: nanoid(),
        asin: formInputs.asin,
        productinfo: formInputs.productinfo,
        benefitsfeatures: formInputs.benefitsfeatures,
        keywords: formInputs.keywords,
        toneofvoice: toneofvoiceout,
        contenttype: value,
        outputsnr: value2,
      };

      if (value2 === "3") {
        setOutputs([...outputs, newInput, newInput, newInput]);
      } else if (value2 === "2") {
        setOutputs([...outputs, newInput, newInput]);
      } else if (value2 === "1") {
        setOutputs([...outputs, newInput]);
      }
      console.log(newInput);
    }

    return (
      <form onSubmit={handleAddFormChange} onChange={handleFormChange}>
        <Row className="gy-4">
          <Col sm="12">
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
                value={formInputs.asin}
                type="text"
                id="default-2"
                placeholder="Insert ASIN"
              />
            </div>
          </Col>
          <Col sm="12">
            <Label htmlFor="default-textarea" className="form-label">
              Product info
            </Label>
            <div className="form-control-wrap">
              <input
                name="productinfo"
                value={formInputs.productinfo}
                className="no-resize form-control"
                type="textarea"
                id="default-textarea"
                placeholder="Insert details of the product"
              />
            </div>
          </Col>
          <Col sm="12">
            <Label htmlFor="default-2" className="form-label">
              Key benefits/features
            </Label>
            <div className="form-control-wrap">
              <div className="form-icon form-icon-left">
                <Icon name="crosshair" />
              </div>
              <input
                className="form-control"
                name="benefitsfeatures"
                value={formInputs.benefitsfeatures}
                type="text"
                id="default-2"
                placeholder="Insert benefits and features"
              />
            </div>
          </Col>
          <Col sm="12">
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
                value={formInputs.keywords}
                type="text"
                id="default-2"
                placeholder="Insert keywords"
              />
            </div>
          </Col>
        </Row>

        <Row className="gy-4">
          <Col sm={12}>
            <div className="form-group">
              <label className="form-label">Tone of voice</label>
              <RSelect options={toneofvoices} onChange={handleChange2} />
            </div>
          </Col>
        </Row>

        <Row className="!mt-8 !pl-[5px]">
          <Col xl="12">
            <FormGroup aria-label="gender" name="gender1" value={value} onChange={handleChange3}>
              <div className="preview-block">
                <span className="preview-title overline-title">Content</span>
                <div className="g-4 align-center flex-wrap">
                  <div className="g">
                    <div className="custom-control custom-control-sm custom-radio">
                      <input
                        type="radio"
                        className="custom-control-input form-control"
                        name="gender"
                        value="Seo optimized"
                        id="customRadio1"
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
            </FormGroup>
          </Col>
        </Row>

        <Row className="!mt-8 !pl-[5px]">
          <Col xl="12">
            <FormGroup aria-label="outputs" name="outputs" value={value2} onChange={handleChange4}>
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
            </FormGroup>
          </Col>
        </Row>

        <Row className="!mt-6">
          <Col xl="12">
            <Button color="primary" type="submit" onClick={handleAddFormChange} variant="contained">
              Generate
            </Button>
          </Col>
        </Row>
      </form>
    );
  }

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
                <div ref={ref}>
                  The AI will generate a response using
                  <span className="!font-extrabold !text-amber-500">{output.asin}</span> as ASIN,
                  <span className="!font-extrabold !text-amber-500">{output.productinfo}</span> as Product infos,
                  <span className="!font-extrabold !text-amber-500">{output.benefitsfeatures}</span> as Benefits and
                  Features,
                  <span className="!font-extrabold !text-amber-500">{output.toneofvoice}</span> as Tone of voice,
                  <span className="!font-extrabold !text-amber-500">{output.contenttype}</span> as Content type and
                  <span className="!font-extrabold !text-amber-500">{output.outputsnr}</span> as outputs nr.
                </div>
              </>
            );
          };

          const copyToClipboard = () => {
            const innerText = getInnerText(<div>copypaste</div>);
            copy(innerText);
            console.log(innerText);
          };

          return (
            <>
              <Card key={output.id} sx={{ p: 3 }} className={output.id === 1 ? "!hidden cardoutput" : "cardoutput"}>
                <CardOutput />
                <div className="flex flex-row-reverse">
                  <Button
                    type="button"
                    color="primary"
                    sx={{ mt: 3, ml: 2 }}
                    onClick={deleteOutput}
                    variant="contained"
                  >
                    DELETE{" "}
                  </Button>

                  <Button
                    type="button"
                    color="primary"
                    sx={{ mt: 3, ml: 2 }}
                    onClick={copyToClipboard}
                    variant="contained"
                  >
                    COPY{" "}
                  </Button>
                </div>
              </Card>
            </>
          );
        })}
      </div>
    );
  }

  const ControlBar = () => {
    return (
      <div className="controlbar">
        <Button type="button" color="primary" sx={{ m: 2 }} onClick={deleteOutputs} variant="contained">
          Delete all
        </Button>
      </div>
    );
  };

  return (
    <React.Fragment>
      <Head title="Form Elements" />
      <Content page="component">
        <BlockHead size="lg" wide="sm" className="!pb-6">
          <BlockHeadContent>
            <BackTo link="/optimizers" icon="arrow-left">
              back
            </BackTo>
            <BlockTitle tag="h2" className="fw-bold !text-2xl !pt-2 !mb-1">
              Paragraph optimizer
            </BlockTitle>
            <BlockDes>
              <p className="lead">Get help in generating the best description for your product.</p>
            </BlockDes>
          </BlockHeadContent>
        </BlockHead>

        <Block size="lg" className="!pb-8">
          <Block className="!flex">
            <Col sm={6} className="!pl-0">
              <PreviewCard>
                <Input />
              </PreviewCard>
            </Col>
            <Col sm={6} className="!pr-0">
              <PreviewCard>
                <ControlBar/>
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
