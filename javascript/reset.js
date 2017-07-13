document.addEventListener("DOMContentLoaded", function(e) {
  var resetButton = document.getElementById('reset');

  resetButton.onclick = function() {
    location.reload();
  };
});
