pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Crowdfund {
    using Strings for string;
    using SafeMath for uint256;

    event goalFunded(address indexed _from, uint256 indexed _goalId);
    event goalCompleted(uint256 indexed _goalId);
    event goalCreated(uint256 indexed _goalId);
    event refundSent(uint256 indexed _goalId);
    event debugMessage(string _message);
    event debugValue(string _description, uint256 _value);
    event debugBool(string _description, bool _bool);

    struct Goal {
        uint256 id;
        uint256 maxAmount;
        uint256 currentAmount;
        uint256 createdAt;
        uint256 deadline;
        address owner;
        string title;
        string description;
        string details;
        string picture;
        bool isActive;
        bool exists;
        address[] funderAddresses;
    }

    struct User {
        address id;
        string username;
        string picture;
        uint256 createdAt;
        uint256 activeGoalCount;
        uint256[] goals;
        uint256[] goalsHelped;
        bool exists;
    }

    mapping(address => User) accounts;
    mapping(uint256 => Goal) goals;
    mapping(uint256 => mapping(address => uint256)) goalFunders;

    uint256 goalNumber = 0;
    uint256 messageNumber = 0;

    modifier accountExists(address _owner) {
        require(accounts[_owner].exists == true, "Account doesn't exist");
        _;
    }

    modifier notOwner(address _owner) {
        require(msg.sender != _owner, "Message sender is goal's owner");
        _;
    }

    modifier goalExists(uint256 _goalId) {
        require(goals[_goalId].exists == true, "Goal doesn't exist");
        _;
    }

    modifier goalIsActive(uint256 _goalId) {
        require(goals[_goalId].isActive == true, "Goal is no longer active");
        _;
    }

    function createAccount(address _owner) external {
        require(accounts[_owner].exists == false, "Account already exists");
        User memory newUser;
        newUser.id = _owner;
        newUser.username = Strings.toHexString(uint256(uint160(_owner)), 20);
        newUser.createdAt = block.timestamp;
        newUser.activeGoalCount = 0;
        newUser.exists = true;

        accounts[_owner] = newUser;
    }

    function updateAccount(
        address _owner,
        string memory _userName,
        string memory _picture
    ) external accountExists(_owner) {
        accounts[_owner].username = _userName;
        accounts[_owner].picture = _picture;
    }

    function retrieveAccount(address _owner)
        external
        view
        accountExists(_owner)
        returns (
            address,
            string memory,
            string memory,
            uint256,
            uint256
        )
    {
        User memory user = accounts[_owner];

        return (
            user.id,
            user.username,
            user.picture,
            user.createdAt,
            user.activeGoalCount
        );
    }

    function createGoal(
        address _owner,
        uint256 _maxAmount,
        uint256 _deadline,
        string memory _title,
        string memory _description,
        string memory _details,
        string memory _picture
    ) external accountExists(_owner) {
        Goal memory newGoal;
        newGoal.id = goalNumber;
        newGoal.owner = _owner;
        newGoal.maxAmount = _maxAmount;
        newGoal.currentAmount = 0;
        newGoal.createdAt = block.timestamp;
        newGoal.deadline = _deadline;
        newGoal.title = _title;
        newGoal.description = _description;
        newGoal.details = _details;
        newGoal.picture = _picture;
        newGoal.isActive = true;
        newGoal.exists = true;

        goals[goalNumber] = newGoal;
        accounts[_owner].goals.push(goalNumber);
        accounts[_owner].activeGoalCount = accounts[_owner].activeGoalCount.add(
            1
        );
        goalNumber++;

        emit goalCreated(newGoal.id);
    }

    function retrieveGoal(uint256 _goalId)
        public
        view
        goalExists(_goalId)
        returns (
            uint256,
            address,
            string memory,
            string memory,
            string memory,
            string memory,
            uint256,
            uint256,
            uint256,
            uint256,
            bool
        )
    {
        Goal memory goal = goals[_goalId];

        return (
            goal.id,
            goal.owner,
            goal.title,
            goal.description,
            goal.details,
            goal.picture,
            goal.createdAt,
            goal.deadline,
            goal.maxAmount,
            goal.currentAmount,
            goal.isActive
        );
    }

    function retrieveGoalCount(address _owner) external view returns (uint256) {
        return accounts[_owner].goals.length;
    }

    function fundGoal(uint256 _goalId)
        external
        payable
        accountExists(msg.sender)
        goalExists(_goalId)
        goalIsActive(_goalId)
        notOwner(goals[_goalId].owner)
    {
        goals[_goalId].currentAmount = goals[_goalId].currentAmount.add(
            msg.value
        );

        if (!isRecurringFunder(msg.sender, _goalId)) {
            goals[_goalId].funderAddresses.push(msg.sender);
        }

        goalFunders[_goalId][msg.sender] = goalFunders[_goalId][msg.sender].add(
            msg.value
        );

        if (!isRecurringFundee(msg.sender, _goalId)) {
            accounts[msg.sender].goalsHelped.push(_goalId);
        }

        emit goalFunded(msg.sender, _goalId);

        if (isFundCompleted(_goalId)) {
            deactivateGoal(_goalId);
            sendFunds(_goalId);
        }
    }

    function sendFunds(uint256 _goalId) public payable {
        require(
            isFundCompleted(_goalId),
            "Funds can only be sent once goal has been reached"
        );
        address _owner = goals[_goalId].owner;
        address payable _account = payable(_owner);
        _account.transfer(goals[_goalId].currentAmount);
        emit goalCompleted(_goalId);
    }

    function refundFunders(uint256 _goalId) public payable {
        require(
            isDeadlineReached(_goalId) &&
                !isFundCompleted(_goalId) &&
                msg.sender == goals[_goalId].owner,
            "Deadline hasn't been reached yet"
        );
        address[] memory funderAddresses = goals[_goalId].funderAddresses;
        uint256 fundersCount = goals[_goalId].funderAddresses.length;
        for (uint256 i = 0; i < fundersCount; i++) {
            address payable _account = payable(funderAddresses[i]);
            _account.transfer(goalFunders[_goalId][funderAddresses[i]]);
        }

        emit refundSent(_goalId);
    }

    function deactivateGoal(uint256 _goalId) private {
        goals[_goalId].isActive = false;
        accounts[goals[_goalId].owner].activeGoalCount = accounts[
            goals[_goalId].owner
        ].activeGoalCount.sub(1);
    }

    function isDeadlineReached(uint256 _goalId) private view returns (bool) {
        bool res = false;
        if (block.timestamp >= goals[_goalId].deadline) {
            res = true;
        }
        return res;
    }

    function isFundCompleted(uint256 _goalId) private view returns (bool) {
        bool res = false;
        if (goals[_goalId].currentAmount >= goals[_goalId].maxAmount) {
            res = true;
        }

        return res;
    }

    function isRecurringFunder(address _funder, uint256 _goalId)
        private
        view
        returns (bool)
    {
        bool res = false;
        uint256 funderCount = goals[_goalId].funderAddresses.length;
        for (uint256 i = 0; i < funderCount; i++) {
            if (goals[_goalId].funderAddresses[i] == _funder) {
                res = true;
                break;
            }
        }
        return res;
    }

    function isRecurringFundee(address _funder, uint256 _goalId)
        private
        view
        returns (bool)
    {
        bool res = false;
        for (uint256 i = 0; i < accounts[_funder].goalsHelped.length; i++) {
            if (accounts[_funder].goalsHelped[i] == _goalId) res = true;
        }

        return res;
    }
}
