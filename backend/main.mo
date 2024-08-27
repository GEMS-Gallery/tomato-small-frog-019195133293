import Float "mo:base/Float";
import Text "mo:base/Text";
import Error "mo:base/Error";

actor Calculator {
  public func calculate(operation: Text, operand1: Float, operand2: Float) : async Float {
    switch (operation) {
      case ("+") { operand1 + operand2 };
      case ("-") { operand1 - operand2 };
      case ("*") { operand1 * operand2 };
      case ("/") {
        if (operand2 == 0) {
          throw Error.reject("Division by zero");
        };
        operand1 / operand2
      };
      case (_) {
        throw Error.reject("Invalid operation");
      };
    }
  };
}