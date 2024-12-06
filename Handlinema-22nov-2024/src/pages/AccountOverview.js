import React, { useState, useEffect } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import SaleRevenue from "../components/partials/sales/sale-revenue/SaleRevenue";
import SalesOverview from "../components/partials/sales/sales-overview/SalesOverview";
import OrdersOverview from "../components/partials/orders/orders-overview/OrdersOverview";
import TopAsin from "../components/partials/orders/orders-overview/TopAsin";
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockContent,
  Row,
  Col,
  PreviewAltCard,
  BlockBetween,
} from "../components/Component";
import Tacos from "../components/partials/sales/active-subscription/Tacos";
import Acos from "../components/partials/sales/active-subscription/Acos";
import ADsales from "../components/partials/sales/active-subscription/ADsales";
import PPC from "../components/partials/sales/active-subscription/PPC";
import ADSimpressions from "../components/partials/sales/active-subscription/ADSimpressions";
import TotalUnits from "../components/partials/sales/active-subscription/TotalUnits";
import BestCampains from "../components/partials/datas/campains/BestCampains";
import BestKeywords from "../components/partials/datas/keywords/BestKeywords";
import WorstCampains from "../components/partials/datas/campains/WorstCampains";
import { Button, ButtonGroup } from "reactstrap";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import qs from "qs";
import axios from "axios";

