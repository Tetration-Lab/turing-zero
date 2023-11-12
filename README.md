# zkVM-0

```
We build zkVM to educate people how zkVM works
```

zkVM is always such a BIG BLACK BOX where only a number of well-established protocols really know how it works, while normies just give up on reading 10k lines of those codes to understand it.

We use a high-level zk language like Noir to write VM and show that we can generate proof + verfiy program while also providing an interactive frontend for users to write their own program to use with zkVM (and solve our puzzle!)

We prioritize ease of reading code base + interactive frontend so people can easily understand the concept of program and easily turn it into ZK.

We ship two products: Turing Zero and Type5-zkEVM

### 1. Turing Zero:

##### Frontend

[Turing-Zero](turing-zero.vercel.app) is an interactive website for users to define their own program through Turing Machine, and instantly see how it runs on tape and state machine.

We provide a few puzzles for you to play around writing your own program to solve it, then you can PROVE that you actually come up with a program that solves this puzzle! (Thanks to our zk Turing Machine)

##### Circuit

We write zk-Turing Machine using Noir.

- Test circuit
  - `nargo test`
- Run Circuit with our witness example.
  - We already fill in Prover.toml & Verifier.toml as witness example.
  - `nargo verify` to verify the proof. If no error is thrown in console, then it's good.
- Run Circuit with your own witness.
  - Can just delete current Prover.toml & Verifier.toml files
  - `nargo check` to create Prover.toml & Verifier.toml for you to fill your own witness.
  - `nargo prove` to generate the proof.
  - `nargo verify` to verify the proof. If no error is thrown in console, then it's good.

Theoretically, this version of Turing Machine is the quasi one since we simulate them given a limited number of traversal through tape instead of infinite one.

### 2. Type5 zkEVM

We write simple zk-EVM with only 30 Ocodes, hence "Type5" since not compatible with anyone, but clearly show how building zkEVM is no longer BIG BLACK BOX.

##### Frontend

[Type5-zkEVM](https://t5zkevm.tetrationlab.com/) is a website where you can simulate our type5 EVM in the playground, similary to [evm.codes](https://www.evm.codes/?fork=shanghai)

We will provide the option for users to prove computation on our Type5 zkEVM directly from frontend in the future.

For now, go ahead and see how it works in Circuit below!

##### Circuit

- The way to run circuit is similar to Turing Zero above since we also use Noir here.
- Here, our witness example is to simulate when a user deposits fund.

#### Additional Info

Our [slide](https://docs.google.com/presentation/d/12PGC8Kbqlih2db5kSJf3CY4rGAtsnfdu7MQ79Y7VOwI/edit#slide=id.g299f98d3e12_0_18) for zkHackIII Istanbul.

#### Thanks

- Turing Zero DSL inspired by https://turingmachine.io/
- Type 5 ZKEVM inspired by EVM
- Type 5 ZKEVM site modified from https://evm.codes
- Circuit in noir, site in Next.js + React
- Powered by free coffee and food at ZKHackIII Istanbul
