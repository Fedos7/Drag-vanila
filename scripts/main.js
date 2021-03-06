
const [errorContainer] = document.getElementsByClassName('error-msg');
const [dropArea] = document.getElementsByClassName('drop-area');
const form = document.getElementById('form')
const dNdEvens = ['dragenter', 'dragover', 'drop', 'dragend', 'dragleave'];
let dataImgs = new FormData();
// upload and preview file
function uploadFile({...files}) {
    const types = /jpg|jpeg|png|gif|pdf/;
    errorContainer.innerHTML = '';
    document.getElementById("preview-container").innerHTML = '';
    for (let prop in files) {
        if (types.test(files[prop].type)) {
            let reader = new FileReader();
            let newPreviewImg = new Image();
            reader.onloadend = function () {
                newPreviewImg.src = reader.result;
                document.getElementById('preview-container').appendChild(newPreviewImg);
            }
            if (files) reader.readAsDataURL(files[prop]);
            dataImgs.set(files[prop].name, files[prop])
        } else {
            errorMessege(files[prop].name)
        }
    }
}

// drag and drop, and upload

form.addEventListener("submit", function(evt) {
    evt.preventDefault();
    document.getElementById("preview-container").innerHTML = '';
    sendData();
})
dNdEvens.forEach(ev => dropArea.addEventListener(ev, eventHeandler))
function eventHeandler (e) {
    const types = /jpg|jpeg|png|gif|pdf/
    e.preventDefault();
    switch (e.type) {
        case 'dragover':
            dropArea.classList.add('drag-enter');
            break;
        case 'dragleave':
            dropArea.classList.remove('drag-enter');
            break;
        case 'drop':
            uploadFile(e.dataTransfer.files);
            break;
    }
}
async function sendData () {
    try {
        const response = await fetch('https://test.com/imgs', {
          method: 'POST',
          body: dataImgs
        });
        const result = await response.json();
        console.log('ok', JSON.stringify(result));
    } catch (error) {
        document.getElementById("preview-container").innerHTML = 'Success';
        console.error('error:', error);
    }
}
function errorMessege (fileName) {
    const textError = document.createTextNode(`Error - " ${fileName} " has the wrong file extension `);
    errorContainer.appendChild(textError);
}

