var phone = require('phone');

function attemptToStandarizePhone(number) {
  var result = phone(number);
  console.log(result)
  if (result && result.length > 0) { return result[0]; }
  return number;
}

console.log(attemptToStandarizePhone("2679925122"));
