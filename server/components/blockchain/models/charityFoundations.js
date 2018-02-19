/**
 * Module charityFoundations.js
 *
 * Blockchain Foundation API
 *
 * @author  Yury Garashko <grn@oneplus1.ru>
 * @since   0.1.0
 */

const contract = require('../contracts/CharityFoundations.json')

charityFoundations = function(_web3) {
  this.web3 = _web3;
  const TSmartContract = _web3.eth.contract(contract.abi);
  this.smartContract = TSmartContract.at(contract.address);
  this.address = _web3.eth.coinbase;
  this.gas = 500000;
};

charityFoundations.prototype.setAddress = function (_address) {
   return this.address = _address; 
};	 
 
charityFoundations.prototype.setGas = function (_gas) {
   return this.gas = _gas; 
};	 
 
 charityFoundations.prototype.itemCount = function () {
   return this.smartContract.itemCount(); 
};	 

 charityFoundations.prototype.add = function (ID, name, addr) {
   return this.smartContract.add(ID, name, addr, {from: this.address, gas: this.gas}); 
};
	 
charityFoundations.prototype.set = function (ID, name, addr, used) {
  return this.smartContract.set(ID, name, addr, used, {from: this.address, gas: this.gas}); 
};

charityFoundations.prototype.getByID = function (ID) {
  return this.smartContract.getByID(ID); 
};

charityFoundations.prototype.getByList = function (index) {
  return this.smartContract.getByList(index); 
};

charityFoundations.prototype.getIDByAddress = function (address) {
  return this.smartContract.getIDByAddress(address); 
};

module.exports = {charityFoundations}; 