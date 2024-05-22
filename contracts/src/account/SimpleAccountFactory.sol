// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/utils/Create2.sol";
import { UpgradeableBeacon } from "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import { BeaconProxy } from "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import { PackedUserOperation } from "../UserOperation.sol";
import { SimpleAccount } from "./SimpleAccount.sol";

/**
 * @author Tomohiro Nakamura - <tomo@startbahn.jp>
 */
contract SimpleAccountFactory {
  UpgradeableBeacon immutable public upgradeableBeacon;
  
  constructor() {
    address logic = address(new SimpleAccount());
    upgradeableBeacon = new UpgradeableBeacon(logic, msg.sender);
  }

  function createAccount(address owner, bytes32 salt) public returns (address accountAddress) {
    bytes memory bytecode = abi.encodePacked(
      type(BeaconProxy).creationCode,
      abi.encode(
        upgradeableBeacon,
        abi.encodeCall(SimpleAccount.initialize, (owner))    
      )
    );
    accountAddress = Create2.deploy(0, salt, bytecode);
  }
}
