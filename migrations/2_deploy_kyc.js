const KYC = artifacts.require("KYC");

module.exports = function(deployer) {
    deployer.deploy(KYC, { gas: 6700000 }); // Set to a value below 6721975
};
