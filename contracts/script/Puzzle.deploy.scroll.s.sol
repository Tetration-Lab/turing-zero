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

        new Puzzle(UltraVerifier(0x65f4c8c79571ae7F856021a16CeE197C9A2Ce7Ba));

        vm.stopBroadcast();
    }
}
