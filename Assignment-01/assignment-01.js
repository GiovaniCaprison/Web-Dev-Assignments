function refreshPage() {
    location.reload();
}

function sub(id) {
    let val = document.getElementById(`input${id}`);
    let number = parseInt(val.value, 10);
    if (number - 1 < 0) return;

    number -= 1;
    val.value = number;
}

function add(id) {
    let val = document.getElementById(`input${id}`);
    let number = parseInt(val.value, 10);

    number += 1;
    val.value = number;
}

const arr1 = Array.from(document.getElementsByClassName('add'));
const arr2 = Array.from(document.getElementsByClassName('sub'));

for (let i = 0; i <= 5; i++) {
    arr2[i].addEventListener('click', () => {
        sub(i + 1);
    });
}

for (let i = 0; i <= 5; i++) {
    arr1[i].addEventListener('click', () => {
        add(i + 1);
    });
}