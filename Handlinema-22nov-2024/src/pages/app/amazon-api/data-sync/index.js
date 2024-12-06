import React, { useState, useEffect } from "react";
import Head from "../../../../layout/head/Head";
import Content from "../../../../layout/content/Content";
import {
  Block,
  BlockHead,
  BlockContent,
  BlockBetween,
} from "../../../../components/Component";
import { useLocation } from "react-router";
import qs from "qs";
import Data from "./Data";
import ReportsSP from "./ReportsSP";
import ReportsADS from "./ReportsADS";

const DataSync = () => {
  const location = useLocation();
  const spId = localStorage.getItem("spId");
  const BearerAlizonAccessToken = "Bearer" + " " + localStorage.getItem("AlizonAccessToken");

  useEffect(() => {
    if (qs.parse(location.search, { ignoreQueryPrefix: true }).spapi_oauth_code == undefined) {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", BearerAlizonAccessToken);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("https://alizon-server.herokuapp.com/api/sp-api-refresh-token", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          localStorage.setItem("spAtzAccessToken", result.access_token);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }

    if (qs.parse(location.search, { ignoreQueryPrefix: true }).code == undefined) {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", BearerAlizonAccessToken);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("https://alizon-server.herokuapp.com/api/ads-api-refresh-token", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          localStorage.setItem("adsAtzAccessToken", result.access_token);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, []);

  return (
    <React.Fragment>
      <Head title="Account overview"></Head>
      {spId ? (
        <Content>
          <BlockHead size="sm">
            <div className="flex justify-center">
              <BlockBetween></BlockBetween>
            </div>
          </BlockHead>
          <Data />
          <ReportsSP />
          <ReportsADS />

        </Content>
      ) : (
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
                To start using <p className="!font-bold">Headlinema</p> login into your{" "}
                <p className="!font-bold">Amazon Seller account</p> using the Login button.
              </p>
            </div>
          </BlockContent>
        </Block>
      )}
    </React.Fragment>
  );
};

export default DataSync;
