const addButton = document.getElementById("add-task");
const newListText = document.getElementById("new-task");
const taskList = document.getElementById("task-list");
addButton.addEventListener("click", addTask);

function addTask(){
    const newText = newListText.value;
    if(newText !== ''){
        const li = document.createElement("li");
            li.innerHTML = newText;
        taskList.appendChild(li);
        newListText.value = "";
    }
}