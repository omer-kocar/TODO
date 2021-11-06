// Tüm elementleri seçme
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group")
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners() { // Tüm event listenerlar
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
}

function clearAllTodos(e) {
    if (confirm("Tümünü silmek istediğinize emin misiniz ?")) {
        // Arayüzden todoları temizleme
        //todoList.innerHTML = ""; // Yavaş olan kullanım.
        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
    }
}
function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function (listItem) {
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue) === -1) {
            // Bulamadı
            listItem.setAttribute("style", "display : none !important");
        }
        else {
            listItem.setAttribute("style", "display : block");
        }
    })

}
function deleteTodo(e) {
    if (e.target.className === "fa fa-remove") {
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);

        showAlert("success", "Başarıyla silindi.")
    }
}
function deleteTodoFromStorage(deleteTodo) {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo, index) {
        if (todo === deleteTodo) {
            todos.splice(index, 1); // arrayden değeri silebiliriz.
        }
    });

    localStorage.setItem("todos", JSON.stringify(todos));
}
function loadAllTodosToUI() {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo) {
        addTodoToUI(todo);
    })
}
function addTodo(e) {
    const newTodo = todoInput.value.trim();

    var todos = JSON.parse(localStorage.getItem("todos")); 
    todos = todos ? todos : [];        

    if(todos !== null) { 
    } else {         
        todos = [];
    } 

    if(todos.includes(newTodo)){
        showAlert('danger', 'Bu todo zaten eklenmiş')
        return false;
    }

    /* for (let i = 0; i < todos.length; i++) {
        if (todos[i] == newTodo) {
            showAlert('danger', 'Bu todo zaten eklenmiş')
            return false;
        }
    } */

    if (newTodo === "") {
        showAlert("danger", "Lütfen bir Todo girin.");
    }
    
    else {
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success", "Başarılı todo girişi.")
    }

    //default ayarları sıfırlama
    e.preventDefault();
}
function getTodosFromStorage() { // storagedan bütün todoları almış olacak
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}
function addTodoToStorage(newTodo) {

    let todos = getTodosFromStorage();
    todos.push(newTodo);

    localStorage.setItem("todos", JSON.stringify(todos));

}
function showAlert(type, message) {

    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    firstCardBody.appendChild(alert);

    //setTimeout - iki tane değer alır. İlk önce function sonra da kaç saniye olduğu değerini alır.

    setTimeout(function () {
        alert.remove(); // function oluşturmadan tek başına yazsaydık biz göremeden gelir giderdi.

    }, 2000);
}

function addTodoToUI(newTodo) { // Burada aldığı string değerini list item olarak UI'a ekleyecek

    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between";
    // Link oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class ='fa fa-remove'></i>";

    // textNode ekleme
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    // Todo list'e list item ekleme
    todoList.appendChild(listItem);

    // sağ sol boşluk verildiği zaman o şekilde eklenmemesi için kullanılır. örn:/    ömer   / çıktısı:/ömer/
    todoInput.value = "";
}


