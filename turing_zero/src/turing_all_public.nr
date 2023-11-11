// simple turning machine with tape size 10, and 5 states. might expand later

use dep::std;
global TAPE_SIZE: u8 = 32;
global STATE_SIZE: u8 = 10;
global N_SYMBOLS: u8 = 3;
global N_STEPS: u8 = 128;

fn main(tape_init: pub [u8; TAPE_SIZE], tape_out: pub [u8; TAPE_SIZE], final_state: pub u8, write: pub [u8; STATE_SIZE*N_SYMBOLS], move: pub[u8; STATE_SIZE*N_SYMBOLS], state_transition: pub [u8; STATE_SIZE*N_SYMBOLS]) {
    // tape support N_SYMBOLS symbols with STATE_SIZE states.
    // write, move, transition are indexed in slot of N_SYMBOLS per state.
    // e.g. [0, N_SYMBOLS) is the first state, [N_SYMBOLS, 2*N_SYMBOLS) is the second state, etc.

    // initailize state and head
    let mut state: u8 = 0;
    let mut head: u8 = TAPE_SIZE/2;
    let mut tape: [u8; TAPE_SIZE] = tape_init;

    // run the machine for N_STEPS steps
    for _ in 0..N_STEPS{
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
    let mut tape_init: [u8; TAPE_SIZE] = [0; TAPE_SIZE];
    let mut tape_out: [u8; TAPE_SIZE] = [0; TAPE_SIZE];
    let mut write: [u8; STATE_SIZE*N_SYMBOLS] = [0; STATE_SIZE*N_SYMBOLS];
    let mut move: [u8; STATE_SIZE*N_SYMBOLS] = [1; STATE_SIZE*N_SYMBOLS];
    let mut state_transition: [u8; STATE_SIZE*N_SYMBOLS] = [0; STATE_SIZE*N_SYMBOLS];
    let mut final_state: u8 = 0;
    main(tape_init, tape_out, final_state, write, move, state_transition);

    // Uncomment to make test fail
    // main(1, 1);
}
