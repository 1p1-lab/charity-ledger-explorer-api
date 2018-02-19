/**
 * Module donationSources.js
 *
 * Blockchain Foundation Donation Source API
 *
 * @author  Yury Garashko <grn@oneplus1.ru>
 * @since   0.1.0
 */

const contract = require("../contracts/DonationSources.json");

donationSources = function(_web3) {
  this.web3 = _web3;
  const TSmartContract = _web3.eth.contract(contract.abi);
  this.smartContract = TSmartContract.at(contract.address);
  this.address = _web3.eth.coinbase;
  this.gas = 500000;
};

donationSources.prototype.setAddress = function (_address) {
   return this.address = _address; 
};	 
 
donationSources.prototype.setGas = function (_gas) {
   return this.gas = _gas; 
};	 
 
 donationSources.prototype.itemCount = function () {
   return this.smartContract.itemCount(); 
};	 

 donationSources.prototype.add = function (ID, name, isDoubleEntry) {
   return this.smartContract.add(ID, name, isDoubleEntry, {from: this.address, gas: this.gas}); 
};
	 
donationSources.prototype.set = function (ID, name, isDoubleEntry, used) {
  return this.smartContract.set(ID, name, isDoubleEntry, used, {from: this.address, gas: this.gas}); 
};

donationSources.prototype.getByID = function (ID) {
  return this.smartContract.getByID(ID); 
};

donationSources.prototype.getByList = function (index) {
  return this.smartContract.getByList(index); 
};

module.exports = {donationSources}; 