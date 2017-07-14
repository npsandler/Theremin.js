document.addEventListener("DOMContentLoaded", function(e) {
  var resetAllButton = document.getElementById('reset-all');
  var resetSoundButton = document.getElementById('reset-sound');

  resetAllButton.onclick = function() {
    location.reload();
  };

  resetSoundButton.onclick = function() {
    release(e)
  };
});
