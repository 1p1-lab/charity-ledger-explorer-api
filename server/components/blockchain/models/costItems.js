/**
 * Module costItems.js
 *
 * Blockchain Foundation Cost Item API
 *
 * @author  Yury Garashko <grn@oneplus1.ru>
 * @since   0.1.0
 */

const contract = require("../contracts/CostItems.json");

costItems = function(_web3) {
  this.web3 = _web3;
  const TSmartContract = _web3.eth.contract(contract.abi);
  this.smartContract = TSmartContract.at(contract.address);
  this.address = _web3.eth.coinbase;
  this.gas = 500000;
};

costItems.prototype.setAddress = function (_address) {
   return this.address = _address; 
};	 
 
costItems.prototype.setGas = function (_gas) {
   return this.gas = _gas; 
};	 
 
 costItems.prototype.allItemsCount = function () {
   return this.smartContract.allItemsCount(); 
};	 
costItems.prototype.getCountByCharityFoundation = function (idCharityFoundation) {
   return this.smartContract.getCountByCharityFoundation(idCharityFoundation); 
};
 costItems.prototype.add = function (idCharityFoundation, ID, name) {
   return this.smartContract.add(idCharityFoundation, ID, name, {from: this.address, gas: this.gas}); 
};
	 
costItems.prototype.set = function (idCharityFoundation, ID, name, used) {
  return this.smartContract.set(idCharityFoundation, ID, name, used, {from: this.address, gas: this.gas}); 
};

costItems.prototype.getByID = function (idCharityFoundation, ID) {
  return this.smartContract.getByID(idCharityFoundation, ID); 
};

costItems.prototype.getByList = function (idCharityFoundation, index) {
  return this.smartContract.getByList(idCharityFoundation, index); 
};

costItems.prototype.getAll = function (idCharityFoundation) {
  max = this.getCountByCharityFoundation(idCharityFoundation);
  arr = []; for (i =1; i<=max; i++) {arr.push( this.getByList(idCharityFoundation, i))};
  return arr;
};

module.exports = {costItems}; 