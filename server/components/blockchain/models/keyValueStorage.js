/**
 * Module keyValueStorage.js
 *
 * Blockchain Key-Value Storage API
 *
 * @author  Yury Garashko <grn@oneplus1.ru>
 * @since   0.1.0
 */

const contract = require("../contracts/KeyValueStorage.json");

keyValueStorage = function(_web3) {
  this.web3 = _web3;
  const TSmartContract = _web3.eth.contract(contract.abi);
  this.smartContract = TSmartContract.at(contract.address);
  this.address = _web3.eth.coinbase;
  this.gas = 500000;
};

keyValueStorage.prototype.itemCount = function () {
   return this.smartContract.itemCount(); 
};	

keyValueStorage.prototype.setAddress = function (_address) {
   return this.address = _address; 
};	 
 
keyValueStorage.prototype.setGas = function (_gas) {
   return this.gas = _gas; 
};	 
 
 keyValueStorage.prototype.itemCount = function () {
   return this.smartContract.itemCount(); 
};	 

keyValueStorage.prototype.add = function (sect, key, value) {
  if (sect.length > 32) {
    console.log(sect.length > 32);
     return '';
  }   
   return this.smartContract.add(sect, key, value, {from: this.address, gas: this.gas}); 
};
	 
keyValueStorage.prototype.set = function (sect, key, value) {
  if (sect.length > 32) {
    console.log(sect.length > 32);
    return '';
  }   
  return this.smartContract.set(sect, key, value, {from: this.address, gas: this.gas}); 
};

keyValueStorage.prototype.del = function (sect, key) {
  if (sect.length > 32) {
    console.log(sect.length > 32);
    return '';
  }
  return this.smartContract.del(sect, key, {from: this.address, gas: this.gas}); 
};

keyValueStorage.prototype.get = function (sect, key) {
  if (sect.length > 32) {
    console.log(sect.length > 32);
    return '';
  }
  return this.smartContract.get(sect, key); 
};

keyValueStorage.prototype.upsert = function (sect, key, value) {
  const orig = this.get(sect, key)
  if (orig === '') {
    return this.add(sect, key, value)
  }
  else if (value && orig !== value) {
    return this.set(sect, key, value)
  }
  return false
}

keyValueStorage.prototype.getByList = function (ID) {
  return this.smartContract.getByList(ID); 
};

module.exports = {keyValueStorage}; 