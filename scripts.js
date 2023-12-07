$(document).ready(function () {
    // Function to update UI and add a new todo
    function addTodoUI(task, todoId) {
        const todoList = $('#todo-list');
        const listItem = $('<li>').text(task);

        // Create update and delete buttons
        const updateBtn = $('<button class="update-btn">Update</button>');
        const deleteBtn = $('<button class="delete-btn">Delete</button>');

        // Add margin and padding for spacing
        updateBtn.css('margin-left', '250px');
        deleteBtn.css('margin-left', '5px');
        listItem.css('padding', '5px');

        const buttonsContainer = $('<div>').css({
            'display': 'flex',
            'justify-content': 'flex-end'
        });

        // Add click event for the update button
        updateBtn.click(function () {
            const updatedTask = prompt('Update task:', task);
            if (updatedTask) {
                updateTodo(todoId, updatedTask);
            }
        });

        // Add click event for the delete button
        deleteBtn.click(function () {
            console.log('Deleting todo with id:', todoId);
            if (confirm('Are you sure you want to delete this todo?')) {
                if (todoId) {
                    deleteTodo(todoId);
                } else {
                    console.error('Error: todoId is undefined');
                }
            }
        });

        // Append buttons and the new todo to the list
        listItem.append(updateBtn, deleteBtn);
        todoList.append(listItem);
    }

    // Function to fetch todos from the server and update the UI
    function fetchTodos() {
        $.get('/todos', function (todos) {
            $('#todo-list').empty(); // Clear the existing list
            todos.forEach(function (todo) {
                addTodoUI(todo.task, todo.id);
            });
        });
    }

    // Function to add a new todo
    function addTodo(task) {
        $.post('/todos', { task: task }, function () {
            fetchTodos(); // Fetch and display updated todos
        });
    }

    // Function to update a todo
    function updateTodo(id, updatedTask) {
        $.ajax({
            url: `/todos/${id}`,
            type: 'PUT',
            data: { task: updatedTask },
            success: function () {
                fetchTodos(); // Fetch and display updated todos
            },
            error: function (err) {
                console.error('Error updating todo:', err.responseText);
            }
        });
    }

    // Function to delete a todo
    function deleteTodo(id) {
        $.ajax({
            url: `/todos/${id}`,
            type: 'DELETE',
            success: function () {
                fetchTodos(); // Fetch and display updated todos
            },
            error: function (err) {
                console.error('Error deleting todo:', err.responseText);
            }
        });
    }

    // Submit form to add a new todo
    $('#todo-form').submit(function (event) {
        event.preventDefault(); // Prevent the default form submission

        const task = $('#task').val(); // Get the task from the input field
        if (task) {
            addTodo(task);
            $('#task').val(''); // Clear the input field
        }
    });

    // Initial fetch to display existing todos
    fetchTodos();
});
