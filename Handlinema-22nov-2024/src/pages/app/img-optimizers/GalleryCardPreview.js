import React, { useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import GalleryCard from "../../../components/partials/gallery/GalleryCard";
import {
  PreviewCard,
  BlockDes,
  Block,
  BlockHeadContent,
  BlockHead,
  BlockTitle,
  Col,
  Row,
  Icon,
  Button,
} from "../../../components/Component";
import { galleryData } from "./GalleryData";
import { Knob1, Knob2, Knob3, Knob4 } from "./charts/Knobs";
import { ButtonGroup } from "reactstrap";

const GalleryCardPreview = () => {
  const [data] = useState(galleryData);
  const [tableData, setTableData] = useState(data);
  const [searchText, setSearchText] = useState("");
  const [view, setView] = useState(5);

  React.useEffect(() => {
    let defaultData = tableData;
    if (searchText !== "") {
      defaultData = data.filter((item) => {
        return (
          item.product_name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.asin.toLowerCase().includes(searchText.toLowerCase())
        );
      });
      setTableData(defaultData);
    } else {
      setTableData(data);
    }
  }, [searchText]);

  
  return (
    <React.Fragment>
      <Head title="Image optimizers"></Head>
      <Content>
        <div className="img-optimizers">
          <BlockHead className="!pb-6">
            <BlockHeadContent>
              <div className="flex flex-row justify-center text-center">
                <div className="flex"></div>
                <div>
                  <BlockTitle tag="h2" className="fw-bold !text-2xl !pt-2 !mb-1">
                    Image optimizers{" "}
                  </BlockTitle>
                  <BlockDes>
                    <p className="lead">You have a total of [nr] images from [nr] products. </p>
                  </BlockDes>
                </div>
              </div>
            </BlockHeadContent>
          </BlockHead>
          <Block>
            <Row className=" pb-4 gradient-white">
              <Col sm={3} className="flex flex-col justify-center align-middle">
                {" "}
                <Row className="flex justify-center">
                  {" "}
                  <PreviewCard>
                    <Knob1 />
                  </PreviewCard>
                </Row>
                <div className="flex flex-col align-middle justify-center text-center">
                  <span className="text-base">Main Image Quality Score</span>
                  <span className="text-xs pt-2">
                    Explanation what is considered in the Main Image Quality Score and actions the user can take to
                    improve it
                  </span>
                </div>
              </Col>
              <Col sm={3} className="flex flex-col justify-center align-middle">
                {" "}
                <Row className="flex justify-center">
                  {" "}
                  <PreviewCard>
                    <Knob2 />
                  </PreviewCard>
                </Row>
                <div className="flex flex-col align-middle justify-center text-center">
                  <span className="text-base">Secondary images rating</span>
                  <span className="text-xs pt-2">
                    Explanation what is considered in the Secondary images rating and actions the user can take to
                    improve it
                  </span>
                </div>
              </Col>
              <Col sm={3} className="flex flex-col justify-center align-middle">
                {" "}
                <Row className="flex justify-center">
                  {" "}
                  <PreviewCard>
                    <Knob3 />
                  </PreviewCard>
                </Row>
                <div className="flex flex-col align-middle justify-center text-center">
                  <span className="text-base">Video rating</span>
                  <span className="text-xs pt-2">
                    Explanation what is considered in the Video rating and actions the user can take to improve it
                  </span>
                </div>
              </Col>
              <Col sm={3} className="flex flex-col justify-center align-middle">
                {" "}
                <Row className="flex justify-center">
                  {" "}
                  <PreviewCard>
                    <Knob4 />
                  </PreviewCard>
                </Row>
                <div className="flex flex-col align-middle justify-center text-center">
                  <span className="text-base">Catalogue Score</span>
                  <span className="text-xs pt-2">
                    Explanation what is considered in the Catalogue Score and actions the user can take to improve it
                  </span>
                </div>
              </Col>
            </Row>
          </Block>

          <Block className="pt-0">
            <Row className="g-gs py-6 gradient-white">
              <Col sm={9} lg={9}>
                <div id="DataTables_Table_0_filter" className="img-filter">
                  <label className="mb-0">
                    <input
                      type="search"
                      className=" form-control form-control-normal"
                      placeholder="Search by title or ASIN"
                      onChange={(ev) => setSearchText(ev.target.value)}
                    />
                  </label>
                </div>
              </Col>
              <Col sm={3} lg={3} className="flex flex-row justify-end align-middle">
                <div className="flex items-center mr-2">View:</div>
                <ButtonGroup>
                  <Button color="primary" className={view !== 4 ? "!opacity-75" : ""} onClick={() => setView(4)}>
                    4
                  </Button>
                  <Button color="primary" className={view !== 5 ? "!opacity-75" : ""} onClick={() => setView(5)}>
                    5
                  </Button>
                  <Button color="primary" className={view !== 6 ? "!opacity-75" : ""} onClick={() => setView(6)}>
                    6
                  </Button>
                </ButtonGroup>{" "}
              </Col>
            </Row>
            <Row className="g-gs">
              {tableData.map((item) => {
                return (
                  <Col lg={view == 6 ? 2 : null || view == 5 ? 24 : null || view == 4 ? 3 : null} key={item.id}>
                    <GalleryCard
                      img={item.img}
                      asin={item.asin}
                      productName={item.product_name}
                      score={item.score}
                    />
                  </Col>
                );
              })}
            </Row>
          </Block>
        </div>
      </Content>
    </React.Fragment>
  );
};

export default GalleryCardPreview;
