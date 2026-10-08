(function () {
  // Todo el dinero se maneja en centimos (enteros) para evitar los errores de
  // redondeo de los decimales en coma flotante: 0.1 + 0.2 no es 0.3.
  var DENOMINATIONS = [
    { cents: 50000, label: "billete de 500 €" },
    { cents: 20000, label: "billete de 200 €" },
    { cents: 10000, label: "billete de 100 €" },
    { cents: 5000, label: "billete de 50 €" },
    { cents: 2000, label: "billete de 20 €" },
    { cents: 1000, label: "billete de 10 €" },
    { cents: 500, label: "billete de 5 €" },
    { cents: 200, label: "moneda de 2 €" },
    { cents: 100, label: "moneda de 1 €" },
    { cents: 50, label: "moneda de 50 cent" },
    { cents: 20, label: "moneda de 20 cent" },
    { cents: 10, label: "moneda de 10 cent" },
    { cents: 5, label: "moneda de 5 cent" },
    { cents: 2, label: "moneda de 2 cent" },
    { cents: 1, label: "moneda de 1 cent" },
  ];

  var form = document.getElementById("form");
  var subtotalInput = document.getElementById("subtotal");
  var discountInput = document.getElementById("discount");
  var vatInput = document.getElementById("vat");
  var paidInput = document.getElementById("paid");

  var outDiscount = document.getElementById("out-discount");
  var outBase = document.getElementById("out-base");
  var outVat = document.getElementById("out-vat");
  var outTotal = document.getElementById("out-total");
  var outChange = document.getElementById("out-change");
  var changeLabel = document.getElementById("change-label");
  var breakdownWrap = document.getElementById("breakdown-wrap");
  var breakdown = document.getElementById("breakdown");

  function toCents(value) {
    var amount = parseFloat(value);
    if (isNaN(amount) || amount < 0) return 0;
    return Math.round(amount * 100);
  }

  function formatEuros(cents) {
    return (cents / 100).toFixed(2).replace(".", ",") + " €";
  }

  // Algoritmo voraz: se empieza por la denominacion mas alta que cabe y se baja.
  // Con las monedas del euro siempre da el minimo numero de piezas.
  function splitIntoCoins(cents) {
    var pieces = [];
    var remaining = cents;
    for (var i = 0; i < DENOMINATIONS.length; i++) {
      var unit = DENOMINATIONS[i];
      var count = Math.floor(remaining / unit.cents);
      if (count > 0) {
        pieces.push({ count: count, label: unit.label });
        remaining -= count * unit.cents;
      }
    }
    return pieces;
  }

  function update() {
    var subtotal = toCents(subtotalInput.value);
    var discountPercent = Math.min(100, Math.max(0, parseFloat(discountInput.value) || 0));
    var vatPercent = parseFloat(vatInput.value) || 0;
    var paid = toCents(paidInput.value);

    var discount = Math.round((subtotal * discountPercent) / 100);
    var base = subtotal - discount;
    var vat = Math.round((base * vatPercent) / 100);
    var total = base + vat;
    var change = paid - total;

    outDiscount.textContent = formatEuros(discount);
    outBase.textContent = formatEuros(base);
    outVat.textContent = formatEuros(vat);
    outTotal.textContent = formatEuros(total);

    if (change < 0) {
      changeLabel.textContent = "Falta por pagar";
      outChange.textContent = formatEuros(-change);
      outChange.classList.add("is-short");
      breakdownWrap.hidden = true;
      return;
    }

    changeLabel.textContent = "Cambio a devolver";
    outChange.textContent = formatEuros(change);
    outChange.classList.remove("is-short");

    var pieces = splitIntoCoins(change);
    breakdown.innerHTML = "";
    pieces.forEach(function (piece) {
      var item = document.createElement("li");
      item.innerHTML = '<span class="count">' + piece.count + "×</span> " + piece.label;
      breakdown.appendChild(item);
    });
    breakdownWrap.hidden = pieces.length === 0;
  }

  form.addEventListener("input", update);
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  update();
})();
