const db = require("../../_tests/db");
const { transactionMocks } = require("../../_tests/transactionMocks");
const { customerMocks } = require("../../_tests/customerMocks");
const Transaction = require("../models/Transaction");
const PortfolioService = require("./portfolioService");

beforeAll(async () => {
  await db.connect();
  await Transaction.insertMany(transactionMocks);
});

afterAll(async () => {
  await db.clearDatabase();
  await db.closeDatabase();
});

describe("Portfolio Service Tests", () => {
  it("Should return all customer portfolios with greater amount allocated than goal amount", () => {
    const customer = customerMocks[0];
    const expectedReturn = [
      {
        _id: "616dd5203f6a6bbcfcf9fed5",
        name: "Pack de meias para Dobby",
        amount: 110,
        goalAmount: 100,
        isDeleted: false,
        createdAt: "2022-02-14T19:45:37.582Z",
        updatedAt: "2022-02-14T19:45:37.582Z",
      },
    ];
    const goalReachedPortfolios =
      PortfolioService.filterGoalReachedPortfolios(customer);

    expect(goalReachedPortfolios).toStrictEqual(expectedReturn);
  });
});
