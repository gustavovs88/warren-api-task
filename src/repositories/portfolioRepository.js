const Customer = require("../models/Customer");

class PortfolioRepository {
  async selectById(portfolioId) {
    try {
      const portfolio = await Customer.findOne(
        { "portfolios._id": portfolioId },
        { "portfolios.$": 1 }
      );
      console.log(portfolio.portfolios[0]);
      return portfolio.portfolios[0];
    } catch (error) {
      console.log("Database error on finding portfolio by ID", error);
      return null;
    }
  }

  async updateBalance(customerId, portfolioId, amount) {
    try {
      const updatedBalance = await Customer.findOneAndUpdate(
        { _customer: customerId, "portfolios._id": portfolioId },
        { $set: { "portfolios.$.amount": amount } }
      );
      console.log(updatedBalance);
      return customerId;
    } catch (error) {
      console.log("Error on updating customer balance", error);
      return null;
    }
  }
}

module.exports = new PortfolioRepository();
