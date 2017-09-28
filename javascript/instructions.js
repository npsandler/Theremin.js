
document.addEventListener("DOMContentLoaded", function(event) {
    let instructions = document.getElementById('instructions');
    let open = document.getElementById("open");

    open.onclick = function() {
        instructions.style.display = "block";
    };

    window.onclick = function(event) {
        if (event.target !== open) {
            instructions.style.display = "none";
        }
      };
});
