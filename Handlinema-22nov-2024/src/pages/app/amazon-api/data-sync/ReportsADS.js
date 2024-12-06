import React, { useState, useEffect } from "react";
import { Block, PreviewAltCard, Row, Col } from "../../../../components/Component";
import axios from "axios";
import { Button } from "reactstrap";
import ReactJson from "react-json-view";
import { ReportADSTypes } from "./ReportADSTypes";
import { Tooltip } from "reactstrap";
import { Icon } from "../../../../components/Component";

function ReportsADS() {
  const BearerAdsAccessToken = "Bearer" + " " + localStorage.getItem("adsAtzAccessToken");
  const adsAtzAccessToken = localStorage.getItem("adsAtzAccessToken");
  const BearerAlizonAccessToken = "Bearer" + " " + localStorage.getItem("AlizonAccessToken");
  const MarketplaceIds = localStorage.getItem("MarketplaceIds");
  const ProfileId = localStorage.getItem("ProfileId");
  const [reportADSType, setReportADSType] = useState("");
  const [reportADSStatus, setReportADSStatus] = useState("---");
  const [reportADSId, setReportADSId] = React.useState(localStorage.getItem("ReportADSId"));
  const [reportADSLink, setReportADSLink] = useState("");

  const latestReportADSDocumentId = localStorage.getItem("latestReportADSDocumentId");
  const [latestReportADS, setLatestReportADS] = useState([{}]);
  const [tooltipOpen, setOpen] = useState(false);

  const toggle = () => {
    setOpen(!tooltipOpen);
  };

  function getCurrentAndLatest2MonthsInterval() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(startDate.getMonth() - 2);

    const startISOString = startDate.toISOString();
    const endISOString = endDate.toISOString();

    return `${startISOString}--${endISOString}`;
  }

  function get2YearsInterval() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 2);

    const dataStartTime = startDate.toISOString();
    const dataEndTime = endDate.toISOString();

    return {
      dataStartTime,
      dataEndTime,
    };
  }

  const handleReportADSTypeChange = (selectedOption) => {
    setReportADSType(selectedOption);
    console.log(reportADSType);
  };

  function requestCampaignsADS() {
    const confirmed = window.confirm("Are you sure you want to request a new reportADS?");
    if (!confirmed) {
      return;
    }

    function getCampaignsADS() {
      const { dataStartTime, dataEndTime } = get2YearsInterval();
      console.log(ProfileId);
      const requestUrl = `https://advertising-api-eu.amazon.com/v2/sp/campaigns`;

      var body = JSON.stringify({});

      var data = JSON.stringify({
        url: requestUrl,
        ads_access_key: BearerAdsAccessToken,
        ads_profile_id: ProfileId,
        request_type: "GET",
        body: body,
      });

      var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://alizon-server.herokuapp.com/api/fetch-amazon-ads-api",
        headers: {
          Authorization: BearerAlizonAccessToken,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    getCampaignsADS();
  }

  function requestReportADS() {
    function getReportADS() {
      const { dataStartTime, dataEndTime } = get2YearsInterval();
      console.log(ProfileId);
      const requestUrl = `https://advertising-api-eu.amazon.com/reporting/reports`;

      var body = JSON.stringify({
        startDate: "2023-04-01",
        endDate: "2023-04-30",
        configuration: {
          adProduct: "SPONSORED_BRANDS",
          columns: [
            "date",
            "budgetCurrency",
            "campaignBudgetCurrencyCode",
            "campaignName",
            "adGroupName",
            "attributionType",
            "purchasedAsin",
            "productName",
            "productCategory",
            "sales14d",
            "orders14d",
            "unitsSold14d",
            "newToBrandSales14d",
            "newToBrandOrders14d",
            "newToBrandPurchases14d",
            "newToBrandUnitsSold14d",
            "newToBrandSalesPercentage14d",
            "newToBrandOrdersPercentage14d",
            "newToBrandPurchasesPercentage14d",
            "newToBrandUnitsSoldPercentage14d",
          ],
          reportTypeId: "sbPurchasedProduct",
          format: "GZIP_JSON",
          groupBy: ["purchasedAsin"],
          timeUnit: "DAILY",
        },
      });

      var data = JSON.stringify({
        url: requestUrl,
        ads_access_key: BearerAdsAccessToken,
        ads_profile_id: ProfileId,
        request_type: "POST",
        body: body,
      });

      var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://alizon-server.herokuapp.com/api/fetch-amazon-ads-api",
        headers: {
          Authorization: BearerAlizonAccessToken,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log(response.data);
          localStorage.setItem("latestReportADSId", response.data.reportId);
          setReportADSId(response.data.reportId)

        })
        .catch(function (error) {
          console.log(error);
        });
    }
    getReportADS();
  }

  function requestReportStatusADS() {
    function getReportStatusADS() {
      const { dataStartTime, dataEndTime } = get2YearsInterval();
      console.log(ProfileId);
      const requestUrl = `https://advertising-api-eu.amazon.com/reporting/reports/${reportADSId}`;

      var body = JSON.stringify({
      
      });

      var data = JSON.stringify({
        url: requestUrl,
        ads_access_key: BearerAdsAccessToken,
        ads_profile_id: ProfileId,
        request_type: "GET",
        body: "",
      });

      var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://alizon-server.herokuapp.com/api/fetch-amazon-ads-api",
        headers: {
          Authorization: BearerAlizonAccessToken,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log(response.data);
          setReportADSStatus(response.data.status)
          setReportADSLink(response.data.url)
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    getReportStatusADS();
  }

  function downloadReportADS() {
    var data = JSON.stringify({
      access_key: spAtzAccessToken,
      request_type: "GET",
      body: "",
      report_document_id: latestReportADSDocumentId,
      date_document: "2020-09-04",
      report_type: "sp",
      report_subtype: reportADSType.id,
    });

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://alizon-server.herokuapp.com/reports/download_report",
      headers: {
        Authorization: BearerAlizonAccessToken,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {})
      .catch(function (error) {
        console.log(error);
      });
  }

  async function viewLatestestReportADS() {
    var data = JSON.stringify({
      access_key: spAtzAccessToken,
      request_type: "GET",
      reportDocumentId: latestReportADSDocumentId,
      date_document: "2020-09-04",
      body: "",
    });

    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://alizon-server.herokuapp.com/reports/get_latest?type=sp&subtype=${reportADSType.id}`,
      headers: {
        Authorization: BearerAlizonAccessToken,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setLatestReportADS(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <Block>
      <Row>
        <Col sm="12" lg="12">
          <PreviewAltCard>
            <h5 className="mb-4">ADS-API Reports</h5>
            <div className="flex flex-row !max-w-fit items-center">
            <Button className="mx-1" onClick={requestCampaignsADS}>
                  Request Campaigns
                </Button>
              <div className="flex flex-row items-center">

                <span className="text-primary !mx-2 !text-2xl">
                  <Icon name="info" id="id"></Icon>
                </span>
                <Tooltip placement="right" isOpen={tooltipOpen} target="id" toggle={toggle}>
                  {reportADSType.description}
                </Tooltip>
            
              </div>
              <div>
                <Button className="mr-1" onClick={requestReportADS}>
                  Request Report
                </Button>
              </div>
              
              <div className="mr-2">

                <p>
                  Latest ReportId: <span className="!font-extrabold">{reportADSId}</span>
                </p>
              </div>
              <div>
                <Button className="mr-1" onClick={requestReportStatusADS}>
                  Check Status
                </Button>
              </div>
              <div className="mr-2">
                <p>
                  Report status: <span className="!font-extrabold">{reportADSStatus}</span>
                </p>
              </div>
              <div>
                <Button className="m-1" disabled={reportADSStatus !== "COMPLETED"} href={reportADSLink}>
                  Download Report ADS
                </Button>
                <Button className="m-1" disabled={reportADSStatus !== "DONE"} onClick={viewLatestestReportADS}>
                  View Latestest Report ADS
                </Button>
              </div>
            </div>
          </PreviewAltCard>
        </Col>
        <Col sm="12" lg="12">
          <PreviewAltCard>
            <Row>
              <Col sm="12" lg="12">
                <h5 className="mb-4">ADS-API Reports Data</h5>
              </Col>
            </Row>
            <Row>
              <Col sm="12" lg="12">
                <ReactJson collapsed="true" src={latestReportADS} />
              </Col>
            </Row>
          </PreviewAltCard>
        </Col>
      </Row>
    </Block>
  );
}

export default ReportsADS;
