export function makeTodo(todoObject){
    const textTitle = document.createElement('h2');
    textTitle.innerText = todoObject.text;

    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = todoObject.textTimestamp;
    
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimestamp);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todoObject.id}`);

    return container;
}