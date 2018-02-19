/**
 * Module charityPrograms.js
 *
 * Blockchain Foundation Program API
 *
 * @author  Yury Garashko <grn@oneplus1.ru>
 * @since   0.1.0
 */

const contract = require("../contracts/CharityPrograms.json");

charityPrograms = function(_web3) {
  this.web3 = _web3;
  const TSmartContract = _web3.eth.contract(contract.abi);
  this.smartContract = TSmartContract.at(contract.address);
  this.address = _web3.eth.coinbase;
  this.gas = 500000;
};

charityPrograms.prototype.setAddress = function (_address) {
   return this.address = _address; 
};	 
 
charityPrograms.prototype.setGas = function (_gas) {
   return this.gas = _gas; 
};	 
 
 charityPrograms.prototype.allItemsCount = function () {
   return this.smartContract.allItemsCount(); 
};	 
charityPrograms.prototype.getCountByCharityFoundation = function (idCharityFoundation) {
   return this.smartContract.getCountByCharityFoundation(idCharityFoundation); 
};
 charityPrograms.prototype.add = function (idCharityFoundation, ID, name) {
   return this.smartContract.add(idCharityFoundation, ID, name, {from: this.address, gas: this.gas}); 
};
	 
charityPrograms.prototype.set = function (idCharityFoundation, ID, name, used) {
  return this.smartContract.set(idCharityFoundation, ID, name, used, {from: this.address, gas: this.gas}); 
};

charityPrograms.prototype.getByID = function (idCharityFoundation, ID) {
  return this.smartContract.getByID(idCharityFoundation, ID); 
};

charityPrograms.prototype.getByList = function (idCharityFoundation, index) {
  return this.smartContract.getByList(idCharityFoundation, index); 
};

charityPrograms.prototype.getAll = function (idCharityFoundation) {
  max = this.getCountByCharityFoundation(idCharityFoundation);
  arr = []; for (i =1; i<=max; i++) {arr.push( this.getByList(idCharityFoundation, i))};
  return arr;
};

charityPrograms.prototype.exists = function (idCharityFoundation, ID) {
  const arr = this.getByID(idCharityFoundation, ID)
  return (arr[2] !== '')
};

module.exports = {charityPrograms};