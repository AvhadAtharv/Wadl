$(document).on('pagecreate', '#home', function () {
  const today = new Date().toLocaleDateString();
  $('#today-status').text(`Status: Ready on ${today}`);
});

$(document).on('submit', '#contact-form', function (event) {
  event.preventDefault();

  const name = $('#name').val();
  $('#form-response').text(`Message captured successfully for ${name}.`);
});
