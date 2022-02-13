const routes = require("express").Router();
const PortfolioController = require("../controllers/portfolioController");
const TransactionController = require("../controllers/transactionController");
const AdminController = require("../controllers/adminController");
const { getCustomer } = require("../middlewares/getCustomer");
const { processTransaction } = require("../middlewares/processTransaction");

// Portfolios Routes
routes.get(
  "/portfolios/goalReached",
  getCustomer,
  PortfolioController.showGoalReachedPortfolios
);

routes.get("/portfolios/:id", getCustomer, PortfolioController.showPortfolios);

// Transactions Routes
routes.get(
  "/transactions/deposits",
  getCustomer,
  TransactionController.showDeposits
);

routes.post(
  "/transactions/deposit",
  getCustomer,
  TransactionController.createDeposit
);

routes.post(
  "/transactions/account-transfer/:customerId",
  getCustomer,
  processTransaction,
  TransactionController.createAccountTransfer
);

routes.post(
  "/transactions/portfolio-transfer",
  getCustomer,
  processTransaction,
  TransactionController.createPortfolioTransfer
);

// Admin Routes
routes.get(
  "/admin/topAllocationAmount",
  getCustomer,
  AdminController.showtopAllocationAmount
);

routes.get(
  "/admin/topCashChurn",
  getCustomer,
  AdminController.showtopCashChurn
);

module.exports = routes;
