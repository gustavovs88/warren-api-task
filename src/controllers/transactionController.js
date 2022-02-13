const TransactionService = require("../services/transactionService");

class TransactionController {
  async showCustomerTransactions(req, res) {
    const customerId = req.header("customer-id");

    const customerTransactions =
      await TransactionRepository.selectCostumerTransactions(customerId);

    if (!customerTransactions) return res.sendStatus(400);
    res.json(customerTransactions);
  }

  async showDeposits(req, res) {
    const customerId = req.header("customer-id");
    const { status, start, end } = req.query;

    const deposits = await TransactionService.filterDepositsByStatusAndDate(
      customerId,
      status,
      start,
      end
    );

    if (!deposits) res.sendStatus(500);
    res.json(deposits);
  }

  async createDeposit(req, res) {
    const deposit = req.body;
    deposit.status = "accepted";
    const customerId = req.header("customer-id");

    const depositData = await TransactionService.makeDeposit(
      deposit,
      customerId
    );

    if (!depositData) res.sendStatus(500);
    res.sendStatus(201);
  }

  async createAccountTransfer(req, res) {
    const transfer = req.body;
    const transferStatus = req.processStatus;
    const transferReceiverId = req.params.customerId;
    const customerId = req.header("customer-id");

    const transferData = await TransactionService.makeAccountTransfer(
      transfer,
      customerId,
      transferReceiverId,
      transferStatus
    );

    if (transferStatus === "rejected")
      res.send("Saldo insuficiente").sendStatus(201);
    if (!transferData) res.sendStatus(500);
    res.sendStatus(201);
  }

  async createPortfolioTransfer(req, res) {
    const transfer = req.body;
    const transferStatus = req.processStatus;
    const fromPortfolio = req.query.fromPortfolio;
    const toPortfolio = req.query.toPortfolio;
    const customerId = req.header("customer-id");

    const transferData = await TransactionService.makePortfolioTransfer(
      transfer,
      customerId,
      fromPortfolio,
      toPortfolio,
      transferStatus
    );
    console.log(transferData);
    if (transferStatus === "rejected")
      res.send("Saldo insuficiente").sendStatus(201);
    if (!transferData) res.sendStatus(500);
    res.sendStatus(201);
  }
}

module.exports = new TransactionController();
