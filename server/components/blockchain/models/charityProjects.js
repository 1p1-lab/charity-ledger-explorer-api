/**
 * Module charityProjects.js
 *
 * Blockchain Foundation Project API
 *
 * @author  Yury Garashko <grn@oneplus1.ru>
 * @since   0.1.0
 */

const contract = require("../contracts/CharityProjects.json");

charityProjects = function(_web3) {
  this.web3 = _web3;
  const TSmartContract = _web3.eth.contract(contract.abi);
  this.smartContract = TSmartContract.at(contract.address);
  this.address = _web3.eth.coinbase;
  this.gas = 500000;
};

charityProjects.prototype.setAddress = function (_address) {
   return this.address = _address; 
};	 
 
charityProjects.prototype.setGas = function (_gas) {
   return this.gas = _gas; 
};	 
 
 charityProjects.prototype.allItemsCount = function () {
   return this.smartContract.allItemsCount(); 
};	 
charityProjects.prototype.getCountByCharityFoundation = function (idCharityFoundation) {
   return this.smartContract.getCountByCharityFoundation(idCharityFoundation); 
};
 charityProjects.prototype.add = function (idCharityFoundation, ID, name) {
   return this.smartContract.add(idCharityFoundation, ID, name, {from: this.address, gas: this.gas}); 
};
	 
charityProjects.prototype.set = function (idCharityFoundation, ID, name, used) {
  return this.smartContract.set(idCharityFoundation, ID, name, used, {from: this.address, gas: this.gas}); 
};

charityProjects.prototype.getByID = function (idCharityFoundation, ID) {
  return this.smartContract.getByID(idCharityFoundation, ID); 
};

charityProjects.prototype.getByList = function (idCharityFoundation, index) {
  return this.smartContract.getByList(idCharityFoundation, index); 
};

charityProjects.prototype.getAll = function (idCharityFoundation) {
  max = this.getCountByCharityFoundation(idCharityFoundation);
  arr = []; for (i =1; i<=max; i++) {arr.push( this.getByList(idCharityFoundation, i))};
  return arr;
};

charityProjects.prototype.exists = function (idCharityFoundation, ID) {
  const arr = this.getByID(idCharityFoundation, ID)
  return (arr[2] !== '')
};

module.exports = {charityProjects};