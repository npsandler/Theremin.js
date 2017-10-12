document.addEventListener("DOMContentLoaded", function(e) {
  var resetSoundButton = document.getElementById('reset-sound');

  resetSoundButton.onclick = function() {
    resetFilters(e)
  };
});
