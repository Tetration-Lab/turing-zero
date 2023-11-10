// simple turning machine with tape size 10, and 5 states. might expand later

use dep::std;
global TAPE_SIZE: u8 = 32;
global STATE_SIZE: u8 = 10;
global N_SYMBOLS: u8 = 3;

fn main(tape_init: pub [u8; TAPE_SIZE], tape_out: pub [u8; TAPE_SIZE], final_state: pub u8, write: pub [u8; STATE_SIZE*N_SYMBOLS], move: pub[u8; STATE_SIZE*N_SYMBOLS], state_transition: pub [u8; STATE_SIZE*N_SYMBOLS]) {
    // tape support N_SYMBOLS symbols => 0 = blank, 1 = 0, 2 = 1. with 10 states.
    // write, move, transition are indexed in slot of 3 -> [0..2] = state 0, [3..5] = state 1, ...

    // initailize state and head
    let mut state: u8 = 0;
    let mut head: u8 = TAPE_SIZE/2;
    let mut tape: [u8; TAPE_SIZE] = tape_init;

    // run the machine for 128 steps
    for _ in 0..128{
        let read = tape[head];
        let transition_index = (state * N_SYMBOLS + read);
        tape[head] = write[transition_index];
        let mv = move[transition_index];
        assert((mv == 0) | (mv == 1) | (mv == 2)); // 0 = right, 1 = stay, 2 = left
        head = head + 1 - mv; 
        state = state_transition[transition_index];
    }
    for i in 0..TAPE_SIZE {
        assert(tape[i] == tape_out[i]);
    }
    assert(state == final_state);
}

#[test]
fn test_main() {
    // case 1
    // let tape_init: [bool; 10] = [true, false, false, false, false, false, false, false, false, false];
    // let tape_out: [bool; 10] = [false, true, false, false, false, false, false, false, false, false];
    // let state_transition:[u8; 10]= [2,1,2,1,3,3,2,2,4,4];
    // let move: [u8; 10] = [0, 0, 0, 0, 0, 0, 2, 2, 0, 0];
    // let write: [bool; 10] = [false, false, true, true, false, true, false, true, false, false];
    // main(tape_init, tape_out, write, move, state_transition);

    // Uncomment to make test fail
    // main(1, 1);
}
