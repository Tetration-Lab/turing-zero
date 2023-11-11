// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "./PlonkVK.sol";
import "forge-std/console2.sol";

struct TapePuzzle {
    address creator;
    uint256 startTape;
    uint256 endTape;
    string name;
}

contract Puzzle {
    UltraVerifier public verifier;
    uint256 currentPuzzleId = 0;
    mapping(uint256 => TapePuzzle) public puzzles;
    mapping(uint256 => address[]) public puzzleSolvers;
    mapping(address => mapping(uint256 => bool)) public solvedPuzzles;
    mapping(bytes32 => bool) public hashes;

    constructor(UltraVerifier _verifier) {
        verifier = _verifier;
    }

    function getPuzzles(
        uint limit,
        uint offset
    ) public view returns (TapePuzzle[] memory) {
        uint size = currentPuzzleId - offset > limit
            ? limit
            : currentPuzzleId - offset;
        TapePuzzle[] memory result = new TapePuzzle[](size);
        uint256 count = 0;
        for (uint256 i = offset; i < (offset + size); i++) {
            result[count] = puzzles[i];
            count++;
        }
        return result;
    }

    function createPuzzle(
        string calldata name,
        uint startTape,
        uint endTape
    ) external returns (uint256 ret) {
        puzzles[currentPuzzleId] = TapePuzzle({
            creator: msg.sender,
            startTape: startTape,
            endTape: endTape,
            name: name
        });
        ret = currentPuzzleId;
        currentPuzzleId++;
    }

    function submitPuzzle(
        uint256 puzzleId,
        uint256 finalState,
        bytes calldata proof
    ) external {
        bytes32[] memory input = new bytes32[](65);
        for (uint256 i = 0; i < 32; i++) {
            input[i] = bytes32(
                uint256(uint8(puzzles[puzzleId].startTape >> (i * 8)))
            );
        }
        for (uint256 i = 0; i < 32; i++) {
            input[i + 32] = bytes32(
                uint256(uint8(puzzles[puzzleId].endTape >> (i * 8)))
            );
        }
        input[64] = bytes32(finalState);

        // for (uint256 i = 0; i < 65; i++) {
        //     console2.log(i, uint(input[i]));
        // }

        require(verifier.verify(proof, input), "Invalid proof");
        require(!solvedPuzzles[msg.sender][puzzleId], "Puzzle already solved");
        if (!hashes[keccak256(proof)]) {
            hashes[keccak256(proof)] = true;
            puzzleSolvers[puzzleId].push(msg.sender);
            solvedPuzzles[msg.sender][puzzleId] = true;
        } else {
            revert("Proof already submitted");
        }
    }
}
