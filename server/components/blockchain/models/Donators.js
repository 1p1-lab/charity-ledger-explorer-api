/**
 * Module Donators.js
 *
 * Blockchain Donation API
 *
 * @author  Yury Garashko <grn@oneplus1.ru>
 * @since   0.1.0
 */

const contract = require("../contracts/Donators.json");

Donators = function(_web3) {
  this.web3 = _web3;
  const TSmartContract = _web3.eth.contract(contract.abi);
  this.smartContract = TSmartContract.at(contract.address);
  this.address = _web3.eth.coinbase;
  this.gas = 500000;
};

Donators.prototype.setAddress = function (_address) {
   return this.address = _address; 
};	 
 
Donators.prototype.setGas = function (_gas) {
   return this.gas = _gas; 
};	 
 
 Donators.prototype.itemCount = function () {
   return this.smartContract.itemCount(); 
};	 

 Donators.prototype.add = function (name, email, contact) {
   return this.smartContract.add(name, email, contact, {from: this.address, gas: this.gas}); 
};
	 
Donators.prototype.set = function (ID, name, email, contact, isPerson, used) {
  return this.smartContract.set(ID, name, email, contact, isPerson, used, {from: this.address, gas: this.gas}); 
};

Donators.prototype.setHS = function (ID, name, hashEMail, contact, isPerson, used) {
  return this.smartContract.set(ID, name, hashEmail, contact, isPerson, used, {from: this.address, gas: this.gas}); 
};

Donators.prototype.getByID = function (ID) {
  return this.smartContract.getByID(ID); 
};

Donators.prototype.getByEMail = function (email) {
  return this.smartContract.getByEMail(email); 
};

Donators.prototype.getIDByEMail = function (email) {
  return this.smartContract.getIDByEMail(email); 
};

Donators.prototype.getAll = function () {
  max = this.itemCount();
  arr = []; for (i =1; i<=max; i++) {arr.push( this.getByID(i))};
  return arr;
};
module.exports = {Donators}; 