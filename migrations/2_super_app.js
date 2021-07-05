const SuperApp = artifacts.require("SuperApp");

module.exports = function (deployer) {
  deployer.deploy(SuperApp, "0xeD5B5b32110c3Ded02a07c8b8e97513FAfb883B6", "0xF4C5310E51F6079F601a5fb7120bC72a70b96e2A", "0x0F1D7C55A2B133E000eA10EeC03c774e0d6796e8", 3858024691358);
};
