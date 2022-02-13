const PortfolioRepository = require("../repositories/portfolioRepository");

const updatePortfolioBalance = async (transaction) => {
  const { _customer, type, fromPortfolio, toPortfolio, amount } = transaction;
  const senderPortfolio = await PortfolioRepository.selectById(fromPortfolio);
  const receiverPortfolio =
    (await PortfolioRepository.selectById(toPortfolio)) || {};
  let fromPortfolioNewBalance;
  let fromPortfoUpdatedBalance;
  let toPortfolioNewBalance;
  let toPortfolioUpdatedBalance;

  const fromPortfolioCurrentBalance = senderPortfolio.amount;
  const toPortfolioCurrentBalance = receiverPortfolio.amount;
  switch (type) {
    case "portfolio_transfer":
      fromPortfolioNewBalance = fromPortfolioCurrentBalance - amount;
      fromPortfoUpdatedBalance = await PortfolioRepository.updateBalance(
        _customer,
        fromPortfolio,
        fromPortfolioNewBalance
      );
      toPortfolioNewBalance = toPortfolioCurrentBalance + amount;
      toPortfolioUpdatedBalance = await PortfolioRepository.updateBalance(
        _customer,
        toPortfolio,
        toPortfolioNewBalance
      );
      return fromPortfoUpdatedBalance;
  }
};

module.exports = { updatePortfolioBalance };
