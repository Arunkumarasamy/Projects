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
import { Alert, Card } from "@mui/material";
import { RSelect } from "../../../../components/Component";
import axios from "axios";
import Bg from "../../../../images/bg.png";
import ReactJson from "react-json-view";
import models from "../../../../api/sp-api/SP.json";

const Tester = () => {
  const BearerAlizonAccessToken = "Bearer" + " " + localStorage.getItem("AlizonAccessToken");
  const spAtzAccessToken = localStorage.getItem("spAtzAccessToken");
  const MarketplaceIds = localStorage.getItem("MarketplaceIds");
  const timestamp = new Date().toISOString().replaceAll("-", "").replaceAll(":", "").replaceAll(".", "");
  const animatedComponents = makeAnimated();
  const [loading, setLoading] = useState(false);
  const nanoid = customAlphabet("1234567890", 10);

  const [outputs, setOutputs] = React.useState([]);
  const deleteOutputs = () => {
    setOutputs([]);
  };

  const Generation = (urlPath) => {
    setLoading(true);
    deleteOutputs();
    axios({
      method: "post",
      maxBodyLength: Infinity,
      url: "https://alizon-server.herokuapp.com/api/fetch-amazon-api",
      headers: {
        Authorization: BearerAlizonAccessToken,
        "Content-Type": "application/json",
      },
      data: {
        url: urlPath.url_path,
        access_key: spAtzAccessToken,
        request_type: "GET",
        body: "",
      },
    })
      .then(function (response) {
        console.log(JSON.stringify(response.data));

        const newOutput = {
          id: 2,
          generation: JSON.stringify(response.data),
        };

        setOutputs((prevState) => [...prevState, newOutput]);
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
      });
  };

  function Input() {
    const { errors, register, handleSubmit } = useForm();
    const [urlPath, setUrlPath] = React.useState(""); // initialize with empty string

    const [api, setApi] = React.useState(null); // store selected API value
    const [apiLabel, setApiLabel] = React.useState(null); // store selected API value
    const [apiSelected, setApiSelected] = React.useState(false); // track whether API value has been added to input field
    const [path, setPath] = React.useState(null);
    const [pathLabel, setPathLabel] = React.useState(null);

    function SelectApi(evt) {
      const options = [
        { value: "https://sellingpartnerapi-eu.amazon.com", label: "SP API" },
        { value: "https://advertising-api-eu.amazon.com", label: "ADS API" },
        { value: "vanilla", label: "PA API" },
      ];
      const animatedComponents = makeAnimated();

      return (
        <>
          <RSelect
            components={animatedComponents}
            options={options}
            onChange={(selectedOption) => {
              setApi(selectedOption.value);
              setApiLabel(selectedOption.label);
              setUrlPath(selectedOption.value); // set input field value to selected API value
            }}
            value={api ? { value: api, label: apiLabel } : null} // set the selected option as value
          />
        </>
      );
    }

    function SelectPath(evt) {
      const options = models.map((group) => ({
        label: group.category,
        options: group.models.map((model) => ({
          label: model.name,
          value: model.path,
          description: model.description,
          parameters: model.parameters,
        })),
      }));

      const animatedComponents = makeAnimated();

      return (
        <>
          <RSelect
            components={animatedComponents}
            options={options}
            formatGroupLabel={(data) => (
              <div>
                <span>{data.label}</span>
              </div>
            )}
            onChange={(selectedOption) => {
              setPath(selectedOption.value);
              setPathLabel(selectedOption.label);
              if (!urlPath.includes(selectedOption.value)) {
                // check if the path is already added
                setUrlPath(api ? api + selectedOption.value : selectedOption.value); // add the selected path to the urlPath
              }
            }}
            value={path ? { value: path, label: pathLabel } : null} // set the selected option as value
          />
          {pathLabel && (
            <div className="pt-1">
              <Alert className="alert-icon" color="primary">
                {options.flatMap((option) => option.options).find((option) => option.label === pathLabel).description}
              </Alert>
              <div className="form-control-wrap pt-2">
                <Label htmlFor="default-2" className="form-label">
                  Parameters
                </Label>
              </div>
              <div className="p-1 bg-[#272822] rounded">
                <ReactJson
                  collapsed="true"
                  theme="monokai"
                  src={
                    options.flatMap((option) => option.options).find((option) => option.label === pathLabel).parameters
                  }
                />
              </div>
            </div>
          )}
        </>
      );
    }

    function handleFormChange(evt) {
      const formInput = evt.target.value;
      if (path && !urlPath.endsWith(path)) {
        // add the path value if it does not already exist in the urlPath string
        setUrlPath(api ? api + path : path); // add api value if it exists
      } else {
        setUrlPath(formInput);
      }
      setApiSelected(false); // set apiSelected to false when changing input field value
    }

    const handleAddFormChange = (event) => {
      if (api && !apiSelected) {
        // check if an API is selected and API value has not been added to input field
        setApiSelected(true); // set apiSelected to true after adding API value to input field
        Generation({ url_path: urlPath }); // pass urlPath as object to Generation function
      } else {
        Generation({ url_path: urlPath });
      }
    };
    return (
      <form onSubmit={handleSubmit(handleAddFormChange)}>
        <Row sm="12" className="!m-2">
          <Col sm="12 my-2">
            <FormGroup>
              <div className="form-control-wrap">
                <Label htmlFor="default-2" className="form-label">
                  Select API
                </Label>
                <SelectApi />
              </div>
              <div className="form-control-wrap pt-2">
                <Label htmlFor="default-2" className="form-label">
                  Select Path
                </Label>
                <SelectPath />
              </div>

              <div className="form-control-wrap pt-2">
                <Label htmlFor="default-2" className="form-label">
                  URL Path
                </Label>
                <input
                  className="form-control"
                  name="url_path"
                  defaultValue={urlPath}
                  onChange={handleFormChange}
                  ref={register({ required: true })}
                  type="text"
                  id="url_path"
                  placeholder="Insert Value"
                />
                {errors.url_path && <p className="invalid">This field is required</p>}
              </div>
            </FormGroup>
          </Col>
        </Row>

        <Row sm="12" className="!mt-5 !m-2">
          <Col xl="12" className="!flex justify-center">
            <Button size="md" color="secondary" type="submit" variant="contained">
              {loading ? <Spinner size="sm" color="light" /> : "Send"}
            </Button>
          </Col>
        </Row>
      </form>
    );
  }

  function Responses() {
    const ref = React.useRef();

    const formatJson = (str) => {
      try {
        const json = JSON.parse(str);
        return json;
      } catch (e) {
        return str;
      }
    };

    return (
      <div className="apiresponses" id="responses">
        {outputs.map((output) => {
          const CardOutput = () => {
            return (
              <>
                <div className="flex flex-row-reverse text-xs text-gray-700"></div>
                <div ref={ref} className="!pb-4">
                  <ReactJson src={formatJson(output.generation)} theme="monokai" collapsed="true" />
                </div>
              </>
            );
          };

          return (
            <div key={output.id} className="apicardoutput">
              <div sx={{ p: 3 }} className={output.id === 1 ? "!hidden" : ""}>
                <CardOutput />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <React.Fragment>
      <Head title="APIs Tester" />
      <Content page="component">
        <BlockHead className="!pb-6">
          <BlockHeadContent>
            <div className="flex flex-row !justify-between">
              <div className="flex flex-row">
                <div className="flex">
                  <BackTo link="/optimizers" icon="arrow-left" />
                </div>
                <div>
                  <BlockTitle tag="h2" className="fw-bold !text-2xl !pt-2 !mb-1">
                    APIs Tester
                  </BlockTitle>
                  <BlockDes>
                    <p className="lead">Test Amazon APIs.</p>
                  </BlockDes>
                </div>
              </div>
              <div className="flex items-center">
                <Button color="primary" className="!px-2 !mx-2 !text-white">
                    <a className="flex" href="https://developer-docs.amazon.com/sp-api/docs" target="_blank">
                      <div className="nk-news-icon">
                        <Icon name="card-view" className="!text-white"/>
                      </div>
                      <div className="nk-news-text !text-white">
                          <span> SP API</span>
                        <Icon name="external" className="!text-white"/>
                      </div>
                    </a>
                </Button>
                <Button color="primary" className="!px-2 !mx-2 !text-white">
                    <a className="flex" href="https://advertising.amazon.com/API/docs/en-us/reporting/overview" target="_blank">
                      <div className="nk-news-icon">
                        <Icon name="card-view" className="!text-white"/>
                      </div>
                      <div className="nk-news-text !text-white">
                          <span> ADS API</span>
                        <Icon name="external" className="!text-white"/>
                      </div>
                    </a>
                </Button>
                <Button color="primary" className="!px-2 !mx-2 !text-white">
                    <a className="flex" href="https://webservices.amazon.com/paapi5/documentation/operations.html" target="_blank" >
                      <div className="nk-news-icon">
                        <Icon name="card-view" className="!text-white"/>
                      </div>
                      <div className="nk-news-text !text-white">
                          <span> PA API</span>
                        <Icon name="external" className="!text-white"/>
                      </div>
                    </a>
                </Button>
              </div>
            </div>
          </BlockHeadContent>
        </BlockHead>

        <Block size="lg" className="!pb-8">
          <Block className="!flex flex-col">
            <Col sm={12} className="!px-0">
              <PreviewCard className="mb-1">
                <Input />
              </PreviewCard>
            </Col>
            <Col sm={12} className="!px-0">
              <PreviewCard className="!h-full !bg-transparent apiresponsesdiv">
                <Responses />
              </PreviewCard>
            </Col>
          </Block>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default Tester;
