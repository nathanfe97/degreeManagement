var HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC ="actress raise trade obtain situate dismiss basic flag type spirit frog light";
var infura_apikey = "degree";
module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/"+infura_apikey),
      network_id: 3
    }
  }
};