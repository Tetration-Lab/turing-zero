use dep::std::collections::vec::Vec;
use dep::std;

global SIZE = 20;
global CODE_SIZE = 100;
global MAX_CYCLES = 100;



fn access(arr: [u8; SIZE], idx: u8) -> u8 {
    let mut value: u8 = 0;
    for i in 0..SIZE {
        value += (i == idx) as u8 * arr[i];
    }
    value
}

fn access_code(arr: [u8; CODE_SIZE], idx: u8) -> u8 {
    let mut value: u8 = 0;
    for i in 0..CODE_SIZE {
        value += (i == idx) as u8 * arr[i];
    }
    value
}

fn modify(mut arr: [u8; SIZE], idx: u8, value: u8) -> [u8; SIZE] {
    for i in 0..SIZE {
        arr[i] = (i == idx) as u8 * value + (i != idx) as u8 * arr[i];
    }
    arr
}

fn main(state_init: pub [u8;SIZE], state_end: [u8;SIZE], calldata: [u8;SIZE], call_value:u8, code: [u8;CODE_SIZE], block:u8, bal_start:u8, bal_end:u8, caller:u8, return_val:u8) {
    let mut mem: [u8; SIZE]= [0; SIZE];
    let mut counter: u8 = 0;
    let mut state: [u8; SIZE] = state_init;
    let mut bal:u8 = bal_start + call_value;
    let mut ret_val: u8 = 0;
    let mut stack: [u8;SIZE] = [0; SIZE]; // stack[0] is buffer
    let mut stack_counter: u8 = 3;

    for _ in 1..MAX_CYCLES{
        let op = access_code(code, counter);
        let top_stack = access(stack, stack_counter);
        let second_stack = access(stack, stack_counter - 1);
        let third_stack = access(stack, stack_counter - 2);
        let forth_stack = access(stack, stack_counter - 3);
        let mut next_stack: u8 = 0;
        let mut next_second_stack: u8 = 0;

        let mut next_mem_idx: u8 = 0;
        let mut next_mem_val: u8 = access(mem, next_mem_idx);

        let mut next_state_idx: u8 = 0;
        let mut next_state_val: u8 = access(state, next_state_idx);


        // return return_val
        if op == 0 { 
            let v = top_stack;
            assert(v == return_val);
            ret_val = v;
            // don't move stack counter
            next_stack = top_stack;
            next_second_stack = second_stack;
        } 

        // add VAL1 VAL2 -> VAL1+VAL2
        if op == 1 { 
            let val1 = top_stack;
            let val2 = second_stack;
            stack_counter -= 1;
            next_stack = val1 + val2;
            next_second_stack = third_stack;
        }

        // sub VAL1 VAL2 -> VAL1-VAL2
        if op == 2 { 
            let val1 = top_stack;
            let val2 = second_stack;
            stack_counter -= 1;
            let revert = val1 < val2;
            next_stack = val1 - val2 * (val1 >= val2) as u8;
            next_second_stack = third_stack;
            assert(revert == false);
        }
        
        // mul VAL1 VAL2 -> VAL1*VAL2
        if op == 3 { 
            let val1 = top_stack as u16;
            let val2 = second_stack as u16;
            stack_counter -= 1;
            next_stack = (val1 * val2) as u8;
            next_second_stack = third_stack;
        }

        // div VAL1 VAL2 -> VAL1/VAL2
        if op == 4 { 
            let val1 = top_stack;
            let val2 = second_stack;
            stack_counter -= 1;
            next_stack = val1 / val2;
            next_second_stack = third_stack;
        }

        // mod VAL1 VAL2 -> VAL1%VAL2
        if op == 5 { 
            let val1 = top_stack;
            let val2 = second_stack;
            stack_counter -= 1;
            next_stack = val1 % val2;
            next_second_stack = third_stack;
        }

        // lt VAL1 VAL2 -> VAL1<VAL2
        if op == 6 { 
            let val1 = top_stack;
            let val2 = second_stack;
            stack_counter -= 1;
            next_stack = 0 + (val1 < val2) as u8;
            next_second_stack = third_stack;
        }
        
        // gt VAL1 VAL2 -> VAL1>VAL2
        if op == 7 { 
            let val1 = top_stack;
            let val2 = second_stack;
            stack_counter -= 1;
            next_stack = 0 + (val1 > val2) as u8;
            next_second_stack = third_stack;
        }
        // eq VAL1 VAL2 -> VAL1==VAL2
        if op == 8 { 
            let val1 = top_stack;
            let val2 = second_stack;
            stack_counter -= 1;
            next_stack = 0 + (val1 == val2) as u8;
            next_second_stack = third_stack;
        }
        
        // iszero VAL1 -> VAL1==0
        if op == 9 { 
            let val1 = top_stack;
            next_stack = 0 + (val1 == 0) as u8;
            next_second_stack = second_stack;
        }
        
        // and VAL1 VAL2 -> VAL1&VAL2
        if op == 10 { 
            let val1 = top_stack;
            let val2 = second_stack;
            stack_counter -= 1;
            next_stack = val1 & val2;
            next_second_stack = third_stack;
        }

        // or VAL1 VAL2 -> VAL1|VAL2
        if op == 11 { 
            let val1 = top_stack;
            let val2 = stack[stack_counter -1];
            stack_counter -= 1;
            next_stack = val1 | val2;
            next_second_stack = third_stack;
        }
        // xor VAL1 VAL2 -> VAL1^VAL2
        if op == 12 { 
            let val1 = top_stack;
            let val2 = stack[stack_counter -1];
            stack_counter -= 1;
            next_stack = val1 ^ val2;
            next_second_stack = third_stack;
        }
        
        // not VAL1 -> ~VAL1
        if op == 13 { 
            let val1 = top_stack;
            next_stack = !val1;
            next_second_stack = second_stack;
        }

        // balance [x] -> BAL
        if op == 14 { 
            stack_counter += 1;
            next_stack = bal;
            next_second_stack = top_stack;
        }

        // caller [x] -> CALLER
        if op == 15 { 
            stack_counter += 1;
            next_stack = caller;
            next_second_stack = top_stack;
        }

        // callvalue [x] -> CALLVALUE
        if op == 16 { 
            stack_counter += 1;
            next_stack = call_value;
            next_second_stack = top_stack;
        }

        // calldataload idx -> CALLDATA[idx]
        if op == 17 { 
            let idx = top_stack;
            next_stack = calldata[idx];
            next_second_stack = second_stack;
        }

        // blocknumber [x] -> BLOCKNUMBER
        if op == 18 { 
            stack_counter += 1;
            next_stack = block;
            next_second_stack = top_stack;
        }

        // pop VAL1 -> _
        if op == 19 { 
            stack_counter -= 1;
            next_stack = second_stack;
            next_second_stack = third_stack;
        }

        // mload idx -> MEM[idx]
        if op == 20 { 
            let idx = top_stack;
            next_stack = access(mem, idx);
            next_second_stack = second_stack;
        }

        // mstore idx VAL1 -> MEM[idx]=VAL1
        if op == 21 { 
            let idx = top_stack;
            let val1 = stack[stack_counter -1];
            next_mem_val = val1;
            next_mem_idx = idx;
            stack_counter -= 2;
            next_stack = third_stack;
            next_second_stack = forth_stack;
        }

        // sload idx -> STATE[idx]
        if op == 22 { 
            let idx = top_stack;
            next_stack = access(state, idx);
            next_second_stack = second_stack;
        }

        // sstore idx VAL1 -> STATE[idx]=VAL1
        if op == 23 { 
            let idx = top_stack;
            let val1 = second_stack;
            next_state_val = val1;
            next_state_idx = idx;
            stack_counter -= 2;
            next_stack = third_stack;
            next_second_stack = forth_stack;
        }

        // jump idx -> JUMP idx
        if op == 24 { 
            // YOLO - ops to short to check for jumpdest or anythign lol
            let idx = top_stack;
            counter = idx;
            stack_counter -= 1;
            next_stack = second_stack;
            next_second_stack = third_stack;
        }

        // jumpi idx VAL1 -> if VAL1 { JUMP idx }
        if op == 25 { 
            let idx = top_stack;
            let val1 = second_stack;
            counter = (counter + 1) * (val1 == 0) as u8 + idx * (val1 != 0) as u8;
            stack_counter -= 2;
            next_stack = third_stack;
            next_second_stack = forth_stack;
        }

        // push [Val] -> VAL
        if op == 26 { 
            let val = code[counter+1];
            counter += 1;
            stack_counter += 1;
            next_stack = val;
            next_second_stack = top_stack;
        }

        // dup VAL1 -> VAL1 VAL1
        if op == 27 { 
            let val1 = top_stack;
            stack_counter += 1;
            next_stack = val1;
            next_second_stack = top_stack;
        }

        // swap VAL1 VAL2 -> VAL2 VAL1
        if op == 28 { 
            let val1 = top_stack;
            let val2 = stack[stack_counter -1];
            next_second_stack = val1;
            next_stack = val2;
        }

        // revert [x] -> REVERT
        if op == 29 { 
            assert(false);
        }

        counter += 1 - (op == 24) as u8 - (op == 25) as u8 - (op == 0) as u8;
        stack = modify(stack, stack_counter, next_stack);
        stack = modify(stack, stack_counter - 1, next_second_stack);
        mem = modify(mem, next_mem_idx, next_mem_val);
        state = modify(state, next_state_idx, next_state_val);
        assert(stack_counter > 1);
        std::println(op);
        std::println(counter);
        std::println(stack);
        std::println(stack_counter);
        std::println("--");
    }

    // check end state
    // reach defined end state
    std::println("end state");
    std::println(state);
    std::println(state_end);
    for i in 0..SIZE {
        assert(state[i] == state_end[i]);
    }
    // reach defined end balance
    std::println("end balance");
    std::println(bal);
    std::println(bal_end);
    assert(bal - ret_val == bal_end);
    // reach return opcode
    assert(code[counter] == 0);
}

