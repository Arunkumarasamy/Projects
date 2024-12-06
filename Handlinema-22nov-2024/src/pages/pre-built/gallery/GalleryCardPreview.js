import React, { useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import GalleryCard from "../../../components/partials/gallery/GalleryCard";
import {
  BlockBetween,
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

const GalleryCardPreview = () => {
  const [data] = useState(galleryData);
  return (
    <React.Fragment>
      <Head title="Image optimizers"></Head>
      <Content>
      <BlockHead className="!pb-6">
            <BlockHeadContent>
            <div className="flex flex-row justify-center text-center">
                <div className="flex"></div>
                <div>
                  <BlockTitle tag="h2" className="fw-bold !text-2xl !pt-2 !mb-1">
Image optimizers                  </BlockTitle>
                  <BlockDes>
                    <p className="lead">
You have a total of 3452 images from 1234 products.                    </p>
                  </BlockDes>
                </div>
              </div>
            </BlockHeadContent>
          </BlockHead>

        <Block>
          <Row className="g-gs">
            {data.map((item) => {
              return (
                <Col sm={2} lg={2} key={item.id}>
                                    <GalleryCard
                    img={item.img}
                    userName={item.userName}
                    userEmail={item.userEmail}
                    theme={item.theme}
                  />
                </Col>
              );
            })}
          </Row>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default GalleryCardPreview;
