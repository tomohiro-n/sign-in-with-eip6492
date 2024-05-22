// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25;

import { UniversalSigValidator } from "./UniversalSigValidator.sol";

/**
 * @dev Adapted from "ERC-6492: Signature Validation for Predeploy Contracts," Ethereum Improvement Proposals, no. 6492, February 2023. [Online serial]. Available: https://eips.ethereum.org/EIPS/eip-6492.
 */
contract ValidateSigOffchain {
  constructor (address _signer, bytes32 _hash, bytes memory _signature) {
    UniversalSigValidator validator = new UniversalSigValidator();
    bool isValidSig = validator.isValidSigWithSideEffects(_signer, _hash, _signature);
    assembly {
      mstore(0, isValidSig)
      return(31, 1)
    }
  }
}
