import User from "../../../images/avatar/b-sm.jpg";
import User2 from "../../../images/avatar/c-sm.jpg";
import User3 from "../../../images/avatar/a-sm.jpg";
import User4 from "../../../images/avatar/d-sm.jpg";
import React from "react";
import { UserAvatar, Icon } from "../../../components/Component";
import { findUpper } from "../../../utils/Utils";

export const basicData = {
  header: ["#", "First", "Last"],
  data: [
    {
      id: "1",
      first: "Mark",
      last: "Otto",
    },
    {
      id: "2",
      first: "Jacob",
      last: "Thornton",
    },
    {
      id: "3",
      first: "Larry",
      last: "the bird",
    },
  ],
};

export const dataTableColumns = [
  {
    name: "Title",
    selector: (row) => row.name,
    sortable: true,
    maxWidth:"550px",

  },
  {
    name: "ASIN",
    selector: (row) => row.asin,
    sortable: true,
    hide: 370,
    maxWidth:"140px",

  },
  {
    name: "Marketplace",
    selector: (row) => row.marketplace,
    sortable: true,
    hide: "sm",
    maxWidth:"130px",
  },
  {
    name: "Leaf node",
    selector: (row) => row.leaf_node,
    sortable: true,
    hide: "sm",
    maxWidth:"120px",

  },
  {
    name: "Keywords",
    selector: (row) => row.keywords,
    sortable: true,
    hide: "md",
    maxWidth:"120px",

  },
  {
    name: "Indexed",
    selector: (row) => row.indexed,
    sortable: true,
    hide: "md",
    maxWidth:"110px",

  },
  {
    name: "Active offer",
    selector: (row) => row.active_offer,
    sortable: true,
    hide: "md",
    maxWidth:"130px",

  },

  {
    name: "Title starts with brand",
    selector: (row) => row.title_start,
    sortable: true,
    hide: "md",
    cell: (row) => (
      <span className={`go-${
        row.title_start === 1 ? "success" : row.title_start === 0 ? "warning" : "danger"
      }`}>
        <Icon name="circle-fill"/> </span>
    ),
    maxWidth:"130px",

  },
  {
    name: "Has keywords",
    selector: (row) => row.has_keywords,
    sortable: true,
    hide: "md",
    cell: (row) => (
      <span className={`go-${
        row.has_keywords === 1 ? "success" : row.has_keywords === 0 ? "warning" : "danger"
      }`}>
        <Icon name="circle-fill"/> </span>
    ),
    maxWidth:"130px",

  },
  {
    name: "Has A+",
    selector: (row) => row.has_aplus,
    sortable: true,
    hide: "md",
    cell: (row) => (
      <span className={`go-${
        row.has_aplus === 1 ? "success" : row.has_aplus === 0 ? "warning" : "danger"
      }`}>
        <Icon name="circle-fill"/> </span>
    ),
    maxWidth:"130px",

  },
  {
    name: "Main image zoom",
    selector: (row) => row.image_zoom,
    sortable: true,
    hide: "md",
    cell: (row) => (
      <span className={`go-${
        row.image_zoom === 1 ? "success" : row.image_zoom === 0 ? "warning" : "danger"
      }`}>
        <Icon name="circle-fill"/> </span>
    ),
    maxWidth:"130px",

  },
];

