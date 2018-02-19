/**
 * Module Donations.js
 *
 * Blockchain Foundation Donation API
 *
 * @author  Yury Garashko <grn@oneplus1.ru>
 * @since   0.1.0
 */


const contract = require("../contracts/Donations.json");

Donations = function(_web3) {
  this.web3 = _web3;
  const TSmartContract = _web3.eth.contract(contract.abi);
  this.smartContract = TSmartContract.at(contract.address);
  this.address = _web3.eth.coinbase;
  this.gas = 500000;
};

Donations.prototype.setAddress = function (_address) {
   return this.address = _address; 
};	 
 
Donations.prototype.setGas = function (_gas) {
   return this.gas = _gas; 
};	 
 
 Donations.prototype.itemCount = function () {
   return this.smartContract.itemCount(); 
};	 
Donations.prototype.add = function (idCharityFoundation, yyyymmdd, nDoc, idDonationSources, idTarget,
                                    idDonator, nameDonator, remark, sum) {
   return this.smartContract.add(idCharityFoundation, yyyymmdd, nDoc, idDonationSources, idTarget,
                                 idDonator, nameDonator, remark, sum, {from: this.address, gas: this.gas}); 
};
	 
Donations.prototype.set = function (ID, dCharityFoundation, yyyymmdd, nDoc, idDonationSources, idTarget,
                                    idDonator, nameDonator, remark, sum, used) {
  return this.smartContract.set(ID, dCharityFoundation, yyyymmdd, nDoc, idDonationSources, idTarget,
                                    idDonator, nameDonator, remark, sum, used, {from: this.address, gas: this.gas}); 
};
Donations.prototype.getByID = function (ID) {
  return this.smartContract.getByID(ID); 
};

Donations.prototype.getListIDByDonator = function (idDonator) {
  return this.smartContract.getListIDByDonator(idDonator); 
};
Donations.prototype.getListIDByYYYYMMDD = function (idCharityFoundation, yyyymmdd) {
  return this.smartContract.getListIDByYYYYMMDD(idCharityFoundation, yyyymmdd); 
};

Donations.prototype.getAllByDDOC = function (idCharityFoundation, dDoc) {
  ar = this.getListIDByYYYYMMDD(idCharityFoundation, dDoc);
  arr = []; for (i =0; i < ar.length; i++) {arr.push( this.getByID(ar[i]))};
  return arr;
};
module.exports = {Donations}; 