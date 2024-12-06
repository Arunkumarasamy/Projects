import React from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import {
  Block,
  BlockHead,
  Row,
  Col,
  BlockHeadContent,
  BackTo,
  BlockTitle,
  BlockDes,
  Icon,
} from "../../../components/Component";
import { Link } from "react-router-dom";

const ComponentsPage = ({ ...props }) => {
  return (
    <React.Fragment>
      <Head title="Listing optimizers" />
      <Content page="component">
        <BlockHead size="lg" className="text-center">
          <BlockHeadContent>
            <BlockTitle tag="h2" className="fw-normal nk-block-title title fw-bold !text-2xl !pt-2 !mb-1">
              Listing optimizers
            </BlockTitle>
            <BlockDes>
              <p className="lead">
                <strong>Headlinema</strong> includes all the necessary components and elements that helps you to create your
                listing faster.
              </p>
            </BlockDes>
          </BlockHeadContent>
        </BlockHead>
        <Block size="lg" className="optimizers">
          <Row className="g-gs">
            <Col lg={4}>
              <Link to={`${process.env.PUBLIC_URL}/optimizers/optimizer1`} className="card card-bordered text-soft">
                <div className="card-inner">
                  <div className="align-center justify-between">
                    <div className="g">
                      <h6 className="title !flex !items-center !mb-8">
                        <div className="!text-3xl !flex">
                          <Icon name="menu-alt-left !mr-3" />
                        </div>
                        Description
                      </h6>
                      <p className="mr-3 mb-2">Generate the perfect description with our optimizer for paragraphs.</p>
                    </div>
                    <div className="g">
                      <span className="btn btn-icon btn-trigger mr-n1">
                        <Icon name="chevron-right"></Icon>
                      </span>
                    </div>
                  </div>
                </div>{" "}
              </Link>
            </Col>
            <Col lg={4}>
              <Link to={`${process.env.PUBLIC_URL}/optimizers`} className="card card-bordered text-soft">
                <div className="card-inner">
                  <div className="align-center justify-between">
                    <div className="g">
                      <h6 className="title !flex !items-center !mb-8">
                        <div className="!text-3xl !flex">
                          <Icon name="heading !mr-3" />
                        </div>
                        Title
                      </h6>{" "}
                      <p className="mr-3 mb-2">Generate the perfect description with our optimizer for titles.</p>
                    </div>
                    <div className="g">
                      <span className="btn btn-icon btn-trigger mr-n1">
                        <Icon name="chevron-right"></Icon>
                      </span>
                    </div>
                  </div>
                </div>{" "}
              </Link>
            </Col>
            <Col lg={4}>
              <Link to={`${process.env.PUBLIC_URL}/optimizers`} className="card card-bordered text-soft">
                <div className="card-inner">
                  <div className="align-center justify-between">
                    <div className="g">
                      <h6 className="title !flex !items-center !mb-8">
                        <div className="!text-3xl !flex">
                          <Icon name="view-list-fill !mr-3" />
                        </div>
                        Bullet points
                      </h6>{" "}
                      <p className="mr-3 mb-2">
                        Generate the perfect description with our optimizer for bullet points.
                      </p>
                    </div>
                    <div className="g">
                      <span className="btn btn-icon btn-trigger mr-n1">
                        <Icon name="chevron-right"></Icon>
                      </span>
                    </div>
                  </div>
                </div>{" "}
              </Link>
            </Col>
            <Col lg={4}>
              <div className="disabledcard">
                <Link to={`${process.env.PUBLIC_URL}/optimizers`} className="card card-bordered text-soft">
                  <div className="card-inner">
                    <div className="align-center justify-between">
                      <div className="g">
                        <h6 className="title !flex !items-center !mb-8">
                          <div className="!text-3xl !flex">
                            <Icon name="layers-fill !mr-3" />
                          </div>
                          Multiple optimizer{" "}
                        </h6>{" "}
                        <p className="mr-3 mb-2">
                          Generate the perfect descriptions with our multiple input optimizer.
                        </p>
                      </div>
                      <div className="g">
                        <span className="btn btn-icon btn-trigger mr-n1">
                          <Icon name="chevron-right"></Icon>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </Col>
            <Col lg={4}>
              <div className="disabledcard">
                <Link to={`${process.env.PUBLIC_URL}/optimizers`} className="card card-bordered text-soft">
                  <div className="card-inner">
                    <div className="align-center justify-between">
                      <div className="g">
                        <h6 className="title !flex !items-center !mb-8">
                          <div className="!text-3xl !flex">
                            <Icon name="db !mr-3" />
                          </div>
                          Bulk optimizer{" "}
                        </h6>{" "}
                        <p className="mr-3 mb-2">Generate the perfect descriptions with our bulk input optimizer.</p>
                      </div>
                      <div className="g">
                        <span className="btn btn-icon btn-trigger mr-n1">
                          <Icon name="chevron-right"></Icon>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </Col>
          </Row>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default ComponentsPage;
