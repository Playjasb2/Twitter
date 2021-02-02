import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import User from "../src/models/User";
import Message from "../src/models/Message";
import { saveMessage, getAllMessages } from "../src/controllers/Chat";

chai.use(sinonChai);

describe("Chat Controller", () => {
  let user_find_one_stub: sinon.SinonStub;
  let message_save_stub: sinon.SinonStub;
  let message_find_stub: sinon.SinonStub;
  const mockMessage = {
    from: "Client1",
    to: "Client2",
    message: "Test",
  };

  beforeEach(() => {
    user_find_one_stub = sinon.stub(User, "findOne").returns(null as any);
    message_save_stub = sinon.stub(Message.prototype, "save");
    message_find_stub = sinon.stub(Message, "find");
  });

  afterEach(() => {
    user_find_one_stub.restore();
    message_save_stub.restore();
    message_find_stub.restore();
  });

  describe("Save Message", () => {
    it("should save the message when from and to users are valid", async () => {
      user_find_one_stub.onFirstCall().returns({ id: 1, username: "Client1" });
      user_find_one_stub.onSecondCall().returns({ id: 2, username: "Client2" });

      const result = await saveMessage(mockMessage);

      expect(result).to.equal(true);
      expect(user_find_one_stub).to.have.been.calledTwice;
      expect(message_save_stub).to.have.been.calledOnce;
    });

    it("should throw an error when from user does not exist", async () => {
      user_find_one_stub.onFirstCall().returns(null);
      user_find_one_stub.onSecondCall().returns({ id: 2, username: "Client2" });

      let error: Error | null = null;

      try {
        await saveMessage(mockMessage);
      } catch (err) {
        error = err;
      }

      expect(error).to.not.equal(null);
      expect(user_find_one_stub).to.have.been.calledOnce;
      expect(message_save_stub).to.have.not.been.called;
    });

    it("should throw an error when to user does not exist", async () => {
      user_find_one_stub.onFirstCall().returns({ id: 1, username: "Client1" });
      user_find_one_stub.onSecondCall().returns(null);

      let error: Error | null = null;

      try {
        await saveMessage(mockMessage);
      } catch (err) {
        error = err;
      }

      expect(error).to.not.equal(null);
      expect(user_find_one_stub).to.have.been.calledTwice;
      expect(message_save_stub).to.have.not.been.called;
    });
  });

  describe("Get All Messages", () => {
    it("should return all messages when from and to users are valid", async () => {
      user_find_one_stub.onFirstCall().returns({ id: 1, username: "Client1" });
      user_find_one_stub.onSecondCall().returns({ id: 2, username: "Client2" });
    });
  });
});
