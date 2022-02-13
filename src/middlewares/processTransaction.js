const CustomerRepository = require("../repositories/customerRepository");
const PortfolioRepository = require("../repositories/portfolioRepository");

const processTransaction = async (req, res, next) => {
  const customerId = req.header("customer-id");
  const { amount, type } = req.body;
  const { fromPortfolio } = req.query;
  let processStatus = null;

  if (type === "withdraw" || type === "account_transfer") {
    const customer = await CustomerRepository.selectById(customerId);
    const currentBalance = customer.balance;
    const newBalance = currentBalance - amount;
    newBalance <= 0
      ? (processStatus = "rejected")
      : (processStatus = "accepted");
  }

  if (type === "portfolio_transfer" || type === "portfolio_withdraw") {
    const portfolioId = fromPortfolio;
    const portfolio = await PortfolioRepository.selectById(portfolioId);
    const currentBalance = portfolio.amount;
    const newBalance = currentBalance - amount;
    newBalance <= 0
      ? (processStatus = "rejected")
      : (processStatus = "accepted");
  }

  if (!processStatus)
    return res.send("Transaction Process error").status(400).end();
  req.processStatus = processStatus;
  next();
};
module.exports = { processTransaction };
