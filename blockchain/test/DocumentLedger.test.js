const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DocumentLedger Smart Contract", function () {
  let documentLedger;
  let owner;
  let officer1;
  let officer2;

  beforeEach(async function () {
    [owner, officer1, officer2] = await ethers.getSigners();
    const DocumentLedger = await ethers.getContractFactory("DocumentLedger");
    documentLedger = await DocumentLedger.deploy();
    await documentLedger.waitForDeployment();
  });

  it("should deploy with initial total documents count of 0", async function () {
    expect(await documentLedger.totalDocumentsRegistered()).to.equal(0);
  });

  it("should successfully add Version 1 of a passport record", async function () {
    const passportNo = "Z9876543";
    const encryptedPayload = "gAAAAABl-sample-fernet-encrypted-payload-v1";
    const officerId = "OFFICER_DEL_042";

    const tx = await documentLedger.addVersion(passportNo, encryptedPayload, officerId);
    await tx.wait();

    expect(await documentLedger.totalDocumentsRegistered()).to.equal(1);
    expect(await documentLedger.getVersionCount(passportNo)).to.equal(1);

    const history = await documentLedger.getHistory(passportNo);
    expect(history.length).to.equal(1);
    expect(history[0].encryptedData).to.equal(encryptedPayload);
    expect(history[0].officerId).to.equal(officerId);
    expect(history[0].timestamp).to.be.gt(0);
  });

  it("should support multiple sequential versions for an audit trail", async function () {
    const passportNo = "Z9876543";
    const payloadV1 = "gAAAAABl-payload-v1";
    const payloadV2 = "gAAAAABl-payload-v2-renewed";

    await documentLedger.addVersion(passportNo, payloadV1, "OFFICER_01");
    await documentLedger.addVersion(passportNo, payloadV2, "OFFICER_02");

    expect(await documentLedger.getVersionCount(passportNo)).to.equal(2);
    const history = await documentLedger.getHistory(passportNo);
    expect(history.length).to.equal(2);
    expect(history[0].encryptedData).to.equal(payloadV1);
    expect(history[1].encryptedData).to.equal(payloadV2);

    const latest = await documentLedger.getLatestVersion(passportNo);
    expect(latest.encryptedData).to.equal(payloadV2);
  });

  it("should revert if empty passport number or payload is passed", async function () {
    await expect(
      documentLedger.addVersion("", "payload", "OFFICER_01")
    ).to.be.revertedWith("Passport number cannot be empty");

    await expect(
      documentLedger.addVersion("Z9876543", "", "OFFICER_01")
    ).to.be.revertedWith("Encrypted payload cannot be empty");
  });
});
