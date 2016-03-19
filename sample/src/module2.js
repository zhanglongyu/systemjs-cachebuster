var module1 = require("./module1");

function run2() {
    console.log("module2");
    
    module1.run1();
}

run2();

