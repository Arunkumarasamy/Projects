let Url = {
  // api: "http://192.168.0.116/med_app/",
  api: "http://192.168.0.118/med_app/",
  // api: "http://medapp.hermonsolutions.com/api/",
  // api: "https://28df-2406-7400-bb-5540-3096-c845-8030-dea2.ngrok-free.app/med_app/",
  /* Super Admin */
  login: "login",

  tenantList: "tenant/list",
  tenantCreate: "tenant/create",
  tenantEdit: "tenant/update",
  tenantDelete: "tenant/delete/",
  tenantView: "tenant/get/",

  imgUpload: "fileuploader/avatarUpdate", //----avatarInsert
  showImg: "uploads/avatars/",

  userList: "user/list",
  userCreate: "user/create",
  userEdit: "user/update",
  userDelete: "user/delete/",
  userTenantDropDown: "user/tenantdrop",

  /* --------user----------- */

  /* forgot pass */
  forgotPass: "user/forgotPassword",
  resetPass: "user/resetpassword/",
  tokenValidate: "user/checktokenpassword/",

  userLogin: "login",
  userLogOut: "logout",

  // expenseEntry

  // other
  expenseOtherList: "expense/list/other",
  expenseOtherCreate: "expense/create/other",
  expenseOtherEdit: "expense/update/other",
  expenseOtherDelete: "expense/delete/other/",

  vendorNameDropDown: "expense/vendor",
  // bill
  expenseBillList: "expense/list/bill",
  expenseBillCreate: "expense/create/bill",
  expenseBillEdit: "expense/update/bill",
  expenseBillView: "expense/getbill/",
  expenseBillDelete: "expense/delete/bill/",

  // unit
  unitList: "unit/list",
  unitCreate: "unit/create",
  unitEdit: "unit/update",
  unitDelete: "unit/delete/",

  // category
  categoryList: "category/list",
  categoryCreate: "category/create",
  categoryEdit: "category/update",
  categoryDelete: "category/delete/",

  // subCategory
  subCategoryList: "subcategory/list",
  subCategoryCreate: "subcategory/create",
  subCategoryEdit: "subcategory/update",
  subCategoryView: "subcategory/get/",
  subCategoryDelete: "subcategory/delete/",

  // vendor
  vendorList: "vendor/list",
  vendorCreate: "vendor/create",
  vendorEdit: "vendor/update",
  vendorDelete: "vendor/delete/",
  vendorView: "vendor/get/",

  // return entry
  // returnList: "return/list",
  returnCreate: "return/create",
  returnEdit: "return/update",
  returnDelete: "return/delete/",

  // settlement entry
  settlementList: "settlement/list",
  settlementCreate: "settlement/create",
  settlementEdit: "settlement/update",
  settlementDelete: "settlement/delete/",

  // currency
  currencyList: "currency/list",
  currencyCreate: "currency/create",
  currencyEdit: "currency/update",
  currencyDelete: "currency/delete/",

  countryDD: "/currency/country",

  // denomination
  denominationList: "denomination/list",
  denominationCreate: "denomination/create",
  denominationEdit: "denomination/update",
  denominationDelete: "denomination/delete/",
  denominationView: "denomination/get/",

  // digital money
  digitalList: "digitalmoney/list",
  digitalCreate: "digitalmoney/create",
  digitalEdit: "digitalmoney/update",
  digitalDelete: "digitalmoney/delete/",

  digitalMoneyImg: "fileuploader/iconInsert",

  // sales entry
  salesCreate: "salesentry/create",
  salesEdit: "salesentry/update",
  salesDelete: "salesentry/delete/",
  salesView: "salesentry/get/",

  prescriptionFile: "fileuploader/prescriptionInsert",

  // settlement
  settlementList: "settlement/list",
  settlementCreate: "settlement/create",
  settlementEdit: "settlement/update",
  settlementDelete: "settlement/delete/",
  settlementView: "settlement/get/",

  // overAll list
  overAllSales: "common/saleslist",
  overAllSettlement: "common/settlementlist",
  overAllReturn: "common/returnlist",
  overAllCreadit: "common/customerlist",

  salesSummary: "common/filterdata",
  salesSummaryView: "common/dateamountsummary",
  salesSummarySalesList: "common/saleslist",

  // credit
  creditList: "customercredit/list",
  creditCreate: "customercredit/create",
  creditView: "customercredit/get/",
  customerList: "common/customerlist",

  // current date list
  currentSaleList: "salesentry/list",
  currentReturnList: "return/list/Currentreturn",
  currentExpenseList: "",
  currentCreditList: "customercredit/CurrentCreditlist",
};
export default Url;
