import React, { Suspense, useLayoutEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ProductContextProvider } from "../pages/pre-built/products/ProductContext";
import { UserContextProvider } from "../pages/pre-built/user-manage/UserContext";
import { RedirectAs404 } from "../utils/Utils";

import AccountOverview from "../pages/AccountOverview";
import Analytics from "../pages/Analytics";
import Invest from "../pages/Invest";

import CryptoDashboard from "../pages/panel/crypto-panel/Index";
import Account from "../pages/panel/crypto-panel/Account";
import BuySell from "../pages/panel/crypto-panel/BuySell";
import Wallets from "../pages/panel/crypto-panel/Wallets";
import Welcome from "../pages/panel/crypto-panel/pages/Welcome";
import KycApplications from "../pages/panel/crypto-panel/pages/KycApplications";
import KycForms from "../pages/panel/crypto-panel/pages/KycForms";
import UserProfile from "../pages/panel/crypto-panel/user/UserProfileLayout";



import Optimizers from "../pages/app/optimizers";
import Optimizer1 from "../pages/app/optimizers/optimizer1";
import Optimizer2 from "../pages/app/optimizers/optimizer2";
import Optimizer3 from "../pages/app/optimizers/optimizer3";
import Optimizer4 from "../pages/app/optimizers/optimizer4";
import Optimizer5 from "../pages/app/optimizers/optimizer5";

import GrowthOpportunities from "../pages/app/growth-opportunities/GrowthOpportunities";
import MarketFeedback from "../pages/app/market-feedback/MarketFeedback";
import ImgOptimizers from "../pages/app/img-optimizers/GalleryCardPreview";
import AiCustomerService from "../pages/app/messages/Messages";
import AiAccountManager from "../pages/app/chat/ChatContainer";
import ProductsTranslator from "../pages/app/productsTranslator";
import Tester from "../pages/app/amazon-api/tester";
import DataSync from "../pages/app/amazon-api/data-sync";

import Blank from "../pages/others/Blank";
import Faq from "../pages/others/Faq";
import Regularv1 from "../pages/others/Regular-1";
import Regularv2 from "../pages/others/Regular-2";
import Terms from "../pages/others/Terms";


import ProjectCardPage from "../pages/pre-built/projects/ProjectCard";
import ProjectListPage from "../pages/pre-built/projects/ProjectList";
import UserListRegularPage from "../pages/pre-built/user-manage/UserListRegular";
import UserContactCardPage from "../pages/pre-built/user-manage/UserContactCard";
import UserDetailsPage from "../pages/pre-built/user-manage/UserDetailsRegular";
import UserListCompact from "../pages/pre-built/user-manage/UserListCompact";
import UserProfileLayout from "../pages/pre-built/user-manage/UserProfileLayout";
import KycListRegular from "../pages/pre-built/kyc-list-regular/KycListRegular";
import KycDetailsRegular from "../pages/pre-built/kyc-list-regular/kycDetailsRegular";
import TransListBasic from "../pages/pre-built/trans-list/TransListBasic";
import TransListCrypto from "../pages/pre-built/trans-list/TransListCrypto";
import ProductCard from "../pages/pre-built/products/ProductCard";
import ProductList from "../pages/pre-built/products/ProductList";
import ProductDetails from "../pages/pre-built/products/ProductDetails";
import InvoiceList from "../pages/pre-built/invoice/InvoiceList";
import InvoiceDetails from "../pages/pre-built/invoice/InvoiceDetails";
import PricingTable from "../pages/pre-built/pricing-table/PricingTable";


import Kanban from "../pages/app/kanban/Kanban";
import Inbox from "../pages/app/inbox/Inbox";
import Calender from "../pages/app/calender/Calender";
import OptimizerNew from "../pages/app/optimizerNew";
import Oauth from "../pages/panel/crypto-panel/user/Oauth";


