pragma solidity ^0.8.4;

contract Rx {

  //structure to hold the details of a prescriber
  struct Prescriber {
    string name; //name of prescriber
    string mcr; //MCR of prescriber
    string clinicName; //name of clinic
    string clinicAddress; //address of clinic
    address addr; //address of prescriber
    bool valid; //valid status
  }

 //structure to hold the details of a patient
 struct Patient {
    string name; //name of patient
    string ic; //IC of patient
    uint birthDate; //birth date of patient
    string homeAddress; //home address of patient
    address addr; //address of patient
    uint[] prescriptionList; //prescription list of patient
    bool valid; //valid status
  }

  //structure to hold the details of a pharmacist
  struct Pharmacist {
    string name; //name of pharmacist
    string prn; //PRN of pharmacist
    string clinicName; //name of clinic
    string clinicAddress; //address of clinic
    address addr; //address of pharmacist
    bool valid; //valid status
  }

  //structure to hold the details of a prescribed medication
  struct Drug {
    string name; //name of drug
    string strength; //strength of drug
    string dosing; //dosing frequency of drug
    uint duration; //duration of use
    uint quantity; //quantity of drug prescribed
    bool modified; //modified status [COUNTER???]
    uint dispenseCounter; //counter
    mapping(uint => Dispense) dispenseStructs; // random access by dispense key
    uint balance; //balance
    bool valid; //valid status
  }

  //structure to hold Rx details
  struct Prescription {
    uint date; //date of Rx
    Patient patientDetails; //details of patient
    Prescriber prescriberDetails; //details of prescriber
    uint[] drugList; //list of drug keys so we can look them up
    mapping(string => uint) drugNames; // mapping drug name to drug key
    mapping(uint => Drug) drugStructs; // random access by drug key
    bool valid; //valid status
    bool reviewed; //reviewed status
  }

  //structure to hold the details of a dispensed drug
  struct Dispense {
    uint dispensedDate; //date of dispensing
    uint dispensedQuantity; //quantity of drug dispensed
    uint dispensedDuration; //duration of drug dispensed
    bool dispensed; // dispensed status
  }

  mapping(address => Prescriber) public prescriberStructs; //access by prescriber address
  address[] public prescriberList; //list of prescriber address so we can enumerate them

  mapping(address => Patient) public patientStructs; //access by patient address
  address[] patientList; //list of patient address so we can enumerate them

  mapping(address => Pharmacist) public pharmacistStructs; //access by pharmacist address
  address[] pharmacistList; //list of pharmacist address so we can enumerate them

  mapping(uint => Prescription) public prescriptionStructs; //access by prescription key
  uint[] prescriptionList; //list of prescription keys so we can enumerate them

  address public admin; //owner of the smart contract

  uint drugCount; //for addDrug

  uint prescriptionCount; //for newPrescription
  uint dispenseCount; //for dispenseDrug

  constructor() {
     admin = msg.sender;
  }

  //function can only run if user is admin
  modifier onlyAdmin {
    require(msg.sender == admin, "You are not authorised for this action");
    _;
  }

  //function can only run if user is prescriber
  modifier onlyPrescriber {
    address addr = msg.sender;
    require(prescriberStructs[addr].valid, "You are not authorised for this action");
    _;
  }

  //function can only run if user is pharmacist
  modifier onlyPharmacist {
    address addr = msg.sender;
    require(pharmacistStructs[addr].valid, "You are not authorised for this action");
    _;
  }

  //adding a prescriber - require to be admin
  function setPrescriber(string memory _name, string memory _mcr, string memory _clinicName, string memory _clinicAddress, address _addr) public onlyAdmin {
    prescriberStructs[_addr] = Prescriber({
      name: _name,
      mcr: _mcr,
      clinicName: _clinicName,
      clinicAddress: _clinicAddress,
      addr: _addr,
      valid: true
      });
    prescriberList.push(_addr);
  }

  //update a prescriber - require to be admin
  function updatePrescriber(string memory _name, string memory _mcr, string memory _clinicName, string memory _clinicAddress, address _addr) public onlyAdmin {
    require(prescriberStructs[_addr].valid, "User is no longer valid"); //require prescriber to be valid
    Prescriber storage p = prescriberStructs[_addr];
    p.name = _name;
    p.mcr = _mcr;
    p.clinicName = _clinicName;
    p.clinicAddress = _clinicAddress;
  }

  //adding a patient - require to be admin
  function setPatient(string memory _name, string memory _ic, uint _birthDate, string memory _homeAddress, address _addr) public onlyAdmin {
    patientStructs[_addr] = Patient({
      name: _name,
      ic: _ic,
      birthDate: _birthDate,
      homeAddress: _homeAddress,
      addr: _addr,
      valid: true,
      prescriptionList: new uint[](0)
      });
    patientList.push(_addr);
  }

  //update a patient - require to be admin
  function updatePatient(string memory _name, string memory _ic, uint _birthDate, string memory _homeAddress, address _addr) public onlyAdmin {
    require(patientStructs[_addr].valid, "User is no longer valid"); //require patient to be valid
    Patient storage p = patientStructs[_addr];
    p.name = _name;
    p.ic = _ic;
    p.birthDate = _birthDate;
    p.homeAddress = _homeAddress;
  }

  //adding a pharmacist - require to be admin
  function setPharmacist(string memory _name, string memory _prn, string memory _clinicName, string memory _clinicAddress, address _addr) public onlyAdmin {
    pharmacistStructs[_addr] = Pharmacist({
      name: _name,
      prn: _prn,
      clinicName: _clinicName,
      clinicAddress: _clinicAddress,
      addr: _addr,
      valid: true
      });
    pharmacistList.push(_addr);
  }

  //update a pharmacist - require to be admin
  function updatePharmacist(string memory _name, string memory _prn, string memory _clinicName, string memory _clinicAddress, address _addr) public onlyAdmin {
    require(pharmacistStructs[_addr].valid, "User is no longer valid"); //require pharmacist to be valid
    Pharmacist storage p = pharmacistStructs[_addr];
    p.name = _name;
    p.prn = _prn;
    p.clinicName = _clinicName;
    p.clinicAddress = _clinicAddress;
  }

  //creating a prescription - require to be prescriber
  function newPrescription(address _prescriberAddr, address _patientAddr) public onlyPrescriber {
    prescriptionCount = prescriptionList.length;
    prescriptionCount++;
    prescriptionList.push(prescriptionCount);

    patientStructs[_patientAddr].prescriptionList.push(prescriptionCount);

    Prescription storage p = prescriptionStructs[prescriptionCount];
    p.date = block.timestamp;
    p.prescriberDetails = prescriberStructs[_prescriberAddr];
    p.patientDetails = patientStructs[_patientAddr];
    p.valid = true;
    p.reviewed = false;
    p.drugList = new uint[](0);
  }

  //adding a drug to prescription - require to be prescriber
  function addDrug(uint _prescriptionKey, string memory _drugName, string memory _strength, string memory _dosing, uint _duration, uint _quantity) public onlyPrescriber {
    require(prescriptionStructs[_prescriptionKey].valid, "Prescription is no longer valid"); //require rx to be valid
    drugCount = prescriptionStructs[_prescriptionKey].drugList.length; //get existing max drug key
    drugCount++;

    prescriptionStructs[_prescriptionKey].drugList.push(drugCount); //add drug key to prescription drug list
    prescriptionStructs[_prescriptionKey].drugNames[_drugName] = drugCount; //mapping drug name to drug key

    Drug storage d = prescriptionStructs[_prescriptionKey].drugStructs[drugCount];
    d.name = _drugName;
    d.strength = _strength;
    d.dosing = _dosing;
    d.duration = _duration;
    d.quantity = _quantity;
    d.modified = false;
    d.dispenseCounter = 0;
    d.valid = true;
    d.balance = _quantity;
    //balance if it is by duration
  }

  //remove a drug from prescription - require to be prescriber
  function removeDrug(uint _prescriptionKey, uint _drugKey) public onlyPrescriber {
    require(prescriptionStructs[_prescriptionKey].valid, "Prescription is no longer valid"); //require rx to be valid
    prescriptionStructs[_prescriptionKey].drugStructs[_drugKey].valid = false;
  }

  //update a drug in prescription - require to be prescriber
  function updateDrug(uint _prescriptionKey, uint _drugKey, string memory _drugName, string memory _strength, string memory _dosing, uint _duration, uint _quantity) public onlyPrescriber {
    require(prescriptionStructs[_prescriptionKey].valid, "Prescription is no longer valid"); //require rx to be valid
    Drug storage d = prescriptionStructs[_prescriptionKey].drugStructs[_drugKey];
    d.name = _drugName;
    d.strength = _strength;
    d.dosing = _dosing;
    d.duration = _duration;
    d.quantity = _quantity;
    d.modified = true;
    d.balance = _quantity;
    //balance if it is by duration
  }

  //dispense a drug in prescription - require to be pharmacist
  function dispenseDrug(uint _prescriptionKey, uint _drugKey, uint _dispensedQuantity, uint _dispensedDuration) public onlyPharmacist {
    require(prescriptionStructs[_prescriptionKey].valid, "Prescription is no longer valid"); //require rx to be valid
    dispenseCount = prescriptionStructs[_prescriptionKey].drugStructs[_drugKey].dispenseCounter;
    dispenseCount++; //+1 to dispense counter
    prescriptionStructs[_prescriptionKey].drugStructs[_drugKey].dispenseCounter = dispenseCount; //update dispense coumter

    //conditions to check if quantity or duration is selected
    Dispense storage dp = prescriptionStructs[_prescriptionKey].drugStructs[_drugKey].dispenseStructs[dispenseCount];
    dp.dispensedDate = block.timestamp;
    dp.dispensedQuantity = _dispensedQuantity;
    dp.dispensedDuration = _dispensedDuration;
    dp.dispensed = true;

    uint _quantity = prescriptionStructs[_prescriptionKey].drugStructs[_drugKey].quantity;
    prescriptionStructs[_prescriptionKey].drugStructs[_drugKey].balance = _quantity - _dispensedQuantity;
    //balance if dispensing by duration
  }

  //check if prescription is valid
  function checkValid(uint _prescriptionKey) public {
    uint _nowDate = block.timestamp;
    if (_nowDate - prescriptionStructs[_prescriptionKey].date > 31536000) {
      //if prescription is more than 1 year old
      prescriptionStructs[_prescriptionKey].valid = false;
    } else {
      prescriptionStructs[_prescriptionKey].valid = true;
    }
  }

  //review prescription - require to be pharmacist
  function reviewPrescription(uint _prescriptionKey) public onlyPharmacist {
    prescriptionStructs[_prescriptionKey].reviewed = true;
  }

  //check for changes in drugs prescribed from another prescription - runs after getPrescriptionDrugs
  function checkChanges(uint _prescriptionKey, string memory _drugName) public view returns (uint, string memory, string memory, string memory) {
    uint _drugKey; //drug key of similar drug in other prescription
    string memory _name; //name of drug
    string memory _strength; //strength of drug
    string memory _dosing; //dosing of drug

    if (prescriptionStructs[_prescriptionKey].drugNames[_drugName] > 0) { //if _drugName exists in another prescription, drug key is >0
      _drugKey = prescriptionStructs[_prescriptionKey].drugNames[_drugName];
      _name = prescriptionStructs[_prescriptionKey].drugStructs[_drugKey].name;
      _strength = prescriptionStructs[_prescriptionKey].drugStructs[_drugKey].strength;
      _dosing = prescriptionStructs[_prescriptionKey].drugStructs[_drugKey].dosing;
    }
    return (_drugKey, _name, _strength, _dosing);
  }

  //remove prescription - require to be prescriber
  function removePrescription(uint _prescriptionKey) public onlyPrescriber {
    prescriptionStructs[_prescriptionKey].valid = false;
  }

  //remove prescriber - require to be admin
  function removePrescriber(address _addr) public onlyAdmin {
    prescriberStructs[_addr].valid = false;
  }

  //remove prescriber - require to be admin
  function removePatient(address _addr) public onlyAdmin {
    patientStructs[_addr].valid = false;
  }

  //remove prescriber - require to be admin
  function removePharmacist(address _addr) public onlyAdmin {
    pharmacistStructs[_addr].valid = false;
  }

  //retrieving admin
  function getAdmin() public view returns (address) {
    return admin;
  }

  //get list of patient addr
  function getPatientList() public view returns (address[] memory) {
    return patientList;
  }

  //get list of prescriber addr
  function getPrescriberList() public view returns (address[] memory) {
    return prescriberList;
  }

  //get list of pharmacist addr
  function getPharmacistList() public view returns (address[] memory) {
    return pharmacistList;
  }

  //get list of prescription
  function getPrescriptionList() public view returns (uint[] memory) {
    return prescriptionList;
  }

  //get prescriber name from addr
  function getPrescriberName(address _addr) public view returns (string memory) {
    return prescriberStructs[_addr].name;
  }

  //get list of patient prescriptions
  function getPatientPrescrptionList(address _addr) public view returns (uint[] memory) {
    return patientStructs[_addr].prescriptionList;
  }

  //get overview of patient's prescription
  function getPatientPrescrptionOverview(uint _prescriptionKey) public view returns (uint, string memory, string memory, bool, bool) {
    uint _date; //date of Rx
    string memory _prescriberName; //name of prescriber
    string memory _prescriberClinic; //name of prescriber
    bool _valid; //valid status
    bool _reviewed; //reviewed status

    _date = prescriptionStructs[_prescriptionKey].date;
    _prescriberName = prescriptionStructs[_prescriptionKey].prescriberDetails.name;
    _prescriberClinic = prescriptionStructs[_prescriptionKey].prescriberDetails.clinicName;
    _valid = prescriptionStructs[_prescriptionKey].valid;
    _reviewed = prescriptionStructs[_prescriptionKey].reviewed;

    return (_date, _prescriberName, _prescriberClinic, _valid, _reviewed);
  }

   //get prescribed drug keys
  function getPrescriptionDrugKeys(uint _prescriptionKey) public view returns (uint[] memory) {
    uint[] memory  _drugKeys = prescriptionStructs[_prescriptionKey].drugList;
    return _drugKeys;
  }

  //get drug details part 1 - name, stength, dosing, duration/quantity
  function getPrescriptionDrugDetailsPart1(uint _prescriptionKey, uint _drugKey) public view returns (string memory, string memory, string memory, uint, uint) {
    string memory _name; //drug name
    string memory _strength;
    string memory _dosing;
    uint _duration;
    uint _quantity;

    Prescription storage p = prescriptionStructs[_prescriptionKey];
    Drug storage d = p.drugStructs[_drugKey];

    _name = d.name;
    _strength = d.strength;
    _dosing = d.dosing;
    _duration = d.duration;
    _quantity = d.quantity;

    return (_name, _strength, _dosing, _duration, _quantity);
  }

  //get drug details part 2 - modified and valid status, dispensed counter and balance
  function getPrescriptionDrugDetailsPart2(uint _prescriptionKey, uint _drugKey) public view returns (bool, uint, uint, bool) {
    bool _modified;
    uint _dispenseCounter;
    uint _balance;
    bool _valid;

    Prescription storage p = prescriptionStructs[_prescriptionKey];
    Drug storage d = p.drugStructs[_drugKey];

    _modified = d.modified;
    _dispenseCounter = d.dispenseCounter;
    _balance = d.balance;
    _valid = d.valid;

    return (_modified, _dispenseCounter, _balance, _valid);
  }

  //get dispensed details - date, quantity, duration, dispensed status
  function getDispensedDetails(uint _prescriptionKey, uint _drugKey, uint _dispenseCounter) public view returns (uint, uint, uint, bool) {
    uint _dispensedDate;
    uint _dispensedQuantity;
    uint _dispensedDuration;
    bool _dispensed;

    Prescription storage p = prescriptionStructs[_prescriptionKey];
    Drug storage d = p.drugStructs[_drugKey];
    Dispense storage dp = d.dispenseStructs[_dispenseCounter];

    _dispensedDate = dp.dispensedDate;
    _dispensedQuantity = dp.dispensedQuantity;
    _dispensedDuration = dp.dispensedDuration;
    _dispensed = dp.dispensed;

    return (_dispensedDate, _dispensedQuantity, _dispensedDuration, _dispensed);
  }
}
