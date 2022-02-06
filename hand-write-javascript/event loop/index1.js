/**
 *
 */
function first() {
  console.log(1);
}

function second(callback) {
  setTimeout(() => {
    console.log(2);

    callback();
  }, 1000);
}

function third() {
  console.log(3);
}

first();
second(third);
