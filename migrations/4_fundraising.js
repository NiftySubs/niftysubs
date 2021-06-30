const Fundraising = artifacts.require("Fundraising");

module.exports = function (deployer) {
  deployer.deploy(Fundraising);
};
