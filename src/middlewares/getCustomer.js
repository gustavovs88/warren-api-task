const CustomerRepository = require("../repositories/customerRepository");

const getCustomer = async (req, res, next) => {
  const customerId = req.params.id || req.header("customer-id");
  const customer = await CustomerRepository.selectById(customerId);
  if (!customer) return res.sendStatus(401);
  req.customer = customer;
  next();
};
module.exports = { getCustomer };
