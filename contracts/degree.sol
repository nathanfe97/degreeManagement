pragma solidity ^0.5.0;
contract degree{
    address payable public maker;
	address payable public owner;

    string private school;
	string private major;
	string private name;
	string private dateOfBirth;
	string private yearOfGraduation;
	string private graduatedClassification;

	constructor(address payable _maker, address payable _owner, string memory _school, string memory _major,
	    string memory _name, string memory _dateOfBirth,string memory _yearOfGraduation, string memory _graduatedClassification) public{
		maker = _maker;
		owner = _owner;
		school = _school;
		major = _major;
		name =_name;
		dateOfBirth = _dateOfBirth;
		yearOfGraduation = _yearOfGraduation;
		graduatedClassification = _graduatedClassification;
	}

	modifier onlyowner(){
        require(msg.sender == owner);
        _;
    }
	
	function payFee() payable external onlyowner {
	    require(msg.value == 1 ether);
        maker.transfer(address(this).balance);
    }
}