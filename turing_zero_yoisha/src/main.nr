use dep::std::println;

fn get2bit<T>(x: [u127; T], index: u127) -> u8 {
    (x[index / 64] >> (index % 64) & 0x11) as u8
}

fn main(
    mut input: pub [u8; 5],
    output: pub [u8; 5],
    prog: pub [[u32; 3]; 2],
    mut prog_index: pub u8,
    mut input_index: pub u8
) {
    for _ in 0..0xff {
        if (prog_index != 0xff) {
            println("input_index");
            println(input_index);
            println("prog_index");
            println(prog_index);
            println("---");
            println(input);
            println("---");
            let p = prog[prog_index][input[input_index]];
            let left_right = p >> 16;
            let write_state = (p & 0xff00) >> 8;
            if (write_state != 0) {
                input[input_index] = write_state as u8;
            }
            let next_prog_index = (p & 0xff);
            prog_index = next_prog_index as u8;
            if ((left_right == 0) & (next_prog_index != 0xff)) {
                input_index -= 1;
            } else {
                input_index += 1;
            }
        }
    }

    println(input);
    println(output);
    assert(input == output);
}

#[test]
fn test_main() {
    main(
        [0, 0, 2, 2, 0],
        [0, 2, 1, 1, 0],
        [
            [
                1,
                65536,
                65536,
            ],
            [
                767,
                767,
                257,
            ],
        ],
        0,
        2
    );

    // Uncomment to make test fail
    // main(1, 1);
}
