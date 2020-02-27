const amount = 1000;
const $messageBox = document.getElementById('messageBox');
const $button = document.querySelector('button');

function resetButtonText() {
  $button.innerHTML = 'Click to Buy! <strong>$10</strong>';
}

const handler = StripeCheckout.configure({
  key: "pk_test_rlYZWgwY4s91t59PGrMMgbTV002VxcOY2Z",
  image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
  locale: 'auto',
  closed: function () {
    resetButtonText();
  },
  token: async function(token) {

    let response, data;

    try {
      response = await fetch("http://localhost:8888/.netlify/functions/purchase/purchase.js", {
        method: 'POST',
        body: JSON.stringify({
          token,
          amount
        }),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });

      data = await response.json();
    } catch (error) {
      console.error(error.message);
      alert("ERROR: CARGO NO REALIZADO");
      return;
    }

    resetButtonText();

    let message = typeof data === 'object' && data.status === 'succeeded'
      ? 'Charge was successful!'
      : 'Charge failed.'
    $messageBox.querySelector('h2').innerHTML = message;

    console.log(data);
  }
});

$button.addEventListener('click', () => {

  setTimeout(() => {
    $button.innerHTML = 'Waiting for response...';
  }, 500);

  handler.open({
    amount,
    name: 'Test Shop',
    description: 'A Fantastic New Widget'
  });
});
