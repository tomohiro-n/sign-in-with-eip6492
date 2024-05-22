// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25;

import { PackedUserOperation } from "../UserOperation.sol";

interface IAccount {
  function validateUserOp(
    PackedUserOperation calldata userOp,
    bytes32 userOpHash,
    uint256 missingAccountFunds
  ) external returns (uint256 validationData);
}
