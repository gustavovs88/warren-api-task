const PortfolioService = require("../services/portfolioService");

class PortfolioController {
  showPortfolios(req, res) {
    const customer = req.customer;

    const portfolios = customer.portfolios;

    if (!portfolios) res.sendStatus(500);
    res.json(portfolios);
  }

  showGoalReachedPortfolios(req, res) {
    const customer = req.customer;

    const goalReachedPortfolios =
      PortfolioService.filterGoalReachedPortfolios(customer);

    if (!goalReachedPortfolios) res.sendStatus(500);
    res.json(goalReachedPortfolios);
  }
}

module.exports = new PortfolioController();
