export const initConfigString: string = `{
    "input": "1011",
    "null": " ",
    "start": "go-right",
    "states": {
      "go-right": {
        "[0, 1]": {
          "go": "right"
        },
        "null": {
          "go": "left",
          "to": "carry"
        }
      },
      "carry": {
        "1": {
          "write": 0,
          "go": "left"
        },
        "[0, null]": {
          "write": 1,
          "go": "left",
          "to": "halt"
        }
      }
    }
  }`;
