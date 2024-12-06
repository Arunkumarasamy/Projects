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
} from "../../../components/Component";
import ContentAlt from "../../../layout/content/ContentAlt";
import Head from "../../../layout/head/Head";
import { ChatContextProvider, ChatContext } from "./ChatContext";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import SimpleBar from "simplebar-react";
import axios from "axios";
import { currentTime } from "../../../utils/Utils";
import makeAnimated from "react-select/animated";
import { RSelect } from "../../../components/Component";
import Bg from "../../../images/bg.png";

const index = () => {
  const BearerAlizonAccessToken = "Bearer" + " " + localStorage.getItem("AlizonAccessToken");
  const [selectedId, setSelectedId] = React.useState(1);
  const [mobileView, setMobileView] = React.useState(false);
  const [output, setOutput] = useState("");

  const Input = () => {
    const { errors, register, handleSubmit } = useForm();
    const [loading, setLoading] = React.useState(false);
    const [loading2, setLoading2] = React.useState(false);
    const [formInputs, setFormInputs] = React.useState([{}]);
    const [descriptionGen, setDescriptionGen] = React.useState(true);
    const [titleGen, setTitleGen] = React.useState(false);
    const [bulletPointsGen, setBulletPointGen] = React.useState(false);

    const handleChange = (event) => {
      setValue(event.target.value);
    };

    const [asin, setAsin] = useState("");
    const [productData, setProductData] = useState(null);
    const [productImageUrl, setProductImageUrl] = useState(null);

    const fetchProductInfo = async () => {
      setLoading(true);

      var data = JSON.stringify({
        asin: asin,
      });

      var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://alizon-server.herokuapp.com/api/fetch-amazon-pa-api-us",
        headers: {
          Authorization: BearerAlizonAccessToken,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          setProductData(response.data);
          setProductImageUrl(response.data.item[0].images.primary.large.url);
          setFormInputs({
            ...formInputs,
            product_name: response.data.item[0].item_info.title.display_value,
            features: response.data.item[0].item_info.features.display_values,
            category: response.data.item[0].browse_node_info.browse_nodes[0].context_free_name,
          });
          console.log(response.data);
          setLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          setLoading(false);
        });
    };

    const handleInputChange = (event) => {
      setAsin(event.target.value);
    };

    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        fetchProductInfo();
      }
    };

    function handleFormChange(evt) {
      const formInput = evt.target.value;
      setFormInputs({ ...formInputs, [evt.target.name]: formInput });
      console.log(formInputs);
    }

    const [contentValue, setContentValue] = React.useState("Seo optimized");
    const handleChange2 = (event) => {
      setContentValue(event.target.value);
    };

    const languageOptions = [
      { value: "en", label: "English" },
      { value: "it", label: "Italian" },
      { value: "fr", label: "French" },
      { value: "de", label: "German" },
    ];
    const animatedComponents = makeAnimated();

    const [selectedLanguage, setSelectedLanguage] = React.useState(languageOptions[0].value);
    const handleLanguageChange = (selectedOption) => {
      setSelectedLanguage(selectedOption.value);
    };

    function handleAddFormChange(event) {
      const newInput = {
        description: formInputs.description,
        product_name: formInputs.product_name,
        category: formInputs.category,
        features: formInputs.features,
        target_audience: formInputs.target_audience,
        language: selectedLanguage,
      };

      const DescriptionGeneration = () => {
        setLoading2(true);

        let data = JSON.stringify({
          product_name: newInput.product_name,
          category: newInput.category,
          description: newInput.description,
          features: newInput.features,
          unique_selling_points: "",
          target_audience: newInput.target_audience,
          language: newInput.language,
        });

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://alizon-server.herokuapp.com/api/optimize-description",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        axios
          .request(config)
          .then((response) => {
            setOutput(response.data);
            setLoading2(false);
          })
          .catch(function (error) {
            setLoading2(false);
          });
      };

      const TitleGeneration = () => {
        setLoading2(true);

        let data = JSON.stringify({
          product_name: newInput.product_name,
          category: newInput.category,
          description: newInput.description,
          features: newInput.features,
          unique_selling_points: "",
          target_audience: newInput.target_audience,
          language: newInput.language,
        });

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://alizon-server.herokuapp.com/api/optimize-title",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        axios
          .request(config)
          .then((response) => {
            setOutput(response.data);
            setLoading2(false);
          })
          .catch(function (error) {
            setLoading2(false);
          });
      };

      const BulletPointsGeneration = () => {
        setLoading2(true);

        let data = JSON.stringify({
          product_name: newInput.product_name,
          category: newInput.category,
          description: newInput.description,
          features: newInput.features,
          unique_selling_points: "",
          target_audience: newInput.target_audience,
          language: newInput.language,
        });

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://alizon-server.herokuapp.com/api/optimize-bullet-points",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        axios
          .request(config)
          .then((response) => {
            setOutput(response.data);
            setLoading2(false);
          })
          .catch(function (error) {
            setLoading2(false);
          });
      };

      if (descriptionGen == true) {
        DescriptionGeneration();
      }

      if (titleGen == true) {
        TitleGeneration();
      }

      if (bulletPointsGen == true) {
        BulletPointsGeneration();
      }
    }

    return (
      <form onSubmit={handleSubmit(handleAddFormChange)}>
        <Row className="gy-2">
          <Col sm="6">
            <FormGroup>
              <Label htmlFor="default-2" className="form-label">
                ASIN
              </Label>
              <div className="form-control-wrap flex">
                <div className="form-icon form-icon-left">
                  <Icon name="label" />
                </div>
                <input
                  className="form-control"
                  name="asin"
                  value={asin}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter ASIN and press Enter"
                />
                <Button className="ml-1" size="md" color="secondary" onClick={fetchProductInfo} variant="contained">
                  {loading ? <Spinner size="sm" color="light" /> : "Fetch"}
                </Button>
              </div>
            </FormGroup>
          </Col>
        </Row>

        <Row className="gy-2 !pt-4">
          <Col sm="12">
            <PreviewCard>
              <Row>
                <Col sm="2" className="!pl-0 !pr-0 flex justify-center align-middle items-center">
                  {productImageUrl ? (
                    <div className="product-image">
                      <img src={productImageUrl}></img>
                    </div>
                  ) : (
                    <Icon name="box" className="!text-7xl" />
                  )}
                </Col>
                <Col sm="10" className="flex items-center">
                  <div className="form-control-wrap w-full">
                    <div className="input-group input-group-sm">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-sm">
                          Product name
                        </span>
                      </div>
                      <textarea
                        className="form-control"
                        name="product_name"
                        defaultValue={formInputs.product_name}
                        onChange={handleFormChange}
                        ref={register({ required: true })}
                        type="text"
                        id="product_name"
                        placeholder=""
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm="12" className="flex items-center pt-2">
                  <div className="form-control-wrap w-full">
                    <div className="input-group input-group-sm min-h-[80px]">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-sm">
                          Description
                        </span>
                      </div>
                      <textarea
                        className="form-control"
                        name="description"
                        defaultValue={formInputs.description}
                        onChange={handleFormChange}
                        ref={register({ required: true })}
                        type="text"
                        id="description"
                        placeholder=""
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm="6" className="flex items-center pt-2">
                  <div className="form-control-wrap w-full">
                    <div className="input-group input-group-sm">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-sm">
                          Category
                        </span>
                      </div>
                      <input
                        className="form-control"
                        name="category"
                        defaultValue={formInputs.category}
                        onChange={handleFormChange}
                        ref={register({ required: true })}
                        type="text"
                        id="category"
                        placeholder=""
                      />
                    </div>
                  </div>
                </Col>
                <Col sm="6" className="flex items-center pt-2">
                  <div className="form-control-wrap w-full">
                    <div className="input-group input-group-sm">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-sm">
                          Target audience
                        </span>
                      </div>
                      <input
                        className="form-control"
                        name="target_audience"
                        defaultValue={formInputs.target_audience}
                        onChange={handleFormChange}
                        ref={register({ required: true })}
                        type="text"
                        id="target_audience"
                        placeholder=""
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm="12" className="flex items-center pt-2">
                  <div className="form-control-wrap w-full">
                    <div className="input-group input-group-sm min-h-[100px]">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-sm">
                          Features / Unique selling points
                        </span>
                      </div>
                      <textarea
                        className="form-control"
                        name="features"
                        defaultValue={formInputs.features}
                        onChange={handleFormChange}
                        type="text"
                        id="features"
                        placeholder=""
                      />
                    </div>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col sm="6" className="pt-2">
                  <RSelect
                    components={animatedComponents}
                    options={languageOptions}
                    onChange={handleLanguageChange}
                    defaultValue={languageOptions[0]}
                  />
                </Col>
              </Row>
            </PreviewCard>
          </Col>
        </Row>
        <Row className="!mt-6">
          <Col sm="4">
            <a
              onClick={descriptionGen == true ? () => setDescriptionGen(false) : () => setDescriptionGen(true)}
              className={
                descriptionGen == true ? "card card-bordered text-soft card-selected" : "card card-bordered text-soft"
              }
            >
              <div className="card-inner">
                <div className="align-center justify-between">
                  <div className="g">
                  <h6 className="title !flex !items-center !mb-3 pointer-events-none">
                      <div className="!text-xl !flex">
                        <Icon name="menu-alt-left !mr-3" />
                      </div>
                      Description
                    </h6>
                    <p className="mr-3 mb-2 !text-xs pointer-events-none">
                      Generate the perfect description with our optimizer for paragraphs.
                    </p>
                  </div>
                </div>
              </div>{" "}
            </a>
          </Col>
          <Col sm="4">
            <a
              onClick={titleGen == true ? () => setTitleGen(false) : () => setTitleGen(true)}
              className={
                titleGen == true ? "card card-bordered text-soft card-selected" : "card card-bordered text-soft"
              }
            >
              <div className="card-inner">
                <div className="align-center justify-between">
                  <div className="g">
                  <h6 className="title !flex !items-center !mb-3 pointer-events-none">
                      <div className="!text-xl !flex">
                        <Icon name="heading !mr-3" />
                      </div>
                      Title
                    </h6>{" "}
                    <p className="mr-3 mb-2 !text-xs pointer-events-none">
                      Generate the perfect description with our optimizer for titles.
                    </p>
                  </div>
                </div>
              </div>{" "}
            </a>
          </Col>
          <Col sm="4">
            <a
              onClick={bulletPointsGen == true ? () => setBulletPointGen(false) : () => setBulletPointGen(true)}
              className={
                bulletPointsGen == true ? "card card-bordered text-soft card-selected" : "card card-bordered text-soft"
              }
            >
              <div className="card-inner">
                <div className="align-center justify-between">
                  <div className="g">
                    <h6 className="title !flex !items-center !mb-3 pointer-events-none">
                      <div className="!text-xl !flex">
                        <Icon name="view-list-fill !mr-3" />
                      </div>
                      Bullet points
                    </h6>{" "}
                    <p className="mr-3 mb-2 !text-xs pointer-events-none">
                      Generate the perfect description with our optimizer for bullet points.
                    </p>
                  </div>
                </div>
              </div>{" "}
            </a>
          </Col>
        </Row>
        <Row className="!mt-6">
          <Col sm="12" className="!flex justify-center align-middle">
            <Button size="md" color="secondary" type="submit" variant="contained">
              {loading2 ? <Spinner size="sm" color="light" /> : "Optimize"}
            </Button>
          </Col>
        </Row>
      </form>
    );
  };

  const ChatBody = ({ id, mobileView, setMobileView }) => {
    const { chatState } = useContext(ChatContext);
    const [chat, setChat] = chatState;
    const [Uchat, setUchat] = useState({});
    const [sidebar, setsidebar] = useState(false);
    const [inputText, setInputText] = useState("");

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        const scrollHeight = messagesEndRef.current.scrollHeight;
        const height = messagesEndRef.current.clientHeight;
        const maxScrollTop = scrollHeight - height;
        messagesEndRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
      }
    };

    useEffect(() => {
      scrollToBottom();
    }, [Uchat]);

    const resizeFunc = () => {
      if (window.innerWidth > 1550) {
        setsidebar(true);
      } else {
        setsidebar(false);
      }
    };

    useEffect(() => {
      chat.forEach((item) => {
        if (item.id === id) {
          setUchat(item);
        }
      });
    }, [id, chat]);

    useEffect(() => {
      window.addEventListener("resize", resizeFunc);
      resizeFunc();

      return () => {
        window.removeEventListener("resize", resizeFunc);
      };
    }, []);

    const onResponse = () => {
      let allChat = chat;
      let index = allChat.find((item) => item.id === id);
      let defaultChat = Uchat;
      let text = inputText;
      let newChatItem;
      if (inputText !== "") {
        if (defaultChat.convo.length === 0) {
          newChatItem = {
            id: `chat_${defaultChat.convo.length + 2}`,
            me: true,
            chat: [text],
            date: `${currentTime()}`,
          };
          defaultChat.convo = [...defaultChat.convo, newChatItem];
        } else {
          if (defaultChat.convo[defaultChat.convo.length - 1].me === true) {
            newChatItem = {
              id: `chat_${defaultChat.convo.length + 2}`,
              me: true,
              chat: [...defaultChat.convo[defaultChat.convo.length - 1].chat, text],
              date: `${currentTime()}`,
            };
            defaultChat.convo[defaultChat.convo.length - 1] = newChatItem;
          } else {
            let newChatItem = {
              id: `chat_${defaultChat.convo.length + 2}`,
              me: true,
              chat: [text],
              date: `${currentTime()}`,
            };
            defaultChat.convo = [...defaultChat.convo, newChatItem];
          }
        }
      }
      allChat[index] = defaultChat;
      setChat([...allChat]);
      setUchat({ ...defaultChat });
      setInputText("");
    };

    const onRemoveMessage = (idx, id) => {
      let allChat = chat;
      let cindex = allChat.find((item) => item.id === id);
      let defaultChat = Uchat;
      let newConvo = defaultChat.convo;
      let index = newConvo.findIndex((item) => item.id === id);
      newConvo[index].chat[idx] = "deleted";
      allChat[cindex] = defaultChat;
      setChat([...allChat]);
    };

    useEffect(() => {
      setInputText(output);
    }, []);

    // New useEffect for calling onResponse when inputText changes
    useEffect(
      (e) => {
        if (inputText !== "") {
          onResponse(e);
        }
      },
      [inputText]
    );

    const chatBodyClass = classNames({
      "nk-responses-body": true,
      "show-chat": mobileView,
      "profile-shown": sidebar && window.innerWidth > 1550,
    });

    const MeChat = ({ item, onRemoveMessage }) => {
      return (
        <div className="chat is-me">
          <div className="chat-content">
            <div className="chat-bubbles">
              {item.chat.map((msg, idx) => {
                return (
                  <div className="chat-bubble" key={idx}>
                    {msg === "deleted" ? (
                      <div className="chat-msg border bg-white text-muted">Message has been deleted</div>
                    ) : (
                      <React.Fragment>
                        <div className={`chat-msg bg-white !text-[#474747]`}>{msg}</div>
                        <ul className="chat-msg-more">
                          <li className="d-none d-sm-block">
                            <a
                              href="#delete"
                              onClick={(ev) => {
                                ev.preventDefault();
                                onRemoveMessage(idx, item.id);
                              }}
                              className="btn btn-icon btn-sm btn-trigger"
                            >
                              <Icon name="trash-fill"></Icon>
                            </a>
                          </li>
                        </ul>
                      </React.Fragment>
                    )}
                  </div>
                );
              })}
            </div>
            <ul className="chat-meta">
              <li>{item.date}</li>
            </ul>
          </div>
        </div>
      );
    };

    return (
      <React.Fragment>
        {Object.keys(Uchat).length > 0 && (
          <div
            className={chatBodyClass}
            style={{
              backgroundImage: `url(${Bg})`,
              backgroundSize: "auto",
              backgroundPositionX: "center",
              backgroundColor: "rgb(238, 238, 238)",
              backgroundBlendMode: "color-dodge",
              padding: "0",
            }}
          >
            <div className="nk-responses-head">
              <ul className="nk-responses-head-info">
                <li className="nk-responses-body-close" onClick={() => setMobileView(false)}>
                  <a
                    href="#hide-chat"
                    onClick={(ev) => {
                      ev.preventDefault();
                    }}
                    className="btn btn-icon btn-trigger nk-responses-hide ml-n1"
                  ></a>
                </li>
                <li className="nk-responses-head-user"></li>
              </ul>
              <ul className="nk-responses-head-tools">
                <li className="mr-n1 mr-md-n2 flex flex-row justify-center align-middle items-center">
                  <Button size="md" color="secondary" type="submit" variant="contained">
                    <span className="mt-[2px]">Delete all</span>
                    <Icon name="trash"></Icon>
                  </Button>
                </li>
              </ul>
            </div>
            <SimpleBar className="nk-responses-panel" scrollableNodeProps={{ ref: messagesEndRef }}>
              {Uchat.convo.map((item, idx) => {
                if (item.me) {
                  return <MeChat key={idx} item={item} chat={Uchat} onRemoveMessage={onRemoveMessage}></MeChat>;
                }
              })}
            </SimpleBar>
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <Head title="Listing optimizer"></Head>
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
                  Listing optimizer
                </BlockTitle>
                <BlockDes>
                  <p className="lead">Get help in improving your product listings.</p>
                </BlockDes>
              </div>
            </div>
          </div>
        </BlockHeadContent>
      </BlockHead>
      <ChatContextProvider>
        <Row className="!m-0">
          <Col md="6">
            <PreviewCard>
              <Input />
            </PreviewCard>
          </Col>
          <Col md="6">
            <ContentAlt>
              <div className="nk-responses">
                <ChatBody
                  id={selectedId}
                  setSelectedId={setSelectedId}
                  setMobileView={setMobileView}
                  mobileView={mobileView}
                />
              </div>
            </ContentAlt>
          </Col>
        </Row>
      </ChatContextProvider>
    </React.Fragment>
  );
};

export default index;
