export const initConfigString: string = `{
    "input": "1011",
    "empty": " ",
    "start": "go-right",
    "states": {
      "go-right": {
        "[0, 1]": {
          "go": "right"
        },
        "empty": {
          "go": "left",
          "to": "carry"
        }
      },
      "carry": {
        "1": {
          "write": 0,
          "go": "left"
        },
        "[0, empty]": {
          "write": 1,
          "go": "left",
          "to": "halt"
        }
      }
    }
  }`;
