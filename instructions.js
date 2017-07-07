
document.addEventListener("DOMContentLoaded", function(event) {
    var instructions = document.getElementById('instructions');
    var open = document.getElementById("open");

    open.onclick = function() {
        instructions.style.display = "block";
    };

    window.onclick = function(event) {
        if ((event.target === instructions) && (event.target !== open)) {
            instructions.style.display = "none";
        }
      };
});
