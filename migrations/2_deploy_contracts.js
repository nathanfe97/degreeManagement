var createDegree = artifacts.require("./createDegree.sol");

module.exports = function(deployer) {
  deployer.deploy(createDegree);
};
