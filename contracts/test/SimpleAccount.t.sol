// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25;

import { Test, console2 } from "forge-std/Test.sol";
import { SimpleAccount } from "../src/account/SimpleAccount.sol";

contract SimpleAccountTest is Test {

  string constant mnemonic = "test test test test test test test test test test test junk";
  
  uint256 signerKey;
  address signer;
  
  function setUp() public {
    signerKey = vm.deriveKey(mnemonic, 0);
    signer = vm.addr(signerKey);
  }
  
  function test_isValidSignature() public {
    vm.startPrank(signer);
    SimpleAccount simpleAccount = new SimpleAccount();
    simpleAccount.initialize(signer);
    bytes32 hash = keccak256("test");
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerKey, hash);
    bytes memory signature = abi.encodePacked(r, s, v);
    assertEq(
      simpleAccount.isValidSignature(hash, signature),
      bytes4(0x1626ba7e)
    );
    vm.stopPrank();
  }
}
