import React, { useEffect, useState, useRef, useContext } from "react";
import { Button, FormGroup, Label, Spinner } from "reactstrap";
import {
  Row,
  Col,
  BlockHead,
  BlockHeadContent,
  BackTo,
  BlockTitle,
  BlockDes,
  PreviewCard,
  Icon,
  PreviewAltCard,
} from "../../../components/Component";
import ContentAlt from "../../../layout/content/ContentAlt";
import Head from "../../../layout/head/Head";
import { useForm } from "react-hook-form";
import axios from "axios";
import ReactJson from "react-json-view";
import { RSelect } from "../../../components/Component";

const index = () => {
  const MarketplaceLink = localStorage.getItem("MarketplaceLink");
  const BearerAlizonAccessToken = "Bearer" + " " + localStorage.getItem("AlizonAccessToken");
  const [loading2, setLoading2] = React.useState(false);
  const [productsData, setProductsData] = useState([{}]);
  const [formInputs, setFormInputs] = React.useState([{}]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [output, setOutput] = useState([{}]);
  const { errors, register, handleSubmit } = useForm();



  const Input = () => {
    const [loading, setLoading] = React.useState(false);
    const [asinList, setAsinList] = useState([]);

    function InputForm() {
      const [asin, setAsin] = useState("");

      const handleInputChange = (event) => {
        setAsin(event.target.value);
      };

      const handleKeyPress = (event) => {
        if (event.key === "Enter") {
          addAsin(asin);
          setAsin("");
          console.log(asinList);
        }
      };

      const addAsin = (newAsin) => {
        if (newAsin && !asinList.includes(newAsin)) {
          setAsinList([...asinList, newAsin]);
        }
      };

      const removeAsin = (asinToRemove) => {
        setAsinList(asinList.filter((asin) => asin !== asinToRemove));
      };

      return (
        <div className="w-100">
          <form className="flex flex-row mb-2">
            <input
              className="form-control"
              name="asin"
              value={asin}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Enter ASINs and press Enter"
            />
            <Button className="ml-1" size="md" color="secondary" onClick={() => addAsin(asin)} variant="contained">
              +
            </Button>
            <Button className="ml-1" size="md" color="secondary" onClick={fetchProductInfo} variant="contained">
              {loading ? <Spinner size="sm" color="light" /> : "Fetch"}
            </Button>
          </form>
          <ul className="flex flex-wrap mb-2">
            {asinList.map((asin) => (
              <li key={asin} className="w-fit text-[white] mx-[5px] my-[5px] p-1 px-2 rounded-[5px] bg-[#9d9d9d]">
                {asin}{" "}
                <button onClick={() => removeAsin(asin)} className="!text-gray-700 ml-[2px]">
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    const fetchProductInfo = () => {
      setLoading(true);
      console.log(MarketplaceLink)

      // set up the request parameters
      const params = {
        api_key: "F63CEFBE3AA54329A90A05DF5397DC6D",
        amazon_domain: MarketplaceLink,
        asin: asinList,
        type: "product",
      };

      // make the http GET request to ASIN Data API
      axios
        .get("https://api.asindataapi.com/request", { params })
        .then((response) => {
          // print the JSON response from ASIN Data API
          console.log(response.data);
          setProductsData(response.data);
          setLoading(false)
        })
        .catch((error) => {
          // catch and print the error
          console.log(error);
          setLoading(false)
        });
    };

    return (
      <>
        <Row className="gy-2">
          <Col sm="12">
            <FormGroup>
              <Label htmlFor="default-2" className="form-label">
                ASINs
              </Label>
              <div className="form-control-wrap flex">
                <InputForm />
              </div>
            </FormGroup>
          </Col>
        </Row>
        <Row className="gy-2 ">
          <PreviewAltCard className="!w-[100%]">
            <ReactJson collapsed="true" src={productsData} />
          </PreviewAltCard>
          <PreviewAltCard className="!w-[100%]">
            <ReactJson collapsed="true" src={formInputs} />
          </PreviewAltCard>
        </Row>
        <Row className="!mt-6">
          <Col sm="6" className="!flex justify-start items-center">
            <RSelect
              className="!w-[180px]"
              options={languageOptions}
              value={selectedLanguage}
              onChange={handleLanguageChange}
              placeholder="Select a language"
            />
          </Col>
          <Col sm="6" className="!flex justify-end items-center ">
            <Button size="md" color="secondary" type="submit" variant="contained" onClick={Generation}>
              {loading2 ? <Spinner size="sm" color="light" /> : "Translate"}
            </Button>
          </Col>
        </Row>
      </>
    );
  };

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "it", label: "Italian" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
  ];

  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption);
  };

  const Generation = () => {
    setLoading2(true);

    const data = {
      language: selectedLanguage.label || "en",
      inputs: formInputs.map((formInput) => ({
        product_name: formInput.product_name,
        features: formInput.features.join("\n"),
      })),
    };

    console.log(data);

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://alizon-server.herokuapp.com/api/products-translator",
      headers: {
        Authorization: BearerAlizonAccessToken,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    };

    axios(config)
      .then(function (response) {
        setOutput(response.data);
        console.log(response.data);
        setLoading2(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading2(false);
      });
  };

  return (
    <React.Fragment>
      <Head title="Products translator"></Head>
      <BlockHead size="lg" wide="sm" className="!pb-6">
        <BlockHeadContent>
          <div className="flex flex-row">
            <div className="flex">
              <BackTo link="/optimizers" icon="arrow-left" />
            </div>
            <div className="flex flex-row justify-center items-center">
              <Icon name="amazon" className="!text-4xl" />
              <div className="!pl-4">
                <BlockTitle tag="h2" className="fw-bold !text-2xl !pt-1  !mb-1">
                  Products translator
                </BlockTitle>
                <BlockDes>
                  <p className="lead">Get help in improving your product listings.</p>
                </BlockDes>
              </div>
            </div>
          </div>
        </BlockHeadContent>
      </BlockHead>
      <Row className="!m-0">
        <Col md="6">
          <PreviewCard>
            <Input />
          </PreviewCard>
        </Col>
        <Col md="6">
          <ContentAlt>
            <PreviewCard>
              <Row className="gy-2 min-h-[500px]">
                <PreviewAltCard className="!w-[100%]">
                  <ReactJson collapsed="true" src={output} />
                </PreviewAltCard>
              </Row>
            </PreviewCard>
          </ContentAlt>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default index;
