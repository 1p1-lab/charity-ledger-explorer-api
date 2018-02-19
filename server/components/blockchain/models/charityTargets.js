/**
 * Module charityTargets.js
 *
 * Blockchain Foundation Target API
 *
 * @author  Yury Garashko <grn@oneplus1.ru>
 * @since   0.1.0
 */

const contract = require("../contracts/CharityTargets.json");

charityTargets = function(_web3) {
  this.web3 = _web3;
  const TSmartContract = _web3.eth.contract(contract.abi);
  this.smartContract = TSmartContract.at(contract.address);
  this.address = _web3.eth.coinbase;
  this.gas = 500000;
};

charityTargets.prototype.setAddress = function (_address) {
   return this.address = _address; 
};	 
 
charityTargets.prototype.setGas = function (_gas) {
   return this.gas = _gas; 
};	 
 
 charityTargets.prototype.allItemsCount = function () {
   return this.smartContract.allItemsCount(); 
};	 
charityTargets.prototype.getCountByCharityFoundation = function (idCharityFoundation) {
   return this.smartContract.getCountByCharityFoundation(idCharityFoundation); 
};
 charityTargets.prototype.add = function (idCharityFoundation, ID, name, idProgram, idProject) {
   return this.smartContract.add(idCharityFoundation, ID, name,  idProgram, idProject, {from: this.address, gas: this.gas}); 
};
	 
charityTargets.prototype.set = function (idCharityFoundation, ID, name, idProgram, idProject, used) {
  return this.smartContract.set(idCharityFoundation, ID, name, used, idProgram, idProject, {from: this.address, gas: this.gas}); 
};

charityTargets.prototype.getByID = function (idCharityFoundation, ID) {
  return this.smartContract.getByID(idCharityFoundation, ID); 
};

charityTargets.prototype.getByList = function (idCharityFoundation, index) {
  return this.smartContract.getByList(idCharityFoundation, index); 
};

charityTargets.prototype.getAll = function (idCharityFoundation) {
  max = this.getCountByCharityFoundation(idCharityFoundation);
  arr = []; for (i =1; i<=max; i++) {arr.push( this.getByList(idCharityFoundation, i))};
  return arr;
};

charityTargets.prototype.exists = function (idCharityFoundation, ID) {
  const arr = this.getByID(idCharityFoundation, ID)
  return (arr[2] !== '')
};

module.exports = {charityTargets};
