const CustomerRepository = require("../repositories/customerRepository");

class PortfolioService {
  filterGoalReachedPortfolios(customer) {
    const portfolios = customer.portfolios;
    const goalReachedPortfolios = portfolios.filter(
      (portfolio) => portfolio.amount >= portfolio.goalAmount
    );
    return goalReachedPortfolios;
  }

  async getTopAllocationAmountCustomers(page, pageSize) {
    const pageToNumber = Number(page);
    const pageSizeToNumber = Number(pageSize);

    const getTopAllocationAmountCustomers =
      await CustomerRepository.selectTopAllocationAmount(
        pageToNumber,
        pageSizeToNumber
      );

    const topAllocationAmountCustomers =
      getTopAllocationAmountCustomers[0].data;

    return topAllocationAmountCustomers;
  }
}

module.exports = new PortfolioService();
