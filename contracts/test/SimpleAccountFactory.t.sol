// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25;

import { Test, console2 } from "forge-std/Test.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import { BeaconProxy } from "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import { SimpleAccountFactory } from "../src/account/SimpleAccountFactory.sol";
import { SimpleAccount } from "../src/account/SimpleAccount.sol";

contract SimpleAccountFactoryTest is Test {
  
  event AccountInitialized(address indexed owner);
  
  string constant mnemonic = "test test test test test test test test test test test junk";
  
  uint256 adminKey;
  address admin;
  
  uint256 account1OwnerKey;
  address account1Owner;

  uint256 account2OwnerKey;
  address account2Owner;

  SimpleAccountFactory public simpleSccountFactory;

  function setUp() public {
    adminKey = vm.deriveKey(mnemonic, 0);
    account1OwnerKey = vm.deriveKey(mnemonic, 1);
    account2OwnerKey = vm.deriveKey(mnemonic, 2);
    
    admin = vm.addr(adminKey);
    account1Owner = vm.addr(account1OwnerKey);
    account2Owner = vm.addr(account2OwnerKey);

    vm.prank(admin);
      simpleSccountFactory = new SimpleAccountFactory();
  }

  function test_createAccount() public {
    // execution and event checks
    vm.prank(account1Owner);
    vm.expectEmit(true, false, false, false);
    emit AccountInitialized(account1Owner);
    address account1 = simpleSccountFactory.createAccount(account1Owner, "salt1");
    
    vm.prank(account2Owner);
    vm.expectEmit(true, false, false, false);
    emit AccountInitialized(account2Owner);
    address account2 = simpleSccountFactory.createAccount(account2Owner, "salt2");
    
    // account owner checks
    assertEq(SimpleAccount(account1).owner(), account1Owner);
    assertEq(SimpleAccount(account2).owner(), account2Owner);

    // address check
    bytes memory account1Bytecode = abi.encodePacked(
      type(BeaconProxy).creationCode,
      abi.encode(
        address(simpleSccountFactory.upgradeableBeacon()),
        abi.encodeCall(SimpleAccount.initialize, (account1Owner))    
      )
    );
    assertEq(
      account1,
      Create2.computeAddress(
        "salt1",
        keccak256(account1Bytecode),
        address(simpleSccountFactory)
      )
    );
  }
}
