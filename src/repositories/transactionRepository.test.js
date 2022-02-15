const db = require("../../_tests/db");
const { transactionMocks } = require("../../_tests/transactionMocks");
const { customerMocks } = require("../../_tests/customerMocks");
const Transaction = require("../models/Transaction");
const TransactionRepository = require("../repositories/transactionRepository");
// jest.setTimeout(90 * 1000);

beforeAll(async () => {
  await db.connect();
  await Transaction.insertMany(transactionMocks);
});

afterAll(async () => {
  await db.clearDatabase();
  await db.closeDatabase();
});

describe("Transaction Repository Tests", () => {
  it("Should insert a new deposit transaction into DB", async () => {
    const transaction = {
      _customer: customerMocks[0],
      _id: "6170a0501471a5ccd1b55555",
      type: "deposit",
      status: "pending",
      amount: 500,
    };

    await TransactionRepository.insertTransaction(transaction);
    const transactionInserted = await Transaction.findById(transaction._id);

    expect(transactionInserted.type).toEqual("deposit");
    expect(transactionInserted.status).toEqual("pending");
    expect(transactionInserted.amount).toEqual(500);
    expect(transactionInserted).toHaveProperty("createdAt");
    expect(transactionInserted).toHaveProperty("updatedAt");
  });
});