export const dataTableColumns2 = [
  {
    name: "User",
    selector: (row) => row.name,
    compact: true,
    grow: 2,
    style: { paddingRight: "20px" },
    cell: (row) => (
      <div className="user-card mt-2 mb-2">
        <UserAvatar theme={row.avatarBg} text={findUpper(row.name)} image={row.image}></UserAvatar>
        <div className="user-info">
          <span className="tb-lead">
            {row.name}{" "}
            <span
              className={`dot dot-${
                row.status === "Active" ? "success" : row.status === "Pending" ? "warning" : "danger"
              } d-md-none ml-1`}
            ></span>
          </span>
          <span>{row.email}</span>
        </div>
      </div>
    ),
    sortable: true,
  },
  {
    name: "Balance",
    selector: (row) => row.balance,
    minWidth: "140px",
    cell: (row) => (
      <span className="tb-amount">
        {row.balance} <span className="currency">USD</span>
      </span>
    ),
    sortable: true,
    hide: 480,
  },
  {
    name: "Phone",
    selector: (row) => row.phone,
    sortable: true,
    cell: (row) => <span>{row.phone}</span>,
    hide: "md",
  },
  {
    name: "Verified",
    selector: (row) => row.verified,
    sortable: true,
    minWidth: "170px",
    hide: "md",
    cell: (row) => (
      <ul className="list-status d-flex">
        <li>
          <Icon
            className={`text-${
              row.emailStatus === "success" ? "success" : row.emailStatus === "pending" ? "info" : "secondary"
            }`}
            name={`${
              row.emailStatus === "success"
                ? "check-circle"
                : row.emailStatus === "alert"
                ? "alert-circle"
                : "alarm-alt"
            }`}
          ></Icon>{" "}
          <span>Email</span>
        </li>
        <li>
          <Icon
            className={`text-${
              row.kycStatus === "success"
                ? "success"
                : row.kycStatus === "pending"
                ? "info"
                : row.kycStatus === "warning"
                ? "warning"
                : "secondary"
            }`}
            name={`${
              row.kycStatus === "success" ? "check-circle" : row.kycStatus === "pending" ? "alarm-alt" : "alert-circle"
            }`}
          ></Icon>{" "}
          <span>KYC</span>
        </li>
      </ul>
    ),
  },
  {
    name: "Last Login",
    selector: (row) => row.lastLogin,
    sortable: true,
    cell: (row) => <span>{row.lastLogin}</span>,
    hide: "lg",
  },
  {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
    hide: "sm",
    cell: (row) => (
      <span
        className={`tb-status ml-1 text-${
          row.status === "Active" ? "success" : row.status === "Pending" ? "warning" : "danger"
        }`}
      >
        {row.status}
      </span>
    ),
  },
];

export const DataTableData = [
  {
    id: 0,
    name: " Brita Standard Water Filter Replacements for Pitchers and Dispensers, Lasts 2 Months, Reduces Chlorine Taste and Odor, 3 Count ",
    asin: "B00004SU19",
    marketplace: "UK",
    leaf_node: "A",
    keywords: "A",
    indexed: "95%",
    active_offer: "90%",
    title_start: 1,
    has_keywords: 1,
    has_aplus: 1,
    image_zoom: 1,

  },
  {
    id: 1,
    name: "Reva Best",
    asin: "B00004SU18",
    marketplace: "UK",
    leaf_node: "A",
    keywords: "A",
    indexed: "98%",
    active_offer: "88%",
    title_start: 0,
    has_keywords: 1,
    has_aplus: 1,
    image_zoom: 0,

  },
  {
    id: 2,
    name: "Alexis Flores",
    asin: "B00004SU18",
    marketplace: "UK",
    leaf_node: "B",
    keywords: "A",
    indexed: "100%",
    active_offer: "85%",
    title_start: 1,
    has_keywords: 0,
    has_aplus: 1,
    image_zoom: 1,

  },
  {
    id: 3,
    name: "Nixon Sullivan",
    asin: "B00004SU18",
    marketplace: "UK",
    leaf_node: "A",
    keywords: "A",
    indexed: "97%",
    active_offer: "77%",
    title_start: 1,
    has_keywords: 1,
    has_aplus: 0,
    image_zoom: 1,
  },
  {
    id: 4,
    name: "Foreman Wooten",
    asin: "B00004SU18",
    marketplace: "UK",
    leaf_node: "C",
    keywords: "A",
    indexed: "95%",
    active_offer: "84%",
    title_start: 0,
    has_keywords: 1,
    has_aplus: 1,
    image_zoom: 0,
  },
  {
    id: 5,
    name: "Franco Davis",
    asin: "B00004SU18",
    marketplace: "UK",
    leaf_node: "A",
    keywords: "A",
    indexed: "85%",
    active_offer: "95%",
    title_start: 1,
    has_keywords: 1,
    has_aplus: 1,
    image_zoom: 1,
  },
  {
    id: 6,
    name: "Bullock Kline",
    asin: "B00004SU18",
    marketplace: "UK",
    leaf_node: "B",
    keywords: "A",
    indexed: "95%",
    active_offer: "55%",
    title_start: 0,
    has_keywords: 1,
    has_aplus: 1,
    image_zoom: 0,
  },
  {
    id: 7,
    name: "Baird Coffey",
    asin: "B00004SU18",
    marketplace: "UK",
    leaf_node: "B",
    keywords: "A",
    indexed: "100%",
    active_offer: "95%",
    title_start: 0,
    has_keywords: 0,
    has_aplus: 1,
    image_zoom: 1,
  },
  {
    id: 8,
    name: "Eula Walters",
    asin: "B00004SU18",
    marketplace: "UK",
    leaf_node: "A",
    keywords: "A",
    indexed: "95%",
    active_offer: "83%",
    title_start: 1,
    has_keywords: 1,
    has_aplus: 0,
    image_zoom: 1,
  },
  {
    id: 9,
    name: "Gaines Moss",
    asin: "B00004SU18",
    marketplace: "UK",
    leaf_node: "A",
    keywords: "A",
    indexed: "90%",
    active_offer: "85%",
    title_start: 1,
    has_keywords: 1,
    has_aplus: 1,
    image_zoom: 0,
  },
  {
    id: 10,
    name: "Sargent Winters",
    asin: "B00004SU18",
    marketplace: "UK",
    leaf_node: "A",
    keywords: "A",
    indexed: "95%",
    active_offer: "85%",
    title_start: 0,
    has_keywords: 1,
    has_aplus: 0,
    image_zoom: 1,
  },
];

