const CustomerRepository = require("../repositories/customerRepository");

const updateCustomerBalance = async (transaction) => {
  const { _customer, type, amount, toCustomer } = transaction;
  const customer = await CustomerRepository.selectById(_customer);
  const receiver = (await CustomerRepository.selectById(toCustomer)) || {};
  let customerNewBalance;
  let customerUpdatedBalance;
  let receiverNewBalance;
  let receiverUpdatedBalance;

  const customerCurrentBalance = customer.balance;
  const receiverCurrentBalance = receiver.balance;
  switch (type) {
    case "deposit":
      customerNewBalance = customerCurrentBalance + amount;
      customerUpdatedBalance = await CustomerRepository.updateBalance(
        customer.id,
        customerNewBalance
      );
      return customerUpdatedBalance;
    case "account_transfer":
      customerNewBalance = customerCurrentBalance - amount;
      customerUpdatedBalance = await CustomerRepository.updateBalance(
        customer.id,
        customerNewBalance
      );
      receiverNewBalance = receiverCurrentBalance + amount;
      receiverUpdatedBalance = await CustomerRepository.updateBalance(
        receiver.id,
        receiverNewBalance
      );
      return customerUpdatedBalance;
  }
};

module.exports = { updateCustomerBalance };
