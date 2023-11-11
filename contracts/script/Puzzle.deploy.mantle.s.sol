// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Script, console2} from "forge-std/Script.sol";
import "../src/PlonkVK.sol";
import "../src/Puzzle.sol";

contract PuzzleScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        new Puzzle(UltraVerifier(0x7d693a3D72069Db9d2708c5C5d309756D03a6AC6));

        vm.stopBroadcast();
    }
}