export const userData = [
  {
    id: 1,
    avatarBg: "purple",
    name: "Marcello Di Pierro",
    displayName: "Ishtiak",
    dob: "10 Aug, 1980",
    role: "Customer",
    checked: false,
    email: "info@StormX.com",
    balance: "35,040.34",
    phone: "818474958",
    emailStatus: "success",
    kycStatus: "success",
    lastLogin: "10 Feb 2020",
    status: "Active",
    address: "2337 Kildeer Drive",
    state: "Kentucky",
    country: "Canada",
    designation: "UI/UX Designer",
    projects: "213",
    performed: "87.5",
    tasks: "587",
  },
  {
    id: 2,
    avatarBg: "purple",
    image: User3,
    name: "Ashley Lawson",
    dob: "10 Sept, 1990",
    role: "Investor",
    email: "ashley@StormX.com",
    balance: "580.00",
    checked: false,
    phone: "1243941787",
    emailStatus: "success",
    kycStatus: "pending",
    lastLogin: "07 Feb 2020",
    status: "Pending",
    country: "United States",
    designation: "UI/UX Designer",
    projects: "213",
    performed: "87.5",
    tasks: "587",
  },
  {
    id: 3,
    avatarBg: "info",
    name: "Joe Larson",
    dob: "19 Jan, 1985",
    role: "Customer",
    email: "larson@example.com",
    balance: "32,000.34",
    checked: false,
    phone: "1686032320",
    emailStatus: "success",
    kycStatus: "success",
    lastLogin: "04 Feb 2020",
    status: "Active",
    country: "England",
    designation: "UI/UX Designer",
    projects: "213",
    performed: "87.5",
    tasks: "587",
  },
  {
    id: 4,
    avatarBg: "danger",
    name: "Jane Montgomery",
    dob: "24 April, 1985",
    role: "Subscriber",
    email: "jane84@example.com",
    balance: "0.00",
    checked: false,
    phone: "4392715360",
    emailStatus: "alert",
    kycStatus: "alert",
    lastLogin: "01 Feb 2020",
    status: "Suspend",
    country: "United States",
    designation: "UI/UX Designer",
    projects: "213",
    performed: "87.5",
    tasks: "587",
  },
  {
    id: 5,
    avatarBg: "purple",
    name: "Frances Burns",
    dob: "30 May, 2000",
    role: "Manasinr",
    image: User,
    email: "frances@example.com",
    balance: "42.50",
    checked: false,
    phone: "6391303150",
    emailStatus: "pending",
    kycStatus: "error",
    lastLogin: "31 Jan 2020",
    status: "Active",
    country: "Bangladesh",
    designation: "UI/UX Designer",
    projects: "213",
    performed: "87.5",
    tasks: "587",
  },
  {
    id: 6,
    avatarBg: "primary",
    name: "Alan Butler",
    dob: "10 Feb, 1997",
    role: "Investor",
    image: User2,
    email: "butler@example.com",
    balance: "440.34",
    checked: false,
    phone: "9633091706",
    emailStatus: "pending",
    kycStatus: "warning",
    lastLogin: "18 Jan 2020",
    status: "Inactive",
    country: "India",
    designation: "UI/UX Designer",
    projects: "213",
    performed: "87.5",
    tasks: "587",
  },
  {
    id: 7,
    avatarBg: "warning",
    name: "Victoria Lynch",
    dob: "02 May, 1993",
    role: "Investor",
    email: "victoria@example.com",
    balance: "59,400.68",
    checked: false,
    phone: "8119854846",
    emailStatus: "success",
    kycStatus: "success",
    lastLogin: "15 Jan 2020",
    status: "Active",
    country: "China",
    designation: "UI/UX Designer",
    projects: "213",
    performed: "87.5",
    tasks: "587",
  },
  {
    id: 8,
    avatarBg: "success",
    name: "Patrick Newman",
    dob: "15 Feb, 1997",
    role: "Customer",
    email: "patrick@example.com",
    balance: "30.00",
    checked: false,
    phone: "9422384474",
    emailStatus: "success",
    kycStatus: "pending",
    lastLogin: "08 Jan 2020",
    status: "Active",
    country: "India",
    designation: "UI/UX Designer",
    projects: "213",
    performed: "87.5",
    tasks: "587",
  },
  {
    id: 9,
    avatarBg: "purple",
    name: "Jane Harris",
    dob: "28 Feb, 1985",
    role: "Customer",
    image: User4,
    email: "harris@example.com",
    balance: "5,530.23",
    checked: false,
    phone: "1234472384",
    emailStatus: "pending",
    kycStatus: "pending",
    lastLogin: "02 Jan 2020",
    status: "Pending",
    country: "Vietnam",
    designation: "UI/UX Designer",
    projects: "213",
    performed: "87.5",
    tasks: "587",
  },
  {
    id: 10,
    avatarBg: "purple",
    name: "Emma Walker",
    dob: "30 Dec, 1998",
    role: "Investor",
    email: "walker@example.com",
    balance: "55.00",
    checked: false,
    phone: "4634717173",
    emailStatus: "success",
    kycStatus: "success",
    lastLogin: "25 Dec 2019",
    status: "Active",
    country: "United States",
    designation: "UI/UX Designer",
    projects: "213",
    performed: "87.5",
    tasks: "587",
  },
  {
    id: 11,
    avatarBg: "pink",
    name: "Lilja Peltola",
    dob: "30 Dec, 1998",
    role: "Investor",
    email: "lilja@example.com",
    balance: "105.00",
    checked: false,
    phone: "4634717173",
    emailStatus: "success",
    kycStatus: "pending",
    lastLogin: "25 Dec 2019",
    status: "Active",
    country: "Canada",
    designation: "Web Developer",
    projects: "213",
    performed: "87.5",
    tasks: "587",
  },
  {
    id: 12,
    avatarBg: "secondary",
    name: "Annette Hunter",
    dob: "30 Dec, 1998",
    role: "Investor",
    email: "hunter@example.com",
    balance: "55.00",
    checked: false,
    phone: "4634717173",
    emailStatus: "success",
    kycStatus: "success",
    lastLogin: "25 Dec 2019",
    status: "Pending",
    country: "United States",
    designation: "UI/UX Designer",
    projects: "213",
    performed: "87.5",
    tasks: "587",
  },
  {
    id: 13,
    avatarBg: "pink",
    name: "Sara Koivisto",
    dob: "30 Dec, 1998",
    role: "Customer",
    email: "sara@example.com",
    balance: "165.00",
    checked: false,
    phone: "4634717173",
    emailStatus: "rejected",
    kycStatus: "pending",
    lastLogin: "25 Dec 2019",
    status: "Active",
    country: "Russia",
    designation: "Web Developer",
    projects: "213",
    performed: "87.5",
    tasks: "587",
  },
  {
    id: 14,
    avatarBg: "blue",
    name: "Kianna Pham",
    dob: "30 Dec, 1998",
    role: "Admin",
    email: "kiana@example.com",
    balance: "55.00",
    checked: false,
    phone: "4634717173",
    emailStatus: "success",
    kycStatus: "rejected",
    lastLogin: "25 Dec 2019",
    status: "Suspend",
    country: "South Korea",
    designation: "Accountant",
    projects: "213",
    performed: "87.5",
    tasks: "587",
  },
  {
    id: 15,
    avatarBg: "pink",
    name: "Raymond Atkins",
    dob: "30 Dec, 1998",
    role: "Customer",
    image: User4,
    email: "sara@example.com",
    balance: "165.00",
    checked: false,
    phone: "4634717173",
    emailStatus: "rejected",
    kycStatus: "pending",
    lastLogin: "25 Dec 2019",
    status: "Active",
    country: "Russia",
    designation: "Web Developer",
    projects: "213",
    performed: "87.5",
    tasks: "587",
  },
  {
    id: 16,
    avatarBg: "blue",
    name: "Amira Talley",
    dob: "30 Dec, 1998",
    role: "Admin",
    email: "amira@example.com",
    balance: "55.00",
    checked: false,
    phone: "4634717173",
    emailStatus: "pending",
    kycStatus: "rejected",
    lastLogin: "25 Dec 2019",
    status: "Active",
    country: "Saudi Arabia",
    designation: "Lecturer",
    projects: "213",
    performed: "87.5",
    tasks: "587",
  },
  {
    id: 17,
    avatarBg: "secondary",
    name: "Lana Steiner",
    dob: "30 Dec, 1998",
    role: "Admin",
    email: "steinar@example.com",
    balance: "55.00",
    checked: false,
    phone: "4634717173",
    emailStatus: "pending",
    kycStatus: "rejected",
    lastLogin: "25 Dec 2019",
    status: "Pending",
    country: "Latvia",
    designation: "Accountant",
    projects: "213",
    performed: "87.5",
    tasks: "587",
  },
  {
    id: 18,
    avatarBg: "warning",
    name: "Joshua Mcnair",
    dob: "30 Dec, 1998",
    image: User4,
    role: "Admin",
    email: "joshua@example.com",
    balance: "55.00",
    checked: false,
    phone: "4634717173",
    emailStatus: "pending",
    kycStatus: "rejected",
    lastLogin: "25 Dec 2019",
    status: "Suspend",
    country: "Ireland",
    designation: "Web Developer",
    projects: "213",
    performed: "87.5",
    tasks: "587",
  },
  {
    id: 19,
    avatarBg: "secondary",
    name: "Asiya Wolff",
    dob: "30 Dec, 1998",
    role: "Customer",
    email: "asia@example.com",
    balance: "55.00",
    checked: false,
    phone: "4634717173",
    emailStatus: "success",
    kycStatus: "success",
    lastLogin: "25 Dec 2019",
    status: "Active",
    country: "Latvia",
    designation: "Accountant",
    projects: "213",
    performed: "87.5",
    tasks: "587",
  },
  {
    id: 20,
    avatarBg: "warning",
    name: "Fox Mccloud",
    dob: "30 Dec, 1998",
    role: "Admin",
    email: "fox@example.com",
    balance: "55.00",
    checked: false,
    phone: "4634717173",
    emailStatus: "pending",
    kycStatus: "rejected",
    lastLogin: "25 Dec 2019",
    status: "Suspend",
    country: "Ireland",
    designation: "Web Developer",
    projects: "213",
    performed: "87.5",
    tasks: "587",
  },
];
