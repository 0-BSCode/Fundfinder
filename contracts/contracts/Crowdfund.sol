pragma solidity >=0.4.22 <0.9.0;

contract Crowdfund {
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
    }

    struct User {
        string username;
        string picture;
        uint256 createdAt;
        uint256 activeGoalCount;
        uint256[] goals;
        bool exists;
    }

    struct Message {
        uint256 id;
        uint256 dateCreated;
        address from;
        address to;
        string goal;
        string content;
    }

    mapping(address => User) accounts;
    mapping(uint256 => Goal) goals;
    mapping(uint256 => Message) messages;

    uint256 goalNumber = 0;
    uint256 messageNumber = 0;

    function checkForAccountExistence(address _owner)
        external
        view
        returns (bool)
    {
        bool exists = false;
        if (accounts[_owner].exists) exists = true;
        return exists;
    }

    function createAccount(address _owner) external {
        User memory newUser;
        newUser.username = string(abi.encodePacked(_owner));
        newUser.createdAt = block.timestamp;
        newUser.activeGoalCount = 0;
        newUser.exists = true;

        accounts[_owner] = newUser;
    }

    function updateAccount(address _owner, string memory _userName) external {
        accounts[_owner].username = _userName;
    }

    function retrieveAccount(address _owner)
        external
        view
        returns (
            string memory,
            string memory,
            uint256,
            uint256
        )
    {
        User memory user = accounts[_owner];

        return (
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
    ) external {
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

        goals[goalNumber] = newGoal;
        accounts[_owner].goals.push(goalNumber);
        accounts[_owner].activeGoalCount++;
        goalNumber++;
    }

    function retrieveGoal(uint256 _goalId)
        external
        view
        returns (
            uint256,
            address,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            uint256,
            uint256,
            uint256,
            bool
        )
    {
        Goal memory goal = goals[_goalId];

        if (block.timestamp >= goal.deadline) goal.isActive = false;
        return (
            goal.id,
            goal.owner,
            accounts[goal.owner].username,
            goal.title,
            goal.description,
            goal.details,
            goal.picture,
            goal.deadline,
            goal.maxAmount,
            goal.currentAmount,
            goal.isActive
        );
    }

    function retrieveGoalCount(address _owner) external view returns (uint256) {
        return accounts[_owner].goals.length;
    }

    function fundGoal(uint256 _goalId, uint256 _amount) external payable {
        require(
            goals[_goalId].isActive,
            "This goal is no longer accepting funds"
        );
        goals[_goalId].currentAmount += _amount;
        checkForFundCompletion(_goalId);

        if (!goals[_goalId].isActive) {
            sendFunds(_goalId);
        }
    }

    function sendFunds(uint256 _goalId) public payable {
        require(
            goals[_goalId].currentAmount >= goals[_goalId].maxAmount,
            "Funds can only be sent once goal has been reached"
        );
        address _owner = goals[_goalId].owner;
        address payable _account = payable(_owner);
        _account.transfer(goals[_goalId].currentAmount);
        accounts[_owner].activeGoalCount--;
    }

    function checkForFundCompletion(uint256 _goalId) private {
        if (goals[_goalId].currentAmount >= goals[_goalId].maxAmount) {
            goals[_goalId].isActive = false;
        }
    }
}
