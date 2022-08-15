let Crowdfund = artifacts.require("Crowdfund");

contract("Crowdfund", (accounts) => {
  it("Contract should be deployed", async () => {
    let contract = await Crowdfund.deployed();
    assert(contract !== undefined, "Contract instance is undefined");
  });

  it("User should be able to create new account", async () => {
    let contract = await Crowdfund.deployed();
    await contract.createAccount(accounts[0]);
    await contract.createAccount(accounts[1]);
    await contract.createAccount(accounts[2]);
    await contract.createAccount(accounts[3]);
    let newAccount = await contract.retrieveAccount(accounts[0]);
    assert(newAccount !== undefined, "Account not created");
  });

  it("User should be able to create a goal", async () => {
    let contract = await Crowdfund.deployed();
    let time = new Date().getTime();
    let timeInSeconds = Math.floor(time / 1000);
    let goalsCountOld = await contract.retrieveGoalsCount(accounts[0]);
    let { logs } = await contract.createGoal(
      accounts[0],
      web3.utils.toWei("3", "ether"),
      timeInSeconds + 100,
      "EasyBank Food Drive",
      "It’s time for EasyBank’s annual food drive, a program that aims to provide stable source of food for local communities in need.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat rhoncus odio et fermentum. Aliquam egestas, nulla nec ultrices pharetra, erat quam convallis sem, non ultricies libero turpis eu nisi. Nullam sed rutrum urna, eget porttitor felis. Phasellus feugiat diam nec ullamcorper pharetra. Curabitur metus velit, suscipit vitae metus a, blandit iaculis enim. Pellentesque eu arcu posuere, volutpat tellus in, porta erat. Nulla facilisi. Phasellus venenatis mauris at neque porta tincidunt. Etiam pretium id felis et maximus. Donec posuere in felis et tempor. Nulla facilisi.",
      ""
    );

    let goalId = logs[0].args._goalId.valueOf();
    let goalsCountNew = await contract.retrieveGoalsCount(accounts[0]);

    let newGoal = await contract.retrieveGoal(goalId);
    assert(
      newGoal["10"] !== false && goalsCountOld < goalsCountNew,
      "User can't create a goal"
    );
  });

  it("User should be able to donate to active goal", async () => {
    let contract = await Crowdfund.deployed();
    let goalsHelpedCountOld = await contract.retrieveGoalsHelpedCount(
      accounts[1]
    );

    let amount = web3.utils.toWei("1", "ether");
    let goalId = 0;
    let funderAddressesCountOld = await contract.retrieveFunderAddressesCount(
      goalId
    );

    await contract.fundGoal(goalId, {
      from: accounts[1],
      value: amount,
    });

    let goalsHelpedCountNew = await contract.retrieveGoalsHelpedCount(
      accounts[1]
    );
    let funderAddressesCountNew = await contract.retrieveFunderAddressesCount(
      goalId
    );

    let goal = await contract.retrieveGoal(goalId);

    assert(
      amount === goal["9"].toString() &&
        goalsHelpedCountOld < goalsHelpedCountNew &&
        funderAddressesCountOld < funderAddressesCountNew,
      "User can't donate to active goal"
    );
  });

  it("Goal owner should receive funds if goal is completed", async () => {
    let contract = await Crowdfund.deployed();
    let amount = web3.utils.toWei("2", "ether");
    let goalId = 0;

    let ownerOldBalance = await web3.eth.getBalance(accounts[0]);

    await contract.fundGoal(goalId, {
      from: accounts[1],
      value: amount,
    });

    let ownerNewBalance = await web3.eth.getBalance(accounts[0]);
    let goal = await contract.retrieveGoal(goalId);

    let goalFunds = goal["9"].toString();
    let ownerFunds = (ownerNewBalance - ownerOldBalance).toString();

    assert(ownerFunds === goalFunds, "Funds haven't been sent");
  });

  it("Users should get refund if deadline of active goal is reached", async () => {
    let contract = await Crowdfund.deployed();
    let time = new Date().getTime();
    let timeInSeconds = Math.floor(time / 1000);
    let goalId = 1;
    await contract.createGoal(
      accounts[0],
      web3.utils.toWei("3", "ether"),
      timeInSeconds + 1,
      "EasyBank Food Drive",
      "It’s time for EasyBank’s annual food drive, a program that aims to provide stable source of food for local communities in need.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat rhoncus odio et fermentum. Aliquam egestas, nulla nec ultrices pharetra, erat quam convallis sem, non ultricies libero turpis eu nisi. Nullam sed rutrum urna, eget porttitor felis. Phasellus feugiat diam nec ullamcorper pharetra. Curabitur metus velit, suscipit vitae metus a, blandit iaculis enim. Pellentesque eu arcu posuere, volutpat tellus in, porta erat. Nulla facilisi. Phasellus venenatis mauris at neque porta tincidunt. Etiam pretium id felis et maximus. Donec posuere in felis et tempor. Nulla facilisi.",
      ""
    );

    let amount = web3.utils.toWei("1", "ether");

    await contract.fundGoal(goalId, { from: accounts[1], value: amount });
    await contract.fundGoal(goalId, { from: accounts[2], value: amount });

    let account1OldBalance = await web3.eth.getBalance(accounts[1]);
    let account2OldBalance = await web3.eth.getBalance(accounts[2]);

    await new Promise((r) => setTimeout(r, 6000));

    await contract.refundFunders(goalId);

    let account1NewBalance = await web3.eth.getBalance(accounts[1]);
    let account2NewBalance = await web3.eth.getBalance(accounts[2]);

    let account1Refund = (account1NewBalance - account1OldBalance).toString();
    let account2Refund = (account2NewBalance - account2OldBalance).toString();

    assert(
      account1Refund === amount && account2Refund === amount,
      "Refunds haven't been given to funders"
    );
  });

  it("User should be able to edit profile", async () => {
    let contract = await Crowdfund.deployed();
    let username = "BOOOB";
    let picture = "IPFS Hash Something";
    await contract.updateAccount(accounts[1], username, picture);
    let account = await contract.retrieveAccount(accounts[1]);

    assert(
      account[1] === username && account[2] === picture,
      "User input doesn't match user profile"
    );
  });

  it("User can't fund a goal without an account", async () => {
    let contract = await Crowdfund.deployed();
    let goalId = 0;
    let err = null;

    try {
      await contract.fundGoal(goalId, {
        from: accounts[8],
        value: web3.utils.toWei("2", "ether"),
      });
    } catch (e) {
      err = e;
    }

    assert(
      (err.data.reason = "Account doesn't exist"),
      "User is able to fund goal without an account"
    );
  });

  it("User can't fund a goal that doesn't exist", async () => {
    let contract = await Crowdfund.deployed();
    let goalId = 1000;
    let err = null;

    try {
      await contract.fundGoal(goalId, {
        from: accounts[0],
        value: web3.utils.toWei("1", "ether"),
      });
    } catch (e) {
      err = e;
    }

    assert(
      err.data.reason === "Goal doesn't exist",
      "User can fund a goal that doesn't exist"
    );
  });

  it("User can't fund their own goal", async () => {
    let contract = await Crowdfund.deployed();
    let time = new Date().getTime();
    let timeInSeconds = Math.floor(time / 1000);
    let { logs } = await contract.createGoal(
      accounts[0],
      web3.utils.toWei("3", "ether"),
      timeInSeconds + 1,
      "EasyBank Food Drive",
      "It’s time for EasyBank’s annual food drive, a program that aims to provide stable source of food for local communities in need.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat rhoncus odio et fermentum. Aliquam egestas, nulla nec ultrices pharetra, erat quam convallis sem, non ultricies libero turpis eu nisi. Nullam sed rutrum urna, eget porttitor felis. Phasellus feugiat diam nec ullamcorper pharetra. Curabitur metus velit, suscipit vitae metus a, blandit iaculis enim. Pellentesque eu arcu posuere, volutpat tellus in, porta erat. Nulla facilisi. Phasellus venenatis mauris at neque porta tincidunt. Etiam pretium id felis et maximus. Donec posuere in felis et tempor. Nulla facilisi.",
      ""
    );

    let goalId = parseInt(logs[0].args._goalId.toString());
    let err = null;

    try {
      await contract.fundGoal(goalId, {
        from: accounts[0],
        value: web3.utils.toWei("2", "ether"),
      });
    } catch (e) {
      err = e;
    }

    assert(
      err.data.reason === "Message sender is goal's owner",
      "User is able to fund own goal"
    );
  });

  it("User can't send funds of incomplete goal to goal's owner", async () => {
    let contract = await Crowdfund.deployed();
    let goalId = 2;
    let err = null;

    try {
      await contract.sendFunds(goalId);
    } catch (e) {
      err = e;
    }

    assert(
      err.data.reason === "Funds can only be sent once goal has been reached",
      "User can send funds of incomplete goal to goal's owner"
    );
  });
});
