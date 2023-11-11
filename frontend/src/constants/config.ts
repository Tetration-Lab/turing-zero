export const initConfigString: string = `{
    "input": "1011",
    "states": {
      "q0": {
        "[0, 1]": {
          "move": "right"
        },
        "empty": {
          "move": "left",
          "transition": "q1"
        }
      },
      "q1": {
        "1": {
          "write": 0,
          "move": "left"
        },
        "[0, empty]": {
          "write": 1,
          "move": "left",
          "transition": "halt"
        }
      }
    }
  }`;
