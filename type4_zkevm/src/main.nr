fn add(x: Field, y: Field) -> Field {
    x + y
}

fn main(x: Field, y: pub Field) {
    assert(add(x, y) == 3);
}

#[test]
fn test_main() {
    main(1, 2);
}
