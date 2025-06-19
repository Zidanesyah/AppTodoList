document.addEventListener('DOMContentLoaded', () =>{
    const submitForm = document.getElementById('form'); 
    const todos = [];
    const RENDER_EVENT = 'render-todo';
    const SAVED_EVENT = 'saved-todo';
    const STORAGE_KEY = 'TODO_APPS';


    submitForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        addTodo();
    }); 

    function addTodo(){
        const textTodo = document.getElementById('title').value;
        const timestamp = document.getElementById('date').value;    

        const generateID = generateid();
        const todoObject = generateTodoObject(generateID, textTodo, timestamp, false);
        todos.push(todoObject)

        document.dispatchEvent(new Event (RENDER_EVENT));
        saveData();
        showToast("Todo Berhasil Ditambahkan!");
    }

    function makeTodo(todoObject){
        const textTitle = document.createElement('h2');
        textTitle.innerText = todoObject.text;

        const textTimestamp = document.createElement('p'); 
        textTimestamp.innerText = todoObject.timestamp;
    
        const textContainer = document.createElement('div');
        textContainer.classList.add('inner');
        textContainer.append(textTitle, textTimestamp);

        const container = document.createElement('div');
        container.classList.add('item', 'shadow');
        container.append(textContainer);
        container.setAttribute('id', `todo-${todoObject.id}`);

        if(todoObject.iscompleted){
            const undoButton = document.createElement('button');
            undoButton.classList.add('undo-button');

            undoButton.addEventListener('click', ()=>{
                undoTaskFromCompleted(todoObject.id);
            });

            const trashButton = document.createElement('button');
            trashButton.classList.add('trash-button');

            trashButton.addEventListener('click', ()=>{
                removeTaskFromCompleted(todoObject.id);
            });

            container.append(undoButton, trashButton);
        }else{
            const checkButton = document.createElement('button');
            checkButton.classList.add('check-button');

            checkButton.addEventListener('click', ()=>{
                addTaskCompleted(todoObject.id);
            });

            container.append(checkButton);
        }

        return container;
    }

    function generateid(){
        return + new Date;
    }

    function generateTodoObject(id, text, timestamp, iscompleted){  
        return{
            id,
            text,
            timestamp,
            iscompleted
        }
    }

    function addTaskCompleted(todoId){
        const todoTarget = findTodo(todoId);

        if(todoTarget == null) return;

        todoTarget.iscompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
        showToast("Task Completed");
    }

    function undoTaskFromCompleted(todoId){
        const todoTarget = findTodo(todoId);

        if(todoTarget == null) return;
        todoTarget.iscompleted = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
    
    function removeTaskFromCompleted(todoId){
        const todoTarget = findTodoIndex(todoId);

        if(todoTarget == -1) return;
        todos.splice(todoTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
        showToast("Taks Removed");
    }

    function findTodo(todoId){
        for(const todoItem of todos){
            if(todoItem.id === todoId){
                return todoItem;
            }
        }
        return null;
    }

    function findTodoIndex(todoId){
        for(const index in todos){
            if(todos[index].id === todoId){
                return index;
            }
        }

        return -1;
    }

    function saveData(){
        if(isStorageExist()){
            const parsed = JSON.stringify(todos);
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }

    function isStorageExist(){
        if(typeof Storage == "undefined"){
            alert("Browser anda tidak mendukung local storage");
            return false;
        }

        return true;
    }

    function showToast(message){
        const toast = document.getElementById('toast');
        toast.innerHTML = message;
        toast.classList.add('show');
        setTimeout(()=>{
            toast.classList.remove('show');
        }, 3000);
    }

    function loadDataFromStorage(){
        const realizedData = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(realizedData);

        if(data != null){
            for(const todo of data){
                todos.push(todo);
            }
        }

        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    document.addEventListener(RENDER_EVENT, ()=>{

        const uncompletedTodo = document.getElementById('todos');
        uncompletedTodo.innerHTML = '';

        const completedTodo = document.getElementById('completed-todos');
        completedTodo.innerHTML = '';

        for(const todoItem of todos){
            const todoElement = makeTodo(todoItem);
            if(!todoItem.iscompleted){
                uncompletedTodo.append(todoElement);
            }else{
                completedTodo.append(todoElement);
            }
        }

        console.log(todos);//checking log response 
        
        
    });

    document.addEventListener(SAVED_EVENT, ()=>{
        console.log(localStorage.getItem(STORAGE_KEY));

    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
});