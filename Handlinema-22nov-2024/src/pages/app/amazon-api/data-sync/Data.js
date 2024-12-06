import React, { useState, useEffect } from "react";
import { Block, PreviewAltCard, Row, Col } from "../../../../components/Component";
import axios from "axios";
import ReactJson from "react-json-view";


function Data() {
  const spAtzAccessToken = localStorage.getItem("spAtzAccessToken");
  const BearerAlizonAccessToken = "Bearer" + " " + localStorage.getItem("AlizonAccessToken");
  const MarketplaceIds = localStorage.getItem("MarketplaceIds");
  const [currency, setCurrency] = useState("");

  function getCurrentAndLast2MonthsInterval() {
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

    const startISOString = startDate.toISOString();
    const endISOString = endDate.toISOString();

    return `${startISOString}--${endISOString}`;
  }

  function get180Days() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 180);

    const startISOString = startDate.toISOString();

    return `${startISOString}`;
  }

  const [currentAndLast2MonthsPayload, setCurrentAndLast2MonthsPayload] = useState("");
  function getCurrentAndLast2MonthsPayload() {
    const interval = getCurrentAndLast2MonthsInterval();
    const requestUrl = `https://sellingpartnerapi-eu.amazon.com/sales/v1/orderMetrics?marketplaceIds=${MarketplaceIds}&interval=${interval}&granularity=DAY`;
    console.log(requestUrl);

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
        const payload = response.data.payload;
        setCurrentAndLast2MonthsPayload(payload);
        console.log(payload);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const [lastTwoYearsPayload, setLastTwoYearsPayload] = useState("");
  function getLastTwoYearsPayload() {
    const interval = get2YearsInterval();
    const requestUrl = `https://sellingpartnerapi-eu.amazon.com/sales/v1/orderMetrics?marketplaceIds=${MarketplaceIds}&interval=${interval}&granularity=MONTH`;
    console.log(requestUrl);

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
        const payload = response.data.payload;
        console.log(payload);
        setLastTwoYearsPayload(payload);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const [currentDayOrderCount, setCurrentDayOrderCount] = useState(0);
  const [lastDayOrderCount, setLastDayOrderCount] = useState(0);
  const [currentWeekOrderCount, setCurrentWeekOrderCount] = useState(0);
  const [lastWeekOrderCount, setLastWeekOrderCount] = useState(0);
  const [currentMonthOrderCount, setCurrentMonthOrderCount] = useState(0);
  const [lastMonthOrderCount, setLastMonthOrderCount] = useState(0);
  const [currentYearOrderCount, setCurrentYearOrderCount] = useState(0);
  const [lastYearOrderCount, setLastYearOrderCount] = useState(0);
  const [twoYearsOrderCount, setTwoYearOrderCount] = useState(0);

  function GetOrderCounts() {
    function GetOrderCounts1() {
      const payload = currentAndLast2MonthsPayload;
      const payloadLength = payload.length;
      const todayData = payload[payloadLength - 1];
      const yesterdayData = payload[payloadLength - 2];

      setCurrentDayOrderCount(todayData.orderCount);
      setLastDayOrderCount(yesterdayData.orderCount);

      const currentWeekStartDate = new Date();
      currentWeekStartDate.setDate(currentWeekStartDate.getDate() - currentWeekStartDate.getDay());

      const lastWeekStartDate = new Date(currentWeekStartDate);
      lastWeekStartDate.setDate(lastWeekStartDate.getDate() - 7);
      const lastWeekEndDate = new Date(currentWeekStartDate);
      lastWeekEndDate.setDate(lastWeekEndDate.getDate());

      let currentWeekSum = 0;
      let lastWeekSum = 0;

      payload.forEach((data) => {
        const intervalStartDate = new Date(data.interval.split("--")[0]);

        if (intervalStartDate >= currentWeekStartDate) {
          currentWeekSum += data.orderCount;
        } else if (intervalStartDate >= lastWeekStartDate && intervalStartDate <= lastWeekEndDate) {
          lastWeekSum += data.orderCount;
        }
      });

      setCurrentWeekOrderCount(currentWeekSum);
      setLastWeekOrderCount(lastWeekSum);
    }

    function GetOrderCounts2() {
      const payload = lastTwoYearsPayload;
      const payloadLength = payload.length;
      const thisMonthData = payload[payloadLength - 1];
      const lastMonthData = payload[payloadLength - 2];

      setCurrentMonthOrderCount(thisMonthData.orderCount);
      setLastMonthOrderCount(lastMonthData.orderCount);
    }

    function GetOrderCounts3() {
      const payload = lastTwoYearsPayload;
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const lastYear = currentYear - 1;
      const twoYearsAgo = currentYear - 2;

      let currentYearOrderCount = 0;
      let lastYearOrderCount = 0;
      let twoYearsOrderCount = 0;

      payload.forEach((data) => {
        const intervalStartDate = new Date(data.interval.split("--")[0]);

        if (intervalStartDate.getFullYear() === currentYear) {
          currentYearOrderCount += data.orderCount;
          twoYearsOrderCount += data.orderCount;
        } else if (intervalStartDate.getFullYear() === lastYear) {
          lastYearOrderCount += data.orderCount;
          twoYearsOrderCount += data.orderCount;
        }
      });

      setCurrentYearOrderCount(currentYearOrderCount);
      setLastYearOrderCount(lastYearOrderCount);
      setTwoYearOrderCount(twoYearsOrderCount);
    }

    GetOrderCounts1();
    GetOrderCounts2();
    GetOrderCounts3();
  }

  const [currentDayOrderItemCount, setCurrentDayOrderItemCount] = useState(0);
  const [lastDayOrderItemCount, setLastDayOrderItemCount] = useState(0);
  const [currentWeekOrderItemCount, setCurrentWeekOrderItemCount] = useState(0);
  const [lastWeekOrderItemCount, setLastWeekOrderItemCount] = useState(0);
  const [currentMonthOrderItemCount, setCurrentMonthOrderItemCount] = useState(0);
  const [lastMonthOrderItemCount, setLastMonthOrderItemCount] = useState(0);
  const [currentYearOrderItemCount, setCurrentYearOrderItemCount] = useState(0);
  const [lastYearOrderItemCount, setLastYearOrderItemCount] = useState(0);
  const [twoYearsOrderItemCount, setTwoYearsOrderItemCount] = useState(0);

  function GetOrderItemCounts() {
    function GetOrderItemCounts1() {
      const payload = currentAndLast2MonthsPayload;
      const payloadLength = payload.length;
      const todayData = payload[payloadLength - 1];
      const yesterdayData = payload[payloadLength - 2];

      setCurrentDayOrderItemCount(todayData.orderItemCount);
      setLastDayOrderItemCount(yesterdayData.orderItemCount);

      const currentWeekStartDate = new Date();
      currentWeekStartDate.setDate(currentWeekStartDate.getDate() - currentWeekStartDate.getDay());

      const lastWeekStartDate = new Date(currentWeekStartDate);
      lastWeekStartDate.setDate(lastWeekStartDate.getDate() - 7);
      const lastWeekEndDate = new Date(currentWeekStartDate);
      lastWeekEndDate.setDate(lastWeekEndDate.getDate());

      let currentWeekSum = 0;
      let lastWeekSum = 0;

      payload.forEach((data) => {
        const intervalStartDate = new Date(data.interval.split("--")[0]);

        if (intervalStartDate >= currentWeekStartDate) {
          currentWeekSum += data.orderItemCount;
        } else if (intervalStartDate >= lastWeekStartDate && intervalStartDate <= lastWeekEndDate) {
          lastWeekSum += data.orderItemCount;
        }
      });

      setCurrentWeekOrderItemCount(currentWeekSum);
      setLastWeekOrderItemCount(lastWeekSum);
    }

    function GetOrderItemCounts2() {
      const payload = lastTwoYearsPayload;
      const payloadLength = payload.length;
      const thisMonthData = payload[payloadLength - 1];
      const lastMonthData = payload[payloadLength - 2];

      setCurrentMonthOrderItemCount(thisMonthData.orderItemCount);
      setLastMonthOrderItemCount(lastMonthData.orderItemCount);
    }

    function GetOrderItemCounts3() {
      const payload = lastTwoYearsPayload;
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const lastYear = currentYear - 1;
      const twoYearsAgo = currentYear - 2;

      let currentYearOrderItemCount = 0;
      let lastYearOrderItemCount = 0;
      let twoYearsOrderItemCount = 0;

      payload.forEach((data) => {
        const intervalStartDate = new Date(data.interval.split("--")[0]);

        if (intervalStartDate.getFullYear() === currentYear) {
          currentYearOrderItemCount += data.orderItemCount;
          twoYearsOrderItemCount += data.orderItemCount;
        } else if (intervalStartDate.getFullYear() === lastYear) {
          lastYearOrderItemCount += data.orderItemCount;
          twoYearsOrderItemCount += data.orderItemCount;
        }
      });

      setCurrentYearOrderItemCount(currentYearOrderItemCount);
      setLastYearOrderItemCount(lastYearOrderItemCount);
      setTwoYearsOrderItemCount(twoYearsOrderItemCount);
    }

    GetOrderItemCounts1();
    GetOrderItemCounts2();
    GetOrderItemCounts3();
  }

  const [currentDayUnitCount, setCurrentDayUnitCount] = useState(0);
  const [lastDayUnitCount, setLastDayUnitCount] = useState(0);
  const [currentWeekUnitCount, setCurrentWeekUnitCount] = useState(0);
  const [lastWeekUnitCount, setLastWeekUnitCount] = useState(0);
  const [currentMonthUnitCount, setCurrentMonthUnitCount] = useState(0);
  const [lastMonthUnitCount, setLastMonthUnitCount] = useState(0);
  const [currentYearUnitCount, setCurrentYearUnitCount] = useState(0);
  const [lastYearUnitCount, setLastYearUnitCount] = useState(0);
  const [twoYearsUnitCount, setTwoYearsUnitCount] = useState(0);

  function GetUnitCounts() {
    function GetUnitCounts1() {
      const payload = currentAndLast2MonthsPayload;
      const payloadLength = payload.length;
      const todayData = payload[payloadLength - 1];
      const yesterdayData = payload[payloadLength - 2];

      setCurrentDayUnitCount(todayData.unitCount);
      setLastDayUnitCount(yesterdayData.unitCount);

      const currentWeekStartDate = new Date();
      currentWeekStartDate.setDate(currentWeekStartDate.getDate() - currentWeekStartDate.getDay());

      const lastWeekStartDate = new Date(currentWeekStartDate);
      lastWeekStartDate.setDate(lastWeekStartDate.getDate() - 7);
      const lastWeekEndDate = new Date(currentWeekStartDate);
      lastWeekEndDate.setDate(lastWeekEndDate.getDate());

      let currentWeekSum = 0;
      let lastWeekSum = 0;

      payload.forEach((data) => {
        const intervalStartDate = new Date(data.interval.split("--")[0]);

        if (intervalStartDate >= currentWeekStartDate) {
          currentWeekSum += data.unitCount;
        } else if (intervalStartDate >= lastWeekStartDate && intervalStartDate <= lastWeekEndDate) {
          lastWeekSum += data.unitCount;
        }
      });

      setCurrentWeekUnitCount(currentWeekSum);
      setLastWeekUnitCount(lastWeekSum);
    }

    function GetUnitCounts2() {
      const payload = lastTwoYearsPayload;
      const payloadLength = payload.length;
      const thisMonthData = payload[payloadLength - 1];
      const lastMonthData = payload[payloadLength - 2];

      setCurrentMonthUnitCount(thisMonthData.unitCount);
      setLastMonthUnitCount(lastMonthData.unitCount);
    }

    function GetUnitCounts3() {
      const payload = lastTwoYearsPayload;
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const lastYear = currentYear - 1;
      const twoYearsAgo = currentYear - 2;

      let currentYearUnitCount = 0;
      let lastYearUnitCount = 0;
      let twoYearsUnitCount = 0;

      payload.forEach((data) => {
        const intervalStartDate = new Date(data.interval.split("--")[0]);

        if (intervalStartDate.getFullYear() === currentYear) {
          currentYearUnitCount += data.unitCount;
          twoYearsUnitCount += data.unitCount;
        } else if (intervalStartDate.getFullYear() === lastYear) {
          lastYearUnitCount += data.unitCount;
          twoYearsUnitCount += data.unitCount;
        }
      });

      setCurrentYearUnitCount(currentYearUnitCount);
      setLastYearUnitCount(lastYearUnitCount);
      setTwoYearsUnitCount(twoYearsUnitCount);
    }

    GetUnitCounts1();
    GetUnitCounts2();
    GetUnitCounts3();
  }

  const [currentDayTotalSales, setCurrentDayTotalSales] = useState(0);
  const [lastDayTotalSales, setLastDayTotalSales] = useState(0);
  const [currentWeekTotalSales, setCurrentWeekTotalSales] = useState(0);
  const [lastWeekTotalSales, setLastWeekTotalSales] = useState(0);
  const [currentMonthTotalSales, setCurrentMonthTotalSales] = useState(0);
  const [lastMonthTotalSales, setLastMonthTotalSales] = useState(0);
  const [currentYearTotalSales, setCurrentYearTotalSales] = useState(0);
  const [lastYearTotalSales, setLastYearTotalSales] = useState(0);
  const [twoYearsTotalSales, setTwoYearsTotalSales] = useState(0);
  const [list30DaysTotalSales, setList30DaysTotalSales] = useState(0);

  function GetTotalSales() {
    function GetTotalSales1() {
      const payload = currentAndLast2MonthsPayload;
      const payloadLength = payload.length;
      const todayData = payload[payloadLength - 1];
      const yesterdayData = payload[payloadLength - 2];

      setCurrentDayTotalSales(todayData.totalSales.amount);
      setLastDayTotalSales(yesterdayData.totalSales.amount);

      const currentWeekStartDate = new Date();
      currentWeekStartDate.setDate(currentWeekStartDate.getDate() - currentWeekStartDate.getDay());

      const lastWeekStartDate = new Date(currentWeekStartDate);
      lastWeekStartDate.setDate(lastWeekStartDate.getDate() - 7);
      const lastWeekEndDate = new Date(currentWeekStartDate);
      lastWeekEndDate.setDate(lastWeekEndDate.getDate());

      let currentWeekSum = 0;
      let lastWeekSum = 0;

      payload.forEach((data) => {
        const intervalStartDate = new Date(data.interval.split("--")[0]);

        if (intervalStartDate >= currentWeekStartDate) {
          currentWeekSum += data.totalSales.amount;
        } else if (intervalStartDate >= lastWeekStartDate && intervalStartDate <= lastWeekEndDate) {
          lastWeekSum += data.totalSales.amount;
        }
      });

      setCurrentWeekTotalSales(parseFloat(currentWeekSum.toFixed(2)));
      setLastWeekTotalSales(parseFloat(lastWeekSum.toFixed(2)));
    }

    function GetTotalSales2() {
      const payload = lastTwoYearsPayload;
      const payloadLength = payload.length;
      const thisMonthData = payload[payloadLength - 1];
      const lastMonthData = payload[payloadLength - 2];

      setCurrentMonthTotalSales(parseFloat(thisMonthData.totalSales.amount.toFixed(2)));
      setLastMonthTotalSales(parseFloat(lastMonthData.totalSales.amount.toFixed(2)));
    }

    function GetTotalSales3() {
      const payload = lastTwoYearsPayload;
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const lastYear = currentYear - 1;
      const twoYearsAgo = currentYear - 2;

      let currentYearTotalSales = 0;
      let lastYearTotalSales = 0;
      let twoYearsTotalSales = 0;

      payload.forEach((data) => {
        const intervalStartDate = new Date(data.interval.split("--")[0]);

        if (intervalStartDate.getFullYear() === currentYear) {
          currentYearTotalSales += data.totalSales.amount;
          twoYearsTotalSales += data.totalSales.amount;
        } else if (intervalStartDate.getFullYear() === lastYear) {
          lastYearTotalSales += data.totalSales.amount;
          twoYearsTotalSales += data.totalSales.amount;
        }
      });

      setCurrentYearTotalSales(parseFloat(currentYearTotalSales.toFixed(2)));
      setLastYearTotalSales(parseFloat(lastYearTotalSales.toFixed(2)));
      setTwoYearsTotalSales(parseFloat(twoYearsTotalSales.toFixed(2)));
    }

    function GetList30DaysTotalSales() {}

    GetTotalSales1();
    GetTotalSales2();
    GetTotalSales3();
  }

  

  const [marketplaceParticipations, setMarketplaceParticipations] = useState({});
  function getMarketplaceParticipations() {
    const requestUrl = `https://sellingpartnerapi-eu.amazon.com/sellers/v1/marketplaceParticipations`;
    console.log(requestUrl);

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
        const payload = response.data.payload;
        setMarketplaceParticipations(payload);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const [financialEvents, setFinancialevents] = useState({});
  function getFinancialevents() {
    const PostedAfter = get180Days();
    const requestUrl = `https://sellingpartnerapi-eu.amazon.com/finances/v0/financialEvents?PostedAfter=${PostedAfter}`;
    console.log(requestUrl);

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
        const payload = response.data.payload;
        setFinancialevents(payload);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  useEffect(() => {
    getCurrentAndLast2MonthsPayload();
    getLastTwoYearsPayload();
  }, []);

  useEffect(() => {
    if (currentAndLast2MonthsPayload && lastTwoYearsPayload) {
      setCurrency("GBP");
      getMarketplaceParticipations();
      getFinancialevents();
      GetOrderCounts();
      GetOrderItemCounts();
      GetUnitCounts();
      GetTotalSales();
    }
  }, [currentAndLast2MonthsPayload, lastTwoYearsPayload]);

  return (
    <Block>
      <Row className="mb-2">
        <Col sm="12" lg="12">
          <PreviewAltCard>
            <h5 className="mb-4">Seller Informations</h5>
            <h6 className="mb-3">MarketplaceParticipations</h6>
            <ReactJson collapsed="true" src={marketplaceParticipations} />
            <h6 className="mb-3 mt-4">FinancialEvents</h6>
            <ReactJson collapsed="true" src={financialEvents} />
          </PreviewAltCard>
        </Col>
      </Row>
      <Row>
        <Col sm="4" lg="3">
          <PreviewAltCard>
            <h5 className="mb-4">Total Orders</h5>
            <p>
              Today: <span className="!font-extrabold">{currentDayOrderCount}</span>
            </p>
            <p>
              Yesterday: <span className="!font-extrabold">{lastDayOrderCount}</span>
            </p>
            <p>
              This Week: <span className="!font-extrabold">{currentWeekOrderCount}</span>
            </p>
            <p>
              Last Week: <span className="!font-extrabold">{lastWeekOrderCount}</span>
            </p>
            <p>
              This Month: <span className="!font-extrabold">{currentMonthOrderCount}</span>
            </p>
            <p>
              Last Month: <span className="!font-extrabold">{lastMonthOrderCount}</span>
            </p>
            <p>
              This Year: <span className="!font-extrabold">{currentYearOrderCount}</span>
            </p>
            <p>
              Last Year: <span className="!font-extrabold">{lastYearOrderCount}</span>
            </p>
            <p>
              Two Years: <span className="!font-extrabold">{twoYearsOrderCount}</span>
            </p>
          </PreviewAltCard>
        </Col>
        <Col sm="4" lg="3">
          <PreviewAltCard>
            <h5 className="mb-4">Total Order Items</h5>
            <p>
              Today: <span className="!font-extrabold">{currentDayOrderItemCount}</span>
            </p>
            <p>
              Yesterday: <span className="!font-extrabold">{lastDayOrderItemCount}</span>
            </p>
            <p>
              This Week: <span className="!font-extrabold">{currentWeekOrderItemCount}</span>
            </p>
            <p>
              Last Week: <span className="!font-extrabold">{lastWeekOrderItemCount}</span>
            </p>
            <p>
              This Month: <span className="!font-extrabold">{currentMonthOrderItemCount}</span>
            </p>
            <p>
              Last Month: <span className="!font-extrabold">{lastMonthOrderItemCount}</span>
            </p>
            <p>
              This Year: <span className="!font-extrabold">{currentYearOrderItemCount}</span>
            </p>
            <p>
              Last Year: <span className="!font-extrabold">{lastYearOrderItemCount}</span>
            </p>
            <p>
              Two Years: <span className="!font-extrabold">{twoYearsOrderItemCount}</span>
            </p>
          </PreviewAltCard>
        </Col>
        <Col sm="4" lg="3">
          <PreviewAltCard>
            <h5 className="mb-4">Total Units</h5>
            <p>
              Today: <span className="!font-extrabold">{currentDayUnitCount}</span>
            </p>
            <p>
              Yesterday: <span className="!font-extrabold">{lastDayUnitCount}</span>
            </p>
            <p>
              This Week: <span className="!font-extrabold">{currentWeekUnitCount}</span>
            </p>
            <p>
              Last Week: <span className="!font-extrabold">{lastWeekUnitCount}</span>
            </p>
            <p>
              This Month: <span className="!font-extrabold">{currentMonthUnitCount}</span>
            </p>
            <p>
              Last Month: <span className="!font-extrabold">{lastMonthUnitCount}</span>
            </p>
            <p>
              This Year: <span className="!font-extrabold">{currentYearUnitCount}</span>
            </p>
            <p>
              Last Year: <span className="!font-extrabold">{lastYearUnitCount}</span>
            </p>
            <p>
              Two Years: <span className="!font-extrabold">{twoYearsUnitCount}</span>
            </p>
          </PreviewAltCard>
        </Col>  
        <Col sm="4" lg="3">
          <PreviewAltCard>
            <h5 className="mb-4">Total Sales</h5>
            <p>
              Today:{" "}
              <span className="!font-extrabold">
                {currentDayTotalSales} {currency}
              </span>
            </p>
            <p>
              Yesterday:{" "}
              <span className="!font-extrabold">
                {lastDayTotalSales} {currency}
              </span>
            </p>
            <p>
              This Week:{" "}
              <span className="!font-extrabold">
                {currentWeekTotalSales} {currency}
              </span>
            </p>
            <p>
              Last Week:{" "}
              <span className="!font-extrabold">
                {lastWeekTotalSales} {currency}
              </span>
            </p>
            <p>
              This Month:{" "}
              <span className="!font-extrabold">
                {currentMonthTotalSales} {currency}
              </span>
            </p>
            <p>
              Last Month:{" "}
              <span className="!font-extrabold">
                {lastMonthTotalSales} {currency}
              </span>
            </p>
            <p>
              This Year:{" "}
              <span className="!font-extrabold">
                {currentYearTotalSales} {currency}
              </span>
            </p>
            <p>
              Last Year:{" "}
              <span className="!font-extrabold">
                {lastYearTotalSales} {currency}
              </span>
            </p>
            <p>
              Two Years:{" "}
              <span className="!font-extrabold">
                {twoYearsTotalSales} {currency}
              </span>
            </p>
          </PreviewAltCard>
        </Col>

      </Row>
    </Block>

  );
}

export default Data;