#[test]
fn test_deposit() {
    let mut state_end1: [u8;SIZE]= [0; SIZE];
    state_end1[0] = 69;
    state_end1[1] = 12;
    let mut code: [u8;CODE_SIZE]= [0; CODE_SIZE];
    code[0] = 15; // caller
    code[1] = 26; // push
    code[2] = 0; // 0
    code[3] = 23; // sstore
    code[4] = 16; // callvalue
    code[5] = 26; // push
    code[6] = 1; // 1
    code[7] = 23; // sstore
    code[8] = 0;

    main(
        [0;SIZE], // state_init
        state_end1, // state_end
        [0;SIZE], // calldata
        12, // call_value
        code, // code
        0, // block
        0, // bal_start
        12, // bal_end
        69, // caller
        0, // return_val
    );

    
}
#[test]
fn test_borrow(){
    let mut state_end1: [u8;SIZE]= [0; SIZE];
    state_end1[0] = 69;
    state_end1[1] = 12;

    let mut code2: [u8;CODE_SIZE] = [0; CODE_SIZE];
    let mut code2: [u8;CODE_SIZE] = [0; CODE_SIZE];
    code2[0] = 15; // caller
    code2[1] = 26; // push
    code2[2] = 2; // 2
    code2[3] = 23; // sstore
    code2[4] = 18; // blocknumber
    code2[5] = 26; // push
    code2[6] = 3; // 3
    code2[7] = 23; // sstore
    code2[8] = 26; // push
    code2[9] = 1; // 1
    code2[10] = 22; // sload
    code2[11] = 0; // return

    let mut state_end2: [u8;SIZE]= [0; SIZE];
    state_end2[0] = 69;
    state_end2[1] = 12;
    state_end2[2] = 29;
    state_end2[3] = 3;

    main(
        state_end1, // state_init
        state_end2, // state_end
        [0;SIZE], // calldata
        0, // call_value
        code2, // code
        3, // block
        12, // bal_start
        0, // bal_end
        29, // caller
        12, // return_val
    );

}

#[test]
fn test_return(){
    let mut state_end2: [u8;SIZE]= [0; SIZE];
    state_end2[0] = 69;
    state_end2[1] = 12;
    state_end2[2] = 29;
    state_end2[3] = 3;

    let mut code3: [u8;CODE_SIZE] = [0; CODE_SIZE];
    code3[0] = 16; // callvalue
    code3[1] = 26; // push
    code3[2] = 1; // 1
    code3[3] = 22; // sload
    code3[4] = 26; // push
    code3[5] = 3; // 3
    code3[6] = 22; // sload
    code3[7] = 18 ; // blocknumber
    code3[8] = 2; // sub
    code3[9] = 1; // add
    code3[10] = 7; // GT
    code3[11] = 26; // push
    code3[12] = 15; // 15
    code3[13] = 25; // jumpi
    code3[14] = 0; // return
    code3[15] = 29; // revert

    main(
        state_end2, // state_init
        state_end2, // state_end
        [0;SIZE], // calldata
        30, // call_value
        code3, // code
        7, // block
        0, // bal_start
        30, // bal_end
        29, // caller
        0, // return_val
    );

}