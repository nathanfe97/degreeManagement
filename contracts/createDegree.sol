pragma solidity ^0.5.0;
import "./degree.sol";
contract createDegree {

    uint public degreeCount;
    string public adminpass ="admin1234";
    event createLog(string _name,uint fee,string time,address addr,address maker);

    struct degreeStruct {
        address maker;
        address owner;
        string school;
        string major;
        string name;
        string dateOfBirth;
        string yearOfGraduation;
        string graduatedClassification;
    }
    
    mapping(uint => degreeStruct) public degrees;
    mapping(uint => address) public degreeAddress;
    
    function newDegree(address payable _owner, string memory _school, string memory _major,
        string memory _name, string memory _dateOfBirth ,string memory _yearOfGraduation, string memory _graduatedClassification,string memory _time) public{
        degree oneNewDegree = new degree(msg.sender, _owner, _school, _major, _name, _dateOfBirth, _yearOfGraduation, _graduatedClassification);
        degreeCount++;
        degrees[degreeCount] = degreeStruct(msg.sender, _owner, _school, _major, _name, _dateOfBirth, _yearOfGraduation, _graduatedClassification);
        degreeAddress[degreeCount] = address(oneNewDegree);
        emit createLog(_name,gasleft(),_time,address(oneNewDegree),msg.sender);
    }
}