import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../src/models/User";
import { register, login } from "../src/controllers/User";

chai.use(sinonChai);

describe("User Controller", () => {
  let user_findOne_stub: any;
  let save_stub: any;
  let bcrypt_compare_stub: any;
  let jwt_sign_stub: any;

  let mockReq: Request;
  let mockRes: Response;

  before(() => {
    save_stub = sinon.stub(User.prototype, "save");
  });

  after(() => {
    save_stub.restore();
  });

  beforeEach(() => {
    user_findOne_stub = sinon.stub(User, "findOne").returns(null as any);
    bcrypt_compare_stub = sinon.stub(bcrypt, "compare");
    jwt_sign_stub = sinon.stub(jwt, "sign");

    mockReq = {
      body: {
        username: "",
        password: "",
      },
    } as Request;

    mockRes = ({
      status: sinon.spy((data: any) => mockRes),
      send: sinon.spy((data: any) => mockRes),
      header: sinon.spy((data1: any, data2: any) => mockRes),
    } as any) as Response;
  });

  afterEach(() => {
    user_findOne_stub.restore();
    bcrypt_compare_stub.restore();
    jwt_sign_stub.restore();
  });

  describe("Register", () => {
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

      user_findOne_stub.returns({
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

  describe("Login", () => {
    it("should login the user if the username exists and both username and password are valid and correct", async () => {
      mockReq.body.username = "Test12";
      mockReq.body.password = "123456";

      user_findOne_stub.returns({
        _id: "1234",
        username: "Test12",
        password: "123456",
      });

      bcrypt_compare_stub.returns(true);
      jwt_sign_stub.returns("Test_Token");

      await login(mockReq, mockRes);

      expect(mockRes.send).to.have.been.calledWith("Logged in!");
      expect(mockRes.header).to.have.been.calledWith(
        "auth-token",
        "Test_Token"
      );
    });

    it("should not login the user if the username does not exist", async () => {
      mockReq.body.username = "Test12";
      mockReq.body.password = "123456";

      await login(mockReq, mockRes);

      expect(mockRes.status).to.have.been.calledWith(400);
      expect(mockRes.send).to.have.been.calledWith(
        "Incorrect username or password"
      );
    });

    it("should not login the user if the password is incorrect", async () => {
      mockReq.body.username = "Test12";
      mockReq.body.password = "123456";

      user_findOne_stub.returns({
        _id: "1234",
        username: "Test12",
        password: "123457",
      });

      bcrypt_compare_stub.returns(false);

      await login(mockReq, mockRes);

      expect(mockRes.status).to.have.been.calledWith(400);
      expect(mockRes.send).to.have.been.calledWith(
        "Incorrect username or password"
      );
    });

    it("should not login the user if both username and password are empty", async () => {
      mockReq.body.username = "";
      mockReq.body.password = "";

      user_findOne_stub.returns({
        _id: "1234",
        username: "Test12",
        password: "123457",
      });

      await login(mockReq, mockRes);

      expect(mockRes.status).to.have.been.calledWith(400);
      expect(mockRes.send).to.have.been.calledWith(
        "Incorrect username or password"
      );
    });

    it("should not login the user if the username is invalid", async () => {
      mockReq.body.username = "Test";
      mockReq.body.password = "123456";

      user_findOne_stub.returns({
        _id: "1234",
        username: "Test12",
        password: "123456",
      });

      await login(mockReq, mockRes);

      expect(mockRes.status).to.have.been.calledWith(400);
      expect(mockRes.send).to.have.been.calledWith(
        "Incorrect username or password"
      );
    });

    it("should not login the user if the password is invalid", async () => {
      mockReq.body.username = "Test12";
      mockReq.body.password = "1234512345123451234512345123456";

      user_findOne_stub.returns({
        _id: "1234",
        username: "Test12",
        password: "123456",
      });

      await login(mockReq, mockRes);

      expect(mockRes.status).to.have.been.calledWith(400);
      expect(mockRes.send).to.have.been.calledWith(
        "Incorrect username or password"
      );
    });
  });
});
