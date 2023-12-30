// 1-  Lexical Analysis

// Function to tokenize a JavaScript parameter
function tokenizeJSParameter(parameter) {
  // List of JavaScript keywords
  const keywords = [
    "console.log",
    "await",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "enum",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "implements",
    "import",
    "in",
    "instanceof",
    "interface",
    "let",
    "new",
    "null",
    "package",
    "private",
    "protected",
    "public",
    "return",
    "super",
    "switch",
    "static",
    "this",
    "throw",
    "try",
    "true",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield",
  ];

  const tokens = [];
  let currentToken = "";

  // Regular expression to match numeric constants (integer or decimal)
  const numericConstantRegex = /^-?\d+(\.\d+)?$/;

  for (const char of parameter) {
    // Check if the character is a letter or underscore
    if (/[a-zA-Z_]/.test(char)) {
      currentToken += char;
    } else if (/\s/.test(char)) {
      // If it's a space and not inside a string, handle the current token
      if (currentToken) {
        if (keywords.includes(currentToken)) {
          tokens.push(["Keyword", currentToken]);
        } else if (numericConstantRegex.test(currentToken)) {
          tokens.push(["Numeric Constant", parseFloat(currentToken)]);
        } else {
          tokens.push(["Identifier", currentToken]);
        }
        currentToken = "";
      }
      // Check if the current character is one of the specified JavaScript operators or special characters
    } else if (/[+\-*/%=<>{}[\]]/.test(char)) {
      // Handle operators
      if (currentToken) {
        if (keywords.includes(currentToken)) {
          tokens.push(["Keyword", currentToken]);
        } else if (numericConstantRegex.test(currentToken)) {
          tokens.push(["Numeric Constant", parseFloat(currentToken)]);
        } else {
          tokens.push(["Identifier", currentToken]);
        }
        currentToken = "";
      }
      tokens.push(["Operator", char]);
    } else if (
      /\d/.test(char) ||
      char === "." ||
      (char === "-" && /\d/.test(parameter[parameter.indexOf(char) + 1]))
    ) {
      // Build the current token for numeric constants
      currentToken += char;
    } else if (/'|"/.test(char)) {
      // Handle character constants
      if (currentToken) {
        if (keywords.includes(currentToken)) {
          tokens.push(["Keyword", currentToken]);
        } else if (numericConstantRegex.test(currentToken)) {
          tokens.push(["Numeric Constant", parseFloat(currentToken)]);
        } else {
          tokens.push(["Identifier", currentToken]);
        }
        currentToken = "";
      }
      tokens.push(["Char Constant", char]);
    } else if (/#/.test(char)) {
      // Handle comments
      currentToken += char;
    } else if (/\n/.test(char)) {
      // If newline, handle the current token as a comment
      if (currentToken) {
        if (keywords.includes(currentToken)) {
          tokens.push(["Keyword", currentToken]);
        } else if (numericConstantRegex.test(currentToken)) {
          tokens.push(["Numeric Constant", parseFloat(currentToken)]);
        } else {
          tokens.push(["Identifier", currentToken]);
        }
        currentToken = "";
      }
      tokens.push(["Comment", currentToken]);
      currentToken = "";
    } else if (/[()]/.test(char)) {
      // Handle parentheses
      if (currentToken) {
        if (keywords.includes(currentToken)) {
          tokens.push(["Keyword", currentToken]);
        } else if (numericConstantRegex.test(currentToken)) {
          tokens.push(["Numeric Constant", parseFloat(currentToken)]);
        } else {
          tokens.push(["Identifier", currentToken]);
        }
        currentToken = "";
      }
      tokens.push(["Special Character", char]);
    }
  }

  // Handle the last token
  if (currentToken) {
    if (keywords.includes(currentToken)) {
      tokens.push(["Keyword", currentToken]);
    } else if (numericConstantRegex.test(currentToken)) {
      tokens.push(["Numeric Constant", parseFloat(currentToken)]);
    } else {
      tokens.push(["Identifier", currentToken]);
    }
  }

  // Return the array of tokens
  return tokens;
}

// Example usage
const result = tokenizeJSParameter("if(true) await a+b*6=7.55 else console.log('test')");
console.log(result);


console.log("##".repeat(50));



// 2- Syntax Analysis (Check if string will be run or not)
function isStringRunnable(codeString) {
  try {
    // Attempt to execute the provided code string
    eval(codeString);
    return true; // If successful, consider it runnable
  } catch (error) {
    console.error(error.message);
    return false; // If an error occurs, consider it not runnable
  }
}

// Example usage:
// not work
let codeToCheck = "if(true) await a+b*6=7.55 else console.log('test')";

// work
codeToCheck = `
          const fs = require('fs').promises;

          async function getNames() {
            try {
              const fileContents = await fs.readFile('names.json', 'utf8');

              const jsonData = JSON.parse(fileContents);

              console.log(jsonData);
            } catch (error) {
              console.error('Error reading or parsing the file:', error);
            }
          }

          getNames();
`;

const isRunnable = isStringRunnable(codeToCheck);

console.log(isRunnable ? "The code is runnable." : "The code may have errors.");
