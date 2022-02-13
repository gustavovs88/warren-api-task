const TransactionService = require("../services/transactionService");

class AdminConttroler {
  async showtopAllocationAmount(req, res) {
    const { page, pageSize } = req.query;

    const topAllocationAmountCustomers =
      await PortfolioService.getTopAllocationAmountCustomers(page, pageSize);

    if (!topAllocationAmountCustomers) res.sendStatus(500);
    res.json(topAllocationAmountCustomers);
  }

  async showtopCashChurn(req, res) {
    const { page, pageSize, start, end } = req.query;

    const topCashChurn = await TransactionService.getTopCashChurn(
      page,
      pageSize,
      start,
      end
    );

    if (!topCashChurn) res.sendStatus(500);
    res.json(topCashChurn);
  }
}

module.exports = new AdminConttroler();
