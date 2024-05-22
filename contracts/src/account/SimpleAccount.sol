// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25;

import { IERC1271 } from "@openzeppelin/contracts/interfaces/IERC1271.sol";
import { Initializable } from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import { IAccount } from "./IAccount.sol";
import { IAccountExecute } from "./IAccountExecute.sol";
import { PackedUserOperation } from "../UserOperation.sol";

/**
 * @author Tomohiro Nakamura - <tomo@startbahn.jp>
 * @dev An account which is simply owned by an Ethereum address.
 * Currently the owner address is thought to be an EOA but contract address should be able to be supported.
 */
contract SimpleAccount is IAccount, IAccountExecute, IERC1271, Initializable {
  
  address public owner;
  
  event AccountInitialized(address indexed owner);
  
  constructor() {
    // @todo add EntryPoint
  }
  
  function initialize(address _owner) public initializer {
    owner = _owner;
    emit AccountInitialized(owner);
  }
  
  function validateUserOp(
    PackedUserOperation calldata userOp,
    bytes32 userOpHash,
    uint256 missingAccountFunds
  ) override external returns (uint256 validationData) {
    // TODO: implement this function
  }
  
  function executeUserOp(
    PackedUserOperation calldata userOp,
    bytes32 userOpHash
  ) override external {
    // TODO: implement this function
  }
  
  function isValidSignature(bytes32 hash, bytes memory signature) override external view returns (bytes4 magicValue) {
    address recoveredAddress = ECDSA.recover(hash, signature);
    if (recoveredAddress == owner) {
      // bytes4(keccak256("isValidSignature(bytes32,bytes)")
      return 0x1626ba7e;
    } else {
      return 0xffffffff;
    }
  }
}
