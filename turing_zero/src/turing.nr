// simple turning machine. tape size, state size, number of symbols, and number of steps fixed but can be configured.

use dep::std;
global TAPE_SIZE: u8 = 32;
global STATE_SIZE: u8 = 10;
global N_SYMBOLS: u8 = 3;
global N_STEPS: u8 = 127;

fn access(tape: [u8; TAPE_SIZE], head: u8) -> u8 {
    let mut value: u8 = 0;
    for i in 0..TAPE_SIZE {
        value += (i == head) as u8 * tape[i];
    }
    value
}

fn modify(mut tape: [u8; TAPE_SIZE], head: u8, value: u8) -> [u8; TAPE_SIZE] {
    for i in 0..TAPE_SIZE {
        tape[i] = (i == head) as u8 * value + (i != head) as u8 * tape[i];
    }
    tape
}

fn main(tape_init: pub [u8; TAPE_SIZE], tape_out: pub [u8; TAPE_SIZE], final_state: pub u8, write: [u8; STATE_SIZE*N_SYMBOLS], move:[u8; STATE_SIZE*N_SYMBOLS], state_transition: [u8; STATE_SIZE*N_SYMBOLS]) {
    // tape support N_SYMBOLS symbols with STATE_SIZE states.
    // write, move, transition are indexed in slot of N_SYMBOLS per state.
    // e.g. [0, N_SYMBOLS) is the first state, [N_SYMBOLS, 2*N_SYMBOLS) is the second state, etc.

    // initailize state and head
    let mut state: u8 = 0;
    let mut head: u8 = TAPE_SIZE/2;
    let mut tape: [u8; TAPE_SIZE] = tape_init;

    // run the machine for N_STEPS steps
    for _ in 0..N_STEPS {
        let read = access(tape, head);
        let transition_index = (state * N_SYMBOLS + read);
        tape = modify(tape, head, write[transition_index]);
        let mv = move[transition_index];
        assert(mv <= 2); // 0 = right, 1 = stay, 2 = left
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
    let mut tape_init: [u8; TAPE_SIZE] = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    2,
    1,
    2,
    2,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
];
    let mut tape_out: [u8; TAPE_SIZE] = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    2,
    2,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
];
    let mut write: [u8; STATE_SIZE*N_SYMBOLS] = [
    0,
    1,
    2,
    2,
    2,
    1,
    0,
    1,
    2,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
];
    let mut move: [u8; STATE_SIZE*N_SYMBOLS] = [
    2,
    0,
    0,
    2,
    2,
    2,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
];
    let mut state_transition: [u8; STATE_SIZE*N_SYMBOLS] = [
    1,
    0,
    0,
    2,
    2,
    1,
    2,
    2,
    2,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
];
    let mut final_state: u8 = 2;
    main(tape_init, tape_out, final_state, write, move, state_transition);
}
