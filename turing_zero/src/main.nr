// simple turning machine with tape size 10, and 5 states. might expand later

use dep::std;

fn main(tape_init: pub [bool; 10], tape_out: pub [bool; 10], write: pub [bool; 10], move: pub[bool; 10], state_transition: pub [u8; 10]) {
    let mut state: u8= 0;
    let mut head: u8 = 0;
    let mut tape: [bool; 10] = tape_init;
    let tape_len = tape.len() as u8;
    for _ in 0..69{
        let read = tape[head];
        let transition_index = (state * 2 + read as u8);
        tape[head] = write[transition_index];
        if (move[transition_index]) {
            head += 1 * (head < tape_len) as u8;
        } else {
            head -= 1 * (head > 0) as u8;
        } 
        state = state_transition[transition_index];
    }
    for i in 0..10 {
        assert(tape[i] == tape_out[i]);
    }
}

#[test]
fn test_main() {
    // case 1
    let tape_init: [bool; 10] = [true, false, false, false, false, false, false, false, false, false];
    let tape_out: [bool; 10] = [false, true, false, false, false, false, false, false, false, false];
    let state_transition:[u8; 10]= [2,1,2,1,3,3,2,2,4,4];
    let move: [bool; 10] = [true, true, true, true, true, true, false, false, true, true];
    let write: [bool; 10] = [false, false, true, true, false, true, false, true, false, false];
    main(tape_init, tape_out, write, move, state_transition);

    // Uncomment to make test fail
    // main(1, 1);
}