const Pages = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });


  const spId = localStorage.getItem("spId");

  return (
    <Suspense fallback={<div />}>
      <Switch>
        {/*Dashboards*/}
        <Route exact path={`${process.env.PUBLIC_URL}/account-overview`} component={AccountOverview}></Route>

        <Route exact path={`${process.env.PUBLIC_URL}/`}>
          <Redirect to={`${process.env.PUBLIC_URL}/auth-login`}></Redirect>
        </Route>
        <Route exact path={`${process.env.PUBLIC_URL}/pages/terms-policy`} component={Terms}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/user/connections/`} component={UserProfile}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/user/profile/`} component={UserProfile}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/user/settings/`} component={UserProfile}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/oauth/connections/`} component={Oauth}></Route>

        <Route exact path={`${process.env.PUBLIC_URL}/amazon-api/tester/`} component={Tester}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/amazon-api/data-sync/`} component={DataSync}></Route>

        <Route
          exact
          path={`${process.env.PUBLIC_URL}/user/notifications/`}
          component={UserProfile}
        ></Route>

        <Route exact path={`${process.env.PUBLIC_URL}/crypto/accounts`} component={Account}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/crypto/wallets`} component={Wallets}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/crypto/`} component={CryptoDashboard}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/crypto/buy-sell`} component={BuySell}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/crypto/welcome`} component={Welcome}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/crypto/kyc-application`} component={KycApplications}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/crypto/kyc-form`} component={KycForms}></Route>

        <Route exact path={`${process.env.PUBLIC_URL}/pages/faq`} component={Faq}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/pages/regular-v1`} component={Regularv1}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/pages/regular-v2`} component={Regularv2}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/invoice-list`} component={InvoiceList}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/invoice-details/:id`} component={InvoiceDetails}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/pricing-table`} component={PricingTable}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/user-profile-regular/`} component={UserProfileLayout}></Route>


        {/* {spId ? (
          <> */}
            <Route exact path={`${process.env.PUBLIC_URL}/analytics`} component={Analytics}></Route>
            <Route exact path={`${process.env.PUBLIC_URL}/optimizers`} component={OptimizerNew}></Route>
            <Route exact path={`${process.env.PUBLIC_URL}/products-translator`} component={ProductsTranslator}></Route>

            <Route
              exact
              path={`${process.env.PUBLIC_URL}/growth-opportunities`}
              component={GrowthOpportunities}
            ></Route>
            <Route exact path={`${process.env.PUBLIC_URL}/market-feedback`} component={MarketFeedback}></Route>
            <Route exact path={`${process.env.PUBLIC_URL}/img-optimizers`} component={ImgOptimizers}></Route>
            <Route exact path={`${process.env.PUBLIC_URL}/ai-customer-service`} component={AiCustomerService}></Route>
            <Route exact path={`${process.env.PUBLIC_URL}/ai-account-manager`} component={AiAccountManager}></Route>
          {/* </>
        ) : (
          <> */}
            <Route exact path={`${process.env.PUBLIC_URL}/analytics`} component={Analytics}>
              {" "}
              <Redirect to={`${process.env.PUBLIC_URL}/account-overview`}></Redirect>
            </Route>
            <Route exact path={`${process.env.PUBLIC_URL}/optimizers`} component={Optimizers}>
              {" "}
              <Redirect to={`${process.env.PUBLIC_URL}/account-overview`}></Redirect>
            </Route>
            <Route exact path={`${process.env.PUBLIC_URL}/optimizers/optimizer1`} component={Optimizer1}>
              {" "}
              <Redirect to={`${process.env.PUBLIC_URL}/account-overview`}></Redirect>
            </Route>
            <Route exact path={`${process.env.PUBLIC_URL}/optimizers/optimizer2`} component={Optimizer2}>
              {" "}
              <Redirect to={`${process.env.PUBLIC_URL}/account-overview`}></Redirect>
            </Route>
            <Route exact path={`${process.env.PUBLIC_URL}/optimizers/optimizer3`} component={Optimizer3}>
              {" "}
              <Redirect to={`${process.env.PUBLIC_URL}/account-overview`}></Redirect>
            </Route>
            <Route exact path={`${process.env.PUBLIC_URL}/optimizers/optimizer4`} component={Optimizer4}>
              {" "}
              <Redirect to={`${process.env.PUBLIC_URL}/account-overview`}></Redirect>
            </Route>
            <Route exact path={`${process.env.PUBLIC_URL}/optimizers/optimizer5`} component={Optimizer5}>
              {" "}
              <Redirect to={`${process.env.PUBLIC_URL}/account-overview`}></Redirect>
            </Route>
            <Route exact path={`${process.env.PUBLIC_URL}/growth-opportunities`} component={GrowthOpportunities}>
              {" "}
              <Redirect to={`${process.env.PUBLIC_URL}/account-overview`}></Redirect>
            </Route>
            <Route exact path={`${process.env.PUBLIC_URL}/market-feedback`} component={MarketFeedback}>
              {" "}
              <Redirect to={`${process.env.PUBLIC_URL}/account-overview`}></Redirect>
            </Route>
            <Route exact path={`${process.env.PUBLIC_URL}/img-optimizers`} component={ImgOptimizers}>
              {" "}
            </Route>
            <Route exact path={`${process.env.PUBLIC_URL}/ai-customer-service`} component={AiCustomerService}>
              {" "}
            </Route>
            <Route exact path={`${process.env.PUBLIC_URL}/ai-coach`} component={AiAccountManager}>
              {" "}
              <Redirect to={`${process.env.PUBLIC_URL}/account-overview`}></Redirect>
            </Route>
          {/* </>
        )} */}

        <Route exact path={`${process.env.PUBLIC_URL}/_blank`} component={Blank}></Route>

        <Route exact path={`${process.env.PUBLIC_URL}/project-card`} component={ProjectCardPage}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/project-list`} component={ProjectListPage}></Route>
        <Route //Context Api added
          exact
          path={`${process.env.PUBLIC_URL}/user-list-regular`}
          render={() => (
            <UserContextProvider>
              <UserListRegularPage />
            </UserContextProvider>
          )}
        ></Route>
        <Route //Context Api added
          exact
          path={`${process.env.PUBLIC_URL}/user-list-compact`}
          render={() => (
            <UserContextProvider>
              <UserListCompact />
            </UserContextProvider>
          )}
        ></Route>
        <Route //Context Api added
          exact
          path={`${process.env.PUBLIC_URL}/user-details-regular/:id`}
          render={(props) => (
            <UserContextProvider>
              <UserDetailsPage {...props} />
            </UserContextProvider>
          )}
        ></Route>
        <Route
          exact
          path={`${process.env.PUBLIC_URL}/user-profile-notification/`}
          component={UserProfileLayout}
        ></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/user-profile-activity/`} component={UserProfileLayout}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/user-profile-setting/`} component={UserProfileLayout}></Route>
        <Route //Context api added
          exact
          path={`${process.env.PUBLIC_URL}/user-contact-card`}
          render={() => (
            <UserContextProvider>
              <UserContactCardPage />
            </UserContextProvider>
          )}
        ></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/kyc-list-regular`} component={KycListRegular}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/kyc-details-regular/:id`} component={KycDetailsRegular}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/transaction-basic`} component={TransListBasic}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/transaction-crypto`} component={TransListCrypto}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/product-list`} component={ProductList}></Route>

        <Route exact path={`${process.env.PUBLIC_URL}/invest`} component={Invest}></Route>

        {/*Demo Pages*/}


        <Route // context api added
          exact
          path={`${process.env.PUBLIC_URL}/product-card`}
          render={(props) => (
            <ProductContextProvider>
              <ProductCard />
            </ProductContextProvider>
          )}
        ></Route>
        <Route
          exact
          path={`${process.env.PUBLIC_URL}/product-details/:id`}
          render={(props) => (
            <ProductContextProvider>
              <ProductDetails {...props} />
            </ProductContextProvider>
          )}
        ></Route>
       

        {/*Application*/}
        <Route exact path={`${process.env.PUBLIC_URL}/app-calender`} component={Calender}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/app-kanban`} component={Kanban}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/app-inbox`} component={Inbox}></Route>

        <Route component={RedirectAs404}></Route>
      </Switch>
    </Suspense>
  );
};
export default Pages;
