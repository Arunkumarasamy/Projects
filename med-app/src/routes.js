import Dashboard from "views/dashboard";
import Tables from "views/tables";
import Billing from "views/billing";
import Notifications from "views/notifications";
import Profile from "views/profile";
import SignIn from "views/authentication/sign-in";
import SignUp from "views/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";
import Sales_entry from "views/daily_activity/sales_entry";
import MasterCategory from "views/master/category";
import Credit_Customer from "views/credit_customer";
import { LocalLibraryOutlined } from "@mui/icons-material";
import Expense_entry from "views/daily_activity/expense_entry";
import Subcategory from "views/master/subcategory";
import Category from "views/master/category";
import Unit from "views/master/units";
import Dashboard_super_admin from "super_admin/dashboard";
import Tenant from "super_admin/tanent_management";
import User from "super_admin/user_management";
import View_subcategory from "views/master/subcategory/component/view_subcategory";
import Bill_payments from "views/payments/bill_payment";
import Other_payments from "views/payments/other_payment";
import Vendor from "views/manage/vendor";
import Return_entry from "views/daily_activity/return_entry";
import Currency from "views/master/currency";
import Denomination from "views/master/denomination";
import Digital_money from "views/master/digital_money";
import Settelement_entry from "views/daily_activity/settelment";
import Sales from "views/manage/sales";
import Return from "views/manage/return";
import Settelement from "views/manage/settlement";
import Sales_summary from "views/manage/sales_summary";
import Customer_details from "views/credit_customer/customer_details";
import Credit_entry from "views/daily_activity/credit_entry";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  // this super Admin
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/super_admin",
    component: <Dashboard_super_admin />,
  },
  {
    type: "collapse",
    name: "Tenant management",
    key: "tenant",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/tenant",
    component: <Tenant />,
  },
  {
    type: "collapse",
    name: "User management",
    key: "user",
    icon: <Icon fontSize="small">manage_accounts</Icon>,
    route: "/user",
    component: <User />,
  },
  //----------
  {
    type: "collapse",
    name: "Daily Activity",
    key: "daily_activity",
    icon: <Icon fontSize="small">point_of_sale</Icon>,
    children: [
      {
        type: "collapse",
        name: "Sales",
        key: "sales_entry",
        route: "/sales_entry",
        component: <Sales_entry />,
        icon: <Icon fontSize="small">remove</Icon>,
      },
      {
        type: "collapse",
        name: "Return",
        key: "return_entry",
        route: "/return_entry",
        component: <Return_entry />,
        icon: <Icon fontSize="small">remove</Icon>,
      },
      {
        type: "collapse",
        name: "Expensive",
        key: "expensive_entry",
        route: "/expense_entry",
        component: <Other_payments />,
        icon: <Icon fontSize="small">remove</Icon>,
      },
      {
        type: "collapse",
        name: "Credit",
        key: "credit_entry",
        route: "/credit_entry",
        component: <Credit_entry />,
        icon: <Icon fontSize="small">remove</Icon>,
      },
      {
        type: "collapse",
        name: "Settlement",
        key: "settlement_entry",
        route: "/settlement_entry",
        icon: <Icon fontSize="small">remove</Icon>,
        component: <Settelement_entry />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Customer",
    key: "customer_management",
    icon: <Icon fontSize="small">manage_accounts</Icon>,
    children: [
      {
        type: "collapse",
        name: "Customer Details",
        key: "Customer",
        route: "/customer_details",
        component: <Customer_details />,
        icon: <Icon fontSize="small">remove</Icon>,
      },
      {
        type: "collapse",
        name: "Credit",
        key: "credit_customer",
        route: "/credit_customer",
        component: <Credit_Customer />,
        icon: <Icon fontSize="small">remove</Icon>,
      },
    ],
  },
  {
    type: "collapse",
    name: "Vendor",
    key: "vendor",
    icon: <Icon fontSize="small">manage_accounts</Icon>,
    children: [
      {
        type: "collapse",
        name: "Vendor",
        key: "vendor",
        route: "/vendor",
        component: <Vendor />,
        icon: <Icon fontSize="small">remove</Icon>,
      },
    ],
  },
  {
    type: "collapse",
    name: "Payments",
    key: "payments",
    icon: <Icon fontSize="small">payments</Icon>,
    children: [
      {
        type: "collapse",
        name: "Bill Payments",
        key: "bill_payments",
        route: "/bill_payments",
        component: <Bill_payments />,
        icon: <Icon fontSize="small">remove</Icon>,
      },
    ],
  },
  {
    type: "collapse",
    name: "Reports",
    key: "reports",
    icon: <Icon fontSize="small">assessment</Icon>,
    children: [
      {
        type: "collapse",
        name: "Sales Report",
        key: "sales_summary",
        route: "/sales_report",
        component: <Sales_summary />,
        icon: <Icon fontSize="small">remove</Icon>,
      },
      // {
      //   type: "collapse",
      //   name: "Settlement",
      //   key: "settlement",
      //   route: "/settlement",
      //   component: <Settelement />,
      //   icon: <Icon fontSize="small">remove</Icon>,
      // },
      // {
      //   type: "collapse",
      //   name: "Sales",
      //   key: "sales",
      //   route: "/sales",
      //   component: <Sales />,
      //   icon: <Icon fontSize="small">remove</Icon>,
      // },
      {
        type: "collapse",
        name: "Return",
        key: "return",
        route: "/return",
        component: <Return />,
        icon: <Icon fontSize="small">remove</Icon>,
      },
      {
        type: "collapse",
        name: "Expense ",
        key: "expense",
        route: "/expense",
        component: <Bill_payments />,
        icon: <Icon fontSize="small">remove</Icon>,
      },
      {
        type: "collapse",
        name: "Bill",
        key: "bill",
        route: "/bill",
        component: <Bill_payments />,
        icon: <Icon fontSize="small">remove</Icon>,
      },
      {
        type: "collapse",
        name: "Credit",
        key: "credit",
        route: "/credit",
        component: <Credit_Customer />,
        icon: <Icon fontSize="small">remove</Icon>,
      },
    ],
  },
  {
    type: "collapse",
    name: "Master Setting",
    key: "master_setting",
    icon: <Icon fontSize="small">settings</Icon>,
    children: [
      {
        type: "collapse",
        name: "Category",
        key: "category",
        route: "/category",
        component: <Category />,
        icon: <Icon fontSize="small">remove</Icon>,
      },
      {
        type: "collapse",
        name: "Subcategory",
        key: "subcategory",
        route: "/subcategory",
        component: <Subcategory />,
        icon: <Icon fontSize="small">remove</Icon>,
      },
      {
        type: "collapse",
        name: "Units",
        key: "units",
        route: "/units",
        component: <Unit />,
        icon: <Icon fontSize="small">remove</Icon>,
      },
      {
        type: "collapse",
        name: "Currency",
        key: "currency",
        route: "/currency",
        component: <Currency />,
        icon: <Icon fontSize="small">remove</Icon>,
      },
      {
        type: "collapse",
        name: "Denomination",
        key: "denomination",
        route: "/denomination",
        component: <Denomination />,
        icon: <Icon fontSize="small">remove</Icon>,
      },
      {
        type: "collapse",
        name: "Digital Money",
        key: "digital_money",
        route: "/digital_money",
        component: <Digital_money />,
        icon: <Icon fontSize="small">remove</Icon>,
      },
    ],
  },
];

export default routes;
