const e = require("express");
const TransactionRepository = require("../repositories/transactionRepository");
const { updateCustomerBalance } = require("./updateCustomerBalance");
const { updatePortfolioBalance } = require("./updatePortfolioBalance");

class TransactionService {
  async filterDepositsByStatusAndDate(customerId, status, start, end) {
    const startDatetoISO = new Date(start).toISOString();
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59);
    const endDatetoISO = endDate.toISOString();

    const customerDepositsByDate =
      await TransactionRepository.selectDepositsByStatusAndDate(
        customerId,
        status,
        startDatetoISO,
        endDatetoISO
      );

    return customerDepositsByDate;
  }

  async makeDeposit(transaction, customerId) {
    const { status } = transaction;
    transaction._customer = customerId;
    const transactionData = await TransactionRepository.insertTransaction(
      transaction
    );
    if (!transactionData) return null;
    if (status === "accepted") return updateCustomerBalance(transaction);
    return transactionData;
  }

  async makeAccountTransfer(
    transaction,
    customerId,
    receiverId,
    transferStatus
  ) {
    transaction.status = transferStatus;
    transaction.toCustomer = receiverId;
    transaction._customer = customerId;
    const transactionData = await TransactionRepository.insertTransaction(
      transaction
    );
    if (!transactionData) return null;
    if (transferStatus === "accepted")
      return updateCustomerBalance(transaction);
    return transactionData;
  }

  async makePortfolioTransfer(
    transaction,
    customerId,
    fromPortfolio,
    toPortfolio,
    transferStatus
  ) {
    transaction.status = transferStatus;
    transaction.fromPortfolio = fromPortfolio;
    transaction.toPortfolio = toPortfolio;
    transaction._customer = customerId;
    const transactionData = await TransactionRepository.insertTransaction(
      transaction
    );
    if (!transactionData) return null;
    if (transferStatus === "accepted")
      return updatePortfolioBalance(transaction);
    return transactionData;
  }

  async getTopCashChurn(page, pageSize, start, end) {
    const startDatetoISO = new Date(start).toISOString();
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59);
    const endDatetoISO = endDate.toISOString();
    const pageToNumber = Number(page);
    const pageSizeToNumber = Number(pageSize);

    const gettopCashChurn = await TransactionRepository.selectTopCashChurn(
      pageToNumber,
      pageSizeToNumber,
      startDatetoISO,
      endDatetoISO
    );
    console.log(gettopCashChurn);
    const topCashChurn = gettopCashChurn[0].data;

    return topCashChurn;
  }
}

module.exports = new TransactionService();
