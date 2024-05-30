// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25;

import { Script, console } from "forge-std/Script.sol";
import { SimpleAccountFactory } from "../src/account/SimpleAccountFactory.sol";

contract CreateSimpleAccountFactoryScript is Script {

  SimpleAccountFactory public simpleSccountFactory;

  function setUp() public {
  }

  function run() public {
    uint256 deployerPrivateKey = vm.envUint("ADMIN_PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);
    simpleSccountFactory = new SimpleAccountFactory();
    vm.stopBroadcast();
    console.log("SimpleAccountFactory address: ", address(simpleSccountFactory));
  }
}

