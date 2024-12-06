import React, { useState, useEffect } from "react";
import { Block, PreviewAltCard, Row, Col } from "../../../../components/Component";
import axios from "axios";
import { Button } from "reactstrap";
import ReactJson from "react-json-view";
import { ReportSPTypes } from "./ReportSPTypes";
import { RSelect } from "../../../../components/Component";
import { Tooltip } from "reactstrap";
import { Icon } from "../../../../components/Component";

function ReportsSP() {
  const spAtzAccessToken = localStorage.getItem("spAtzAccessToken");
  const BearerAlizonAccessToken = "Bearer" + " " + localStorage.getItem("AlizonAccessToken");
  const MarketplaceIds = localStorage.getItem("MarketplaceIds");
  const [reportSPType, setReportSPType] = useState("");
  const [reportSPStatus, setReportSPStatus] = useState("---");
  const [reportSPId, setReportSPId] = React.useState(localStorage.getItem("latestReportSPId"));
  const latestReportSPDocumentId = localStorage.getItem("latestReportSPDocumentId");
  const [latestReportSP, setLatestReportSP] = useState([{}]);
  const [tooltipOpen, setOpen] = useState(false);
  
  const toggle = () => {
    setOpen(!tooltipOpen);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setReportSPId(localStorage.getItem("latestReportSPId"));
    }, 5000); // 5000 milliseconds = 5 seconds

    return () => clearInterval(interval);
  }, []);



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

  const handleReportSPTypeChange = (selectedOption) => {
    setReportSPType(selectedOption);
    console.log(reportSPType);
  };

  function requestReportSP() {
    const confirmed = window.confirm("Are you sure you want to request a new reportSP?");
    if (!confirmed) {
      return;
    }

    function get2YearsReportSP() {
      const { dataStartTime, dataEndTime } = get2YearsInterval();
      const requestUrl = `https://sellingpartnerapi-eu.amazon.com/reports/2020-09-04/reports`;

      var body = JSON.stringify({
        reportType: reportSPType.report_type,
        dataStartTime: dataStartTime,
        dataEndTime: dataEndTime,
        marketplaceIds: [`${MarketplaceIds}`],
      });

      var data = JSON.stringify({
        url: requestUrl,
        access_key: spAtzAccessToken,
        request_type: "POST",
        body: body,
      });

      var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://alizon-server.herokuapp.com/api/fetch-amazon-api",
        headers: {
          Authorization: BearerAlizonAccessToken,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log(response.data);
          localStorage.setItem("latestReportSPId", response.data.payload.reportId);
          requestReportSPStatus();
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    get2YearsReportSP();
  }

  function requestReportSPStatus() {
    function getReportSPStatus() {
      const requestUrl = `https://sellingpartnerapi-eu.amazon.com/reports/2020-09-04/reports/${reportSPId}`;

      var data = JSON.stringify({
        url: requestUrl,
        access_key: spAtzAccessToken,
        request_type: "GET",
        body: "",
      });

      var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://alizon-server.herokuapp.com/api/fetch-amazon-api",
        headers: {
          Authorization: BearerAlizonAccessToken,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log(response.data);
          setReportSPStatus(response.data.payload.processingStatus);
          localStorage.setItem("latestReportSPDocumentId", response.data.payload.reportDocumentId);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    setReportSPStatus(null);
    getReportSPStatus();
  }

  function downloadReportSP() {
    var data = JSON.stringify({
      access_key: spAtzAccessToken,
      request_type: "GET",
      body: "",
      report_document_id: latestReportSPDocumentId,
      date_document: "2020-09-04",
      report_type: "sp",
      report_subtype: reportSPType.id,
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

  async function viewLatestestReportSP() {
    var data = JSON.stringify({
      access_key: spAtzAccessToken,
      request_type: "GET",
      reportDocumentId: latestReportSPDocumentId,
      date_document: "2020-09-04",
      body: "",
    });

    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://alizon-server.herokuapp.com/reports/get_latest?type=sp&subtype=${reportSPType.id}`,
      headers: {
        Authorization: BearerAlizonAccessToken,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setLatestReportSP(response.data);
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
            <h5 className="mb-4">SP-API Reports</h5>
            <div className="flex flex-row !max-w-fit items-center">
              <div className="flex flex-row items-center">
                <RSelect
                  className="!w-[350px]"
                  options={ReportSPTypes()}
                  value={reportSPType}
                  getOptionLabel={(option) => option.report_type}
                  getOptionValue={(option) => option.report_type}
                  onChange={handleReportSPTypeChange}
                  placeholder="Select Report Type"
                />
                  <span className="text-primary !mx-2 !text-2xl">
                    <Icon name="info" id="id"></Icon>
                  </span>
                <Tooltip placement="right" isOpen={tooltipOpen} target="id" toggle={toggle}>
                  {reportSPType.description}
                </Tooltip>
                <Button className="mx-1" onClick={requestReportSP}>
                  Request Report
                </Button>
              </div>
              <div className="mr-2">
                <p>
                  Latest ReportId: <span className="!font-extrabold">{reportSPId}</span>
                </p>
              </div>
              <div>
                <Button className="mr-1" disabled={reportSPId == null} onClick={requestReportSPStatus}>
                  Check status
                </Button>
              </div>
              <div className="mr-2">
                <p>
                  Report status: <span className="!font-extrabold">{reportSPStatus}</span>
                </p>
              </div>
              <div>
                <Button className="m-1" disabled={reportSPStatus !== "DONE"} onClick={downloadReportSP}>
                  Download Report SP into DB
                </Button>
                <Button className="m-1" disabled={reportSPStatus !== "DONE"} onClick={viewLatestestReportSP}>
                  View Latestest Report SP
                </Button>
              </div>
            </div>
          </PreviewAltCard>
        </Col>
        <Col sm="12" lg="12">
          <PreviewAltCard>
            <Row>
              <Col sm="12" lg="12">
                <h5 className="mb-4">SP-API Reports Data</h5>
              </Col>
            </Row>
            <Row>
              <Col sm="12" lg="12">
                <ReactJson collapsed="true" src={latestReportSP} />
              </Col>
            </Row>
          </PreviewAltCard>
        </Col>
      </Row>
    </Block>
  );
}

export default ReportsSP;