const AccountOverview = () => {
  const location = useLocation();
  const spId = localStorage.getItem("spId");
  const spAccessToken = localStorage.getItem("spAccessToken");
  const spAtzAccessToken = localStorage.getItem("spAtzAccessToken");
  const BearerAlizonAccessToken = "Bearer" + " " + localStorage.getItem("AlizonAccessToken");
  const BearerAlizonRefreshToken = "Bearer" + " " + localStorage.getItem("AlizonRefreshToken");

  const [timeframe, setTimeframe] = React.useState(1);

  // useEffect(() => {
  //   if (qs.parse(location.search, { ignoreQueryPrefix: true }).spapi_oauth_code == undefined) {
  //     var myHeaders = new Headers();
  //     myHeaders.append("Authorization", BearerAlizonAccessToken);

  //     var requestOptions = {
  //       method: "GET",
  //       headers: myHeaders,
  //       redirect: "follow",
  //     };

  //     fetch("https://alizon-server.herokuapp.com/api/sp-api-refresh-token", requestOptions)
  //       .then((response) => response.json())
  //       .then((result) => {
  //         localStorage.setItem("spAtzAccessToken", result.access_token);
  //       })
  //       .catch((error) => {
  //         console.log("error", error);
  //       });
  //   }

  //   if (qs.parse(location.search, { ignoreQueryPrefix: true }).code == undefined) {
  //     var myHeaders = new Headers();
  //     myHeaders.append("Authorization", BearerAlizonAccessToken);

  //     var requestOptions = {
  //       method: "GET",
  //       headers: myHeaders,
  //       redirect: "follow",
  //     };

  //     fetch("https://alizon-server.herokuapp.com/api/ads-api-refresh-token", requestOptions)
  //       .then((response) => response.json())
  //       .then((result) => {
  //         localStorage.setItem("adsAtzAccessToken", result.access_token);
  //       })
  //       .catch((error) => {
  //         console.log("error", error);
  //       });
  //   }

  //   return () => {};
  // }, []);

  return (
    <React.Fragment>
      <Head title="Account overview"></Head>
      {/* {spId ? ( */}
        <Content>
          <BlockHead size="sm">
            <div className="flex justify-center">
              <BlockBetween>
                <BlockHeadContent>
                  <div className="toggle-wrap nk-block-tools-toggle">
                    <ButtonGroup>
                      <Button
                        color="primary"
                        onClick={() => setTimeframe(1)}
                        className={timeframe !== 1 ? "!opacity-60 !bg-transparent !text-[#030303]" : ""}
                      >
                        Today
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => setTimeframe(7)}
                        className={timeframe !== 7 ? "!opacity-60 !bg-transparent !text-[#030303]" : ""}
                      >
                        7 days
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => setTimeframe(30)}
                        className={timeframe !== 30 ? "!opacity-60 !bg-transparent !text-[#030303]" : ""}
                      >
                        30 days
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => setTimeframe(90)}
                        className={timeframe !== 90 ? "!opacity-60 !bg-transparent !text-[#030303]" : ""}
                      >
                        3 months
                      </Button>
                      <Button color="primary" className="!opacity-60 !bg-transparent !text-[#030303]">
                        Custom range
                      </Button>
                    </ButtonGroup>
                  </div>
                </BlockHeadContent>
              </BlockBetween>
            </div>
          </BlockHead>
          <Block>
            <Row className="g-gs">
              <Col sm="12" md="6" xxl="4">
                <Row className="g-gs">
                  <Col md="12" lg="12" xxl="12">
                    <PreviewAltCard>
                      <SaleRevenue timeframe={timeframe} />
                    </PreviewAltCard>
                  </Col>
                </Row>
                <Row className="g-gs">
                  <Col md="12" lg="12" xxl="12">
                    <Row className="g-gs">
                      <Col sm="6" md="6" lg="6" xxl="6">
                        <PreviewAltCard>
                          <TotalUnits />
                        </PreviewAltCard>
                      </Col>
                      <Col sm="6" md="6" lg="6" xxl="6">
                        <PreviewAltCard>
                          <PPC />
                        </PreviewAltCard>
                      </Col>
                    </Row>
                    <Row className="g-gs">
                      <Col sm="6" md="6" lg="6" xxl="6">
                        <PreviewAltCard>
                          <ADsales />
                        </PreviewAltCard>
                      </Col>
                      <Col sm="6" md="6" lg="6" xxl="6">
                        <PreviewAltCard>
                          <ADSimpressions />
                        </PreviewAltCard>
                      </Col>
                    </Row>
                    <Row className="g-gs">
                      <Col sm="6" md="6" lg="6" xxl="6">
                        <PreviewAltCard>
                          <Acos />
                        </PreviewAltCard>
                      </Col>
                      <Col sm="6" md="6" lg="6" xxl="6">
                        <PreviewAltCard>
                          <Tacos />
                        </PreviewAltCard>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col sm="6" md="6" xxl="5">
                <PreviewAltCard className="h-100">
                  <SalesOverview timeframe={timeframe} spAtzAccessToken={spAtzAccessToken} />
                  <OrdersOverview timeframe={timeframe} spAtzAccessToken={spAtzAccessToken} />
                </PreviewAltCard>
              </Col>
              <Col sm="12" md="12" xxl="3">
                <TopAsin timeframe={timeframe} spAtzAccessToken={spAtzAccessToken} />
              </Col>
            </Row>
            <Row className="g-gs">
              <Col sm="4" lg="4" md="4" xxl="4">
                <PreviewAltCard>
                  {" "}
                  <BestKeywords timeframe={timeframe} spAtzAccessToken={spAtzAccessToken} />
                </PreviewAltCard>
              </Col>
              <Col sm="4" lg="4" md="4" xxl="4">
                <PreviewAltCard>
                  {" "}
                  <BestCampains timeframe={timeframe} spAtzAccessToken={spAtzAccessToken} />
                </PreviewAltCard>
              </Col>
              <Col sm="4" lg="4" md="4" xxl="4">
                <PreviewAltCard>
                  <WorstCampains timeframe={timeframe} spAtzAccessToken={spAtzAccessToken} />
                </PreviewAltCard>
              </Col>
            </Row>
          </Block>
        </Content>
      {/* ) : (
        <Block className="nk-block-middle wide-md mx-auto">
          <BlockContent className="nk-error-ld text-center">
            <div className="wide-sm mx-auto !pt-32">
              <h3 className="nk-error-title">Initialize your account</h3>
              <div className=" flex align-middle justify-center !pb-8 !pt-2">
                {" "}
                <Link to="/user/connections">
                  <img
                    border="0"
                    alt="Login with Amazon"
                    src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_156x32.png"
                    width="156"
                    height="32"
                  />
                </Link>
              </div>
              <p className="nk-error-text">
                To start using <span className="!font-bold">Alizon</span> login into your{" "}
                <span className="!font-bold">Amazon Seller account</span> using the Login button.
              </p>
            </div>
          </BlockContent>
        </Block>
      )} */}
    </React.Fragment>
  );
};
export default AccountOverview;
