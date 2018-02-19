/**
 * Module Expenses.js
 *
 * Blockchain Foundation Expense API
 *
 * @author  Yury Garashko <grn@oneplus1.ru>
 * @since   0.1.0
 */

const contract = require("../contracts/Expenses.json");

Expenses = function(_web3) {
  this.web3 = _web3;
  const TSmartContract = _web3.eth.contract(contract.abi);
  this.smartContract = TSmartContract.at(contract.address);
  this.address = _web3.eth.coinbase;
  this.gas = 500000;
};

Expenses.prototype.setAddress = function (_address) {
   return this.address = _address; 
};	 
 
Expenses.prototype.setGas = function (_gas) {
   return this.gas = _gas; 
};	 
 
 Expenses.prototype.itemCount = function () {
   return this.smartContract.itemCount(); 
};	 
Expenses.prototype.add = function (idCharityFoundation, yyyymmdd, nDoc, idProgram, idProject,
                                    idCostItem, remark, sum) {
   return this.smartContract.add(idCharityFoundation, yyyymmdd, nDoc, idProgram, idProject,
                                 idCostItem, remark, sum, {from: this.address, gas: this.gas}); 
};
	 
Expenses.prototype.set = function (ID, dCharityFoundation, yyyymmdd, nDoc, idProgram, idProject,
                                    idCostItem, remark, sum, used) {
  return this.smartContract.set(ID, dCharityFoundation, yyyymmdd, nDoc, idProgram, idProject,
                                    idCostItem, remark, sum, used, {from: this.address, gas: this.gas}); 
};
Expenses.prototype.getByID = function (ID) {
  return this.smartContract.getByID(ID); 
};

Expenses.prototype.getListIDByYYYYMMDD = function (idCharityFoundation, yyyymmdd) {
  return this.smartContract.getListIDByYYYYMMDD(idCharityFoundation, yyyymmdd); 
};

Expenses.prototype.getAllByDDOC = function (idCharityFoundation, dDoc) {
  ar = this.getListIDByYYYYMMDD(idCharityFoundation, dDoc);
  arr = []; for (i =0; i < ar.length; i++) {arr.push( this.getByID(ar[i]))};
  return arr;
};
module.exports = {Expenses};