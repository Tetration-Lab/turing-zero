// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "forge-std/Test.sol";
import "../src/PlonkVK.sol";
import "../src/Puzzle.sol";

contract PuzzleTest is Test {
    Puzzle puzzle;

    function setUp() public {
        UltraVerifier verifier = new UltraVerifier();
        puzzle = new Puzzle(verifier);
    }

    function test_e2e() public {
        uint256 id = puzzle.createPuzzle(
            "Test",
            11462670824895405896872932742789975210272489472,
            5731466421158967509744899770618848835897655296
        );
        puzzle.submitPuzzle(
            id,
            2,
            hex"0a46e335b3b2e8ef689acf8b82c121c2ed885e64284c064b33c43f4314d3182a0b55bcb8c901eddece4714f0d65e8572e2a7ceff5520c3b75c84e1a33eae5aa90ca0dc1cf59b3fdc87e99ae995bb8c9736349fc1dffefac79f4e9d4d0db7f1162837f0697fb8d660fe9d2c921c1767922ef54b2822bda4a6edc67ee79f393de6092a124ec1bf50ab68a47d318d998adacea5a3849bec86b4f4dac88d56fff8572d2c8c85b2ab132ed8681b7b8c5344da71897afc68eb9d416bae165079c8a31000a9ea6494b8e2341c79ce5c8662d6b3395fe9a2e405f56b6daf8e1ab9cdab5b1b647ddb1753f698eb69ed240917bd0cbb69e004ff4c18dcf2904e3161cbc9d21fc0f8bd496938ae23ee78efdd69b496e6164f4493a59063680385c3964f5f0e167e7b83ceeb432a6eb5a24d1062dbc9d8c5cb071d50c09a57c97327eabec3cf2adc7d067c793b4f0709842b8c35425863d876f2cf994bdfa963bdee96dbd49f2524f650a49219efd50e97648dce72aae509aa425a83e8712432f0a97d51731d0c91f916736ccc54ca357df8e5b6ad4d1367ece1a7822e96034674df9a92421630050f9c799c8892c31eb0935182aa0196893718f45715b1a1401b9e021c1f682db11360c24c35f38b7c8b4ea3b1bda0831475df2cbe763d0c54d1fd6bdb96081777bc9b155fa594e73122cf19684af5acac3ddcc3df8c70a135d94164307c21065731fe1f072490b277eb0f6cf63ebd06e6e78b7ca66780028e6e2ded2104c002bf1f9241c6e06c873c5945ce8a4ece520ae235c10ddec25dd8b633e531e9a703c52a4372b4082813cefc190db72fa3f381f2645165ba2e9117e91a9b6bf95f09f5129ed058c4153d35db80d8dd79ecf04a6a692638e31b3a85970141419a6712a05643829779da496d2c1cdae740f8a37f28e72a2c53c46d969a5c471ca1b311660dcf24f67fc4ff10a55f066dc974e73c075bc7a05346b7d9cdf69ea1df9d14ac199aa4125041012e5da26a64fb1604c71ff38e3d283adfdbc104ae7b75c0258dd157148286d0da6916d3c0a4e4fff4b6ad7880ab9f4fc326af97b8ae24ca186358fdc64ea267609a77b019398ede25f89176529f5a602f3c876c27f169e6101679a778353881ec638e26583ab763d005485a939485f7c19b7772fa0e855618f41865f6d439b1a7f7fef82720d86018c62235dcab91184e48b372f4a9ca390619f284d26fc3215a672d02e57ea632d05f1ce2b161aa35ba381c3abb2ec5ee16ef9a3a0c5cb189c235fbe5bb6e8bbc327c36e09ad1cab13218ed548b473c3f0d2dae4ca998574487c2371c23880677caf72a6f517e1ead79d3fcb45f72926c2870cd0d4f7a08ad0e999725c483f4bcc6569e0db0c1385cf0c14282147bd35c0767886e4e8ef0385a8814f2f308c79e24ba7832210a56b33dd62cb30f93ce370f44c9705d6dfbfa3d3cc5842b66fff7e7a8a528e406032bd9c082e50db1f11905ae181aa962d782b57b7764267abe7f60e80d19cb4339e224afdb6137fa147e1afbe9049cf97f680537bad32156ae2c621a564dc51d31b0bf5bf831cfb8b54d1193fd120c558622700d4dd24e639b856eefe748597fc11df7769165e28912ab22612d4681a39ed7812bd8b725ff91ea61041945f62ddf44f20e9e925cdec72f219e4ede95c800daedd86ba378ef9ead84bd30bb44585def52ced0738d0a9d6713ceb9d83433cc7b2e23817012906b7feba2a0fe870eee0c8645f8868948cd951d100b0db948ed731656651fb3378b8ce424f0d5ba712a8fc7f39b965a79a1ec1618187a77f4f2617b8bb8f9ab0547046fc98bb8b7f175fe19141aa9c03bf0470572711acd618dfe6522a214346f8f90f0e20ae653a6f7517a7cfbd5405ab9d7212448d26945548b7955e3ec070c2c1ade4cc31d3ddcad3427a97e3b59a76cec1cb1a457d1fa2115ffb07847cb69b61da3959e36dd38026402731968c1637c890aebfc049afa4bc672ddba971111f5cea0771ff29244be5a7bb3dfde82d67194298aa224452c16a09e5b429cd83b8ddcc58c89f6c10aeae238d69be8344966a017c4f9d10e2c4151118884ec1de3cd8dc26e0bb27617a6d8b217625df5bc5bab2e774cab08f9f6658c8335f885c1766ca6b41c7b282b466d893252f2fff0877e255982bad0a3f21615024dab2a0bf3bc46d5acef457599e171b54768b6e63c5008b1ffe89516299f40f3513d90e4d857233b69cb21271137dde6e4aa91a89c7e230a669b9bda01642bb8841f10f8a173adafa73cbd3005beda8870eefb1848221cb75ea3ff62ec731656e99ec944bc76a08ecf1b3c72f5529da0d23959d7f4650afa20c774011cf48dd0f88b65a8e3ca276df6cf0592e742849938de60a6fa081f5417e86d0ad90e9c65a8bd32e03f24e429d7ca22b0d98c1b57d3830c7a636a07af427ef58a47bf6a205d21d691f484feef15a9cb59da4080cc4a3e48a76768054b8e2cd8cb359fb10f869578b3dbe8cf53a2675a83d9088a3633248726ea19092c7b66204aefe25fb6fd94f9a6be5e3f7cac23146789787cdcc3804bce02840bc79536014e95d308296d378d7a4875d7d121145c572b5af169ba43f50d7ed916121d8555dc97389b15a78ed179aeffcaa017dbc1cd7e51bed5277c4b676fd00e9f5c96bdb87872b7f829e4d4fa48e8e55d040fddbca8c50c6395ee1ad19fd11bf062955b299531600b9425871a251397dc69234ea5684f1e645fd1990dc27829416893f89ab1f0081efe66393a013e4a5bce36bf8e27d9306529b51749e51f062e201fb4da2e84f7e222f069d8850bd4a74b01b6bd76d1fe83fe04a58607c515fdb3a266e8d49612807c8d6d64aed260a49ab42a9d3a879694aad43fd6849c02311590efbf8869f3d44b742b1be7accd16c8a916df20e1bfa5f5a306f9bdd10ec9ea30591c614b2c232bdebf1cd5c2fbe40bd5771fc5622db3c4cca6ce69ab1768cc666fcede9b9d36f979e44b5404d87edbaafe316cf46f6e73b75956f284"
        );
    }
}
