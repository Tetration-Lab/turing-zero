export const AUTO_LOAD = true;
export const AUTO_LOAD_INTERVAL = 1000;

export const INIT_CONFIG_STRING: string = `{
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

export const CONFIG_STRINGS = [
  INIT_CONFIG_STRING,
  `{
  "input": "111",
  "states": {
    "each": {
      "1": {
        "write": "empty",
        "move": "right",
        "transition": "sep"
      },
      "empty": {
        "move": "right",
        "transition": "halt"
      }
    },
    "sep": {
      "1": {
        "move": "right"
      },
      "empty": {
        "move": "right",
        "transition": "add"
      }
    },
    "add": {
      "1": {
        "move": "right"
      },
      "empty": {
        "write": 1,
        "move": "left",
        "transition": "sepL"
      }
    },
    "sepL": {
      "1": {
        "move": "left"
      },
      "empty": {
        "move": "left",
        "transition": "next"
      }
    },
    "next": {
      "1": {
        "move": "left"
      },
      "empty": {
        "write": 1,
        "move": "right",
        "transition": "each"
      }
    }
  }
}`,
];
