use dep::std::collections::vec::Vec;

global SIZE = 20;
global CODE_SIZE = 100;
global MAX_CYCLES = 100;
global STACK_SIZE = 8;

fn main(state_init: pub [u8;SIZE], state_end: [u8;SIZE], calldata: [u8;SIZE], call_value:u8, code: [u8;CODE_SIZE], block:u8, bal_start:u8, bal_end:u8, caller:u8, return_val:u8) {
    let mut mem: [u8; SIZE]= [0; SIZE];
    let mut counter: u8 = 0;
    let mut state: [u8; SIZE] = state_init;
    let mut bal:u8 = bal_start + call_value;
    let mut stack: [u8;STACK_SIZE+1] = [0; STACK_SIZE+1]; // stack[0] is buffer
    let mut stack_counter: u8 = 1;


    for _ in 1..MAX_CYCLES{
        let op = code[counter];

        // return return_val
        if op == 0 { 
            let val = stack[stack_counter];
            assert(val == return_val);
            counter -= 1; // this simply make the program stuck here lol
            // don't move stack counter
        } 

        // add VAL1 VAL2 -> VAL1+VAL2
        if op == 1 { 
            let val1 = stack[stack_counter];
            let val2 = stack[stack_counter];
            stack_counter -= 1;
            stack[stack_counter] = val1 + val2;
        }

        // sub VAL1 VAL2 -> VAL1-VAL2
        if op == 2 { 
            let val1 = stack[stack_counter];
            let val2 = stack[stack_counter];
            stack_counter -= 1;
            stack[stack_counter] = val1 - val2;
        }
        
        // mul VAL1 VAL2 -> VAL1*VAL2
        if op == 3 { 
            let val1 = stack[stack_counter];
            let val2 = stack[stack_counter];
            stack_counter -= 1;
            stack[stack_counter] = val1 * val2;
        }

        // div VAL1 VAL2 -> VAL1/VAL2
        if op == 4 { 
            
            let val1 = stack[stack_counter];
            let val2 = stack[stack_counter];
            stack_counter -= 1;
            stack[stack_counter] = val1 / val2;
        }

        // mod VAL1 VAL2 -> VAL1%VAL2
        if op == 5 { 
            let val1 = stack[stack_counter];
            let val2 = stack[stack_counter];
            stack_counter -= 1;
            stack[stack_counter] = val1 % val2;
        }

        // lt VAL1 VAL2 -> VAL1<VAL2
        if op == 6 { 
            let val1 = stack[stack_counter];
            let val2 = stack[stack_counter];
            stack_counter -= 1;
            stack[stack_counter] = 0 + (val1 < val2) as u8;
        }
        
        // gt VAL1 VAL2 -> VAL1>VAL2
        if op == 7 { 
            let val1 = stack[stack_counter];
            let val2 = stack[stack_counter];
            stack_counter -= 1;
            stack[stack_counter] = 0 + (val1 > val2) as u8;
        }
        // eq VAL1 VAL2 -> VAL1==VAL2
        if op == 8 { 
            
            let val1 = stack[stack_counter];
            let val2 = stack[stack_counter];
            stack_counter -= 1;
            stack[stack_counter] = 0 + (val1 == val2) as u8;
        }
        
        // iszero VAL1 -> VAL1==0
        if op == 9 { 
            
            let val1 = stack[stack_counter];
            stack[stack_counter] = 0 + (val1 == 0) as u8;
        }
        
        // and VAL1 VAL2 -> VAL1&VAL2
        if op == 10 { 
            let val1 = stack[stack_counter];
            let val2 = stack[stack_counter];
            stack_counter -= 1;
            stack[stack_counter] = val1 & val2;
        }

        // or VAL1 VAL2 -> VAL1|VAL2
        if op == 11 { 
            let val1 = stack[stack_counter];
            let val2 = stack[stack_counter];
            stack_counter -= 1;
            stack[stack_counter] = val1 | val2;
        }
        // xor VAL1 VAL2 -> VAL1^VAL2
        if op == 12 { 
            let val1 = stack[stack_counter];
            let val2 = stack[stack_counter];
            stack_counter -= 1;
            stack[stack_counter] = val1 ^ val2;
        }
        
        // not VAL1 -> ~VAL1
        if op == 13 { 
            let val1 = stack[stack_counter];
            stack[stack_counter] = !val1;
        }

        // balance [x] -> BAL
        if op == 14 { 
            stack_counter += 1;
            stack[stack_counter] = bal;
        }

        // caller [x] -> CALLER
        if op == 15 { 
            stack_counter += 1;
            stack[stack_counter] = caller;
        }

        // callvalue [x] -> CALLVALUE
        if op == 16 { 
            stack_counter += 1;
            stack[stack_counter] = call_value;
        }

        // calldataload idx -> CALLDATA[idx]
        if op == 17 { 
            let idx = stack[stack_counter];
            stack[stack_counter] = calldata[idx];
        }

        // blocknumber [x] -> BLOCKNUMBER
        if op == 18 { 
            stack_counter += 1;
            stack[stack_counter] = block;
        }

        // pop VAL1 -> _
        if op == 19 { 
            stack_counter -= 1;
        }

        // mload idx -> MEM[idx]
        if op == 20 { 
            let idx = stack[stack_counter];
            stack[stack_counter] = mem[idx];
        }

        // mstore idx VAL1 -> MEM[idx]=VAL1
        if op == 21 { 
            let idx = stack[stack_counter];
            let val1 = stack[stack_counter];
            mem[idx] = val1;
            stack_counter -= 2;
        }

        // sload idx -> STATE[idx]
        if op == 22 { 
            let idx = stack[stack_counter];
            stack[stack_counter] = state[idx];
        }

        // sstore idx VAL1 -> STATE[idx]=VAL1
        if op == 23 { 
            let idx = stack[stack_counter];
            let val1 = stack[stack_counter];
            state[idx] = val1;
            stack_counter -= 2;
        }

        // jump idx -> JUMP idx
        if op == 24 { 
            // YOLO - ops to short to check for jumpdest or anythign lol
            let idx = stack[stack_counter];
            counter = idx;
            stack_counter -= 1;
        }

        // jumpi idx VAL1 -> if VAL1 { JUMP idx }
        if op == 25 { 
            let idx = stack[stack_counter];
            let val1 = stack[stack_counter];
            counter = counter * (val1 == 0) as u8 + idx * (val1 != 0) as u8;
            stack_counter -= 2;
        }

        // push [Val] -> VAL
        if op == 26 { 
            let val = code[counter+1];
            counter += 1;
            stack_counter += 1;
            stack[stack_counter] = val;
        }

        // dup VAL1 -> VAL1 VAL1
        if op == 27 { 
            let val1 = stack[stack_counter];
            stack_counter += 1;
            stack[stack_counter] = val1;
        }

        // swap VAL1 VAL2 -> VAL2 VAL1
        if op == 28 { 
            let val1 = stack[stack_counter];
            let val2 = stack[stack_counter];
            stack[stack_counter] = val1;
            stack[stack_counter] = val2;
        }

        // revert [x] -> REVERT
        if op == 29 { 
            assert(false);
        }

        counter += 1;
        assert(stack_counter > 0);
    }



    // check end state
    // reach defined end state
    for i in 0..SIZE {
        assert(state[i] == state_end[i]);
    }
    // reach defined end balance
    assert(bal == bal_end);
    // reach return opcode
    assert(code[counter] == 0);
}

#[test]
fn test_main() {
}
