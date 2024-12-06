import React from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  BackTo,
  PreviewCard,
  ReactDataTable,
} from "../../../components/Component";
import { DataTableData, dataTableColumns } from "./TableData";

const GrowthOpportunities = () => {
  return (
    <React.Fragment>
      <div className="growthopportunities nk-content nk-content-fluid">
        <Head title="Growth opportunities" />
        <Content>
          <BlockHead className="!pb-6">
            <BlockHeadContent>
            <div className="flex flex-row justify-center text-center">
                <div className="flex"></div>
                <div>
                  <BlockTitle tag="h2" className="fw-bold !text-2xl !pt-2 !mb-1">
                    Growth opportunities
                  </BlockTitle>
                  <BlockDes>
                    <p className="lead">
                      This tool gives a score and some suggested actionables to improve your product listing.
                    </p>
                  </BlockDes>
                </div>
              </div>
            </BlockHeadContent>
          </BlockHead>

              <ReactDataTable data={DataTableData} columns={dataTableColumns} expandableRows pagination actions />
        </Content>
      </div>
    </React.Fragment>
  );
};
export default GrowthOpportunities;
