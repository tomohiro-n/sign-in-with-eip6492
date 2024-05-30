// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25;

import { Script, console } from "forge-std/Script.sol";
import { SimpleAccountFactory } from "../src/account/SimpleAccountFactory.sol";

contract CreateSimpleAccountScript is Script {

  SimpleAccountFactory public simpleSccountFactory;

  function isContract(address addr) internal view returns (bool) {
    uint256 size;
    assembly {
        size := extcodesize(addr)
    }
    return size > 0;
}

  function setUp() public {
    address simpleSccountFactoryAddress = vm.envAddress("SIMPLE_ACCOUNT_FACTORY_ADDRESS");
    if(isContract(simpleSccountFactoryAddress)) {
      simpleSccountFactory = SimpleAccountFactory(simpleSccountFactoryAddress);
    } else {
      uint256 deployerPrivateKey = vm.envUint("ADMIN_PRIVATE_KEY");
      vm.startBroadcast(deployerPrivateKey);
      simpleSccountFactory = new SimpleAccountFactory();
      vm.stopBroadcast();
    }
  }

  function run() public {
    uint256 accountOwnerPrivateKey = vm.envUint("ACCOUNT_OWNER_PRIVATE_KEY");
    vm.startBroadcast(accountOwnerPrivateKey);
    address accountOwner = vm.addr(accountOwnerPrivateKey);
    address account = simpleSccountFactory.createAccount(accountOwner, "salt1");
    console.log("Account 1 address: ", account);
    console.log("Owner address: ", accountOwner);
  }
}

