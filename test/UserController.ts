import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { Request, Response } from "express";
import User from "../src/models/User";
import { register } from "../src/controllers/User";

chai.use(sinonChai);

describe("User Controller", function () {
  let findOne_stub: any;
  let save_stub: any;

  let mockReq: Request;
  let mockRes: Response;

  before(() => {
    save_stub = sinon.stub(User.prototype, "save");
  });

  after(() => {
    save_stub.restore();
  });

  beforeEach(() => {
    findOne_stub = sinon.stub(User, "findOne").returns(null as any);

    mockReq = {
      body: {
        username: "",
        password: "",
      },
    } as Request;

    mockRes = ({
      status: sinon.spy((data: any) => mockRes),
      send: sinon.spy((data: any) => mockRes),
    } as any) as Response;
  });

  afterEach(() => {
    findOne_stub.restore();
  });

  it("should register user when username does not already exist and all fields are valid", async () => {
    mockReq.body.username = "Test12";
    mockReq.body.password = "123456";

    await register(mockReq, mockRes);

    expect(mockRes.send).to.have.been.calledWith("User saved successfully!");
  });

  it("should not register user when username have less than 6 characters", async () => {
    mockReq.body.username = "Test";
    mockReq.body.password = "123456";

    await register(mockReq, mockRes);

    expect(mockRes.status).to.have.been.calledWith(400);
  });

  it("should not register user when username have more than 20 characters", async () => {
    mockReq.body.username = "Testtesttesttest12345";
    mockReq.body.password = "123456";

    await register(mockReq, mockRes);

    expect(mockRes.status).to.have.been.calledWith(400);
  });

  it("should not register user when password have less than 6 characters", async () => {
    mockReq.body.username = "Test12";
    mockReq.body.password = "12345";

    await register(mockReq, mockRes);

    expect(mockRes.status).to.have.been.calledWith(400);
  });

  it("should not register user when password have more than 30 characters", async () => {
    mockReq.body.username = "Test12";
    mockReq.body.password = "1234512345123451234512345123456";

    await register(mockReq, mockRes);

    expect(mockRes.status).to.have.been.calledWith(400);
  });

  it("should not register user when username already exist", async () => {
    mockReq.body.username = "Test12";
    mockReq.body.password = "1234512345123451234512345123456";

    findOne_stub.returns({
      _id: "1234",
      username: "Test12",
      password: "123456",
    });

    await register(mockReq, mockRes);

    expect(mockRes.status).to.have.been.calledWith(400);
  });

  it("should not register user when username and password are empty", async () => {
    mockReq.body.username = "";
    mockReq.body.password = "";

    await register(mockReq, mockRes);

    expect(mockRes.status).to.have.been.calledWith(400);
  });

  it("should not register user when username and password are both invalid", async () => {
    mockReq.body.username = "test";
    mockReq.body.password = "1234512345123451234512345123456";

    await register(mockReq, mockRes);

    expect(mockRes.status).to.have.been.calledWith(400);
  });
});
