const Customer = require("../models/Customer");

class CustomerRepository {
  async selectAllCustomers() {
    const customers = await Customer.find({});
  }

  async selectById(customerId) {
    try {
      const customer = await Customer.findById(customerId);
      return customer;
    } catch (error) {
      console.log("Database error on finding customer by ID", error);
      return null;
    }
  }

  async updateBalance(customerId, amount) {
    try {
      if (amount <= 0) throw new Error("Transaction denied, negative balance.");
      const updatedBalance = await Customer.findByIdAndUpdate(
        customerId,
        { balance: amount },
        { new: true }
      );
      return updatedBalance;
    } catch (error) {
      console.log("Error on updating customer balance", error);
      return null;
    }
  }

  async selectTopAllocationAmount(page, pageSize) {
    const topAllocationAmountCustomers = await Customer.aggregate([
      {
        $group: {
          _id: {
            customerId: "$_id",
            firstName: "$firstName",
            lastName: "$lastName",
          },
          totalAllocated: { $sum: { $sum: "$portfolios.amount" } },
        },
      },
      { $sort: { totalAllocated: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: page * pageSize }, { $limit: pageSize }],
        },
      },
    ]);

    console.log(topAllocationAmountCustomers);
    return topAllocationAmountCustomers;
  }
}

module.exports = new CustomerRepository();
