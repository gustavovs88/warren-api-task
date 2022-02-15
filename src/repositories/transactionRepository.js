const Transaction = require("../models/Transaction");

class TransactionRepository {
  async selectCostumerTransactions(customerId) {
    try {
      const customerTransactions = await Transaction.find({
        _customer: customerId,
      });
      return customerTransactions;
    } catch (error) {
      console.log("Database error on finding customer transactions", error);
      return null;
    }
  }

  async selectDepositsByStatusAndDate(customerId, status, start, end) {
    try {
      const depositsByStatusAndDate = await Transaction.find({
        _customer: customerId,
        type: "deposit",
        status: status,
        updatedAt: { $gte: start, $lte: end },
      });
      return depositsByStatusAndDate;
    } catch (error) {
      console.log("Database error on finding customer deposits", error);
      return null;
    }
  }
  async insertTransaction(transaction) {
    try {
      const createdTransaction = await Transaction.create(transaction);
      return createdTransaction;
    } catch (error) {
      console.log("Error on creating a transaction document", error);
      return null;
    }
  }

  async selectTopCashChurn(page, pageSize, start, end) {
    try {
      const topCashChurn = await Transaction.aggregate([
        {
          $match: {
            type: "withdraw",
            status: "accepted",
            updatedAt: { $gte: new Date(start) },
            updatedAt: { $lte: new Date(end) },
          },
        },
        {
          $group: {
            _id: { customerId: "$_customer" },
            totalWIthdrawn: { $sum: "$amount" },
          },
        },
        { $sort: { totalWithdrawn: -1 } },
        {
          $facet: {
            metadata: [{ $count: "total" }],
            data: [{ $skip: page * pageSize }, { $limit: pageSize }],
          },
        },
      ]);
      return topCashChurn;
    } catch (error) {
      console.log("Error on geting top cash churn document", error);
      return null;
    }
  }
}

module.exports = new TransactionRepository();
