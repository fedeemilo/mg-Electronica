// encontrar el form de post edit
let postEditForm = document.getElementById('postEditForm');
// añadir un listener al submit del form
postEditForm.addEventListener('submit', function(event) {
    // encontrar cantidad de imágenes subidas
    let imageUploads = document.getElementById('imageUpload').files.length;
    // saber el número total de imágenes subidas
    let existingImgs = document.querySelectorAll('.imageDeleteCheckbox').length;
    // saber el total de posibles imágenes a borrar (checkbox:checked)
    let imgDeletions = document.querySelectorAll('.imageDeleteCheckbox:checked').length;
    // averiguar si el form puede mandarse o no (submit or not)
    let newTotal = existingImgs - imgDeletions + imageUploads;

    if (newTotal > 4) {
        event.preventDefault();
        let removalAmt = newTotal - 4
        alert(`Debes remover al menos más de ${removalAmt} imáge${removalAmt === 1 ? 'n' : 'nes'}!`);
    }
})