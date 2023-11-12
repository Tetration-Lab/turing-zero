# Turing-Zero

Building Turing Machine and type5 zkEVM to educate people how ZKVM works!

[Slide](https://docs.google.com/presentation/d/12PGC8Kbqlih2db5kSJf3CY4rGAtsnfdu7MQ79Y7VOwI/edit#slide=id.g299f98d3e12_0_18)

Turing Zero:

- Simple Turing Machine using Noir (choose Noir due to ease of reading code)
- Test circuit <br/>
  `nargo test`
- Run Circuit with our example witness.<br/>
  We already fill in Prover.toml & Verifier.toml as example.<br/>
  `nargo verify` to verify the proof. If no error is thrown in console, then it's good.
- Run Circuit with your own witness.<br/>
  Can just delete current Prover.toml & Verifier.toml files<br/>
  `nargo check` to create Prover.toml & Verifier.toml for you to fill your own witness.<br/>
  `nargo prove` to generate the proof.<br/>
  `nargo verify` to verify the proof. If no error is thrown in console, then it's good.

Note that this version of Turing Machine is the quasi one since we simulate them given a limited number of traversal through tape we can make instead of infinite one.

Type5 zkEVM

- Simplify EVM machine using Noir with only 30 OPCODES.
- The way to run circuit is similar to above in Turing Zero.
