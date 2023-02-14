import TaskInput from '../TaskInput'
import TaskList from '../TaskList'
import styles from './todoList.module.scss'
import { Todo } from '../@types/todo.type'
import { useEffect, useState } from 'react'

interface HandleNewTodos {
  // Nhận vào todo array cũ và trả về todo array mới
  (todos: Todo[]): Todo[]
}
const syncReactToLocal = (handleNewTodos: HandleNewTodos) => {
  const todoString = localStorage.getItem('todos')
  // todoString có thể là null (trường hợp todos này ko có trong localStorage)
  const todoObj: Todo[] = JSON.parse(todoString || '[]')
  const newTodoObj = handleNewTodos(todoObj)
  localStorage.setItem('todos', JSON.stringify(newTodoObj))
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null)
  const doneTodos = todos.filter((todo) => todo.done)
  const notdoneTodos = todos.filter((todo) => !todo.done)

  useEffect(() => {
    const todoString = localStorage.getItem('todos')
    // todoString có thể là null (trường hợp todos này ko có trong localStorage)
    const todoObj: Todo[] = JSON.parse(todoString || '[]')
    setTodos(todoObj)
  }, [])

  const addTodo = (name: string) => {
    const handler = (todoObj: Todo[]) => {
      return [...todoObj, todo]
    }
    const todo: Todo = {
      name,
      done: false,
      id: new Date().toISOString()
    }
    setTodos((prev) => [...prev, todo])
    syncReactToLocal(handler)
  }

  const handleDoneTodo = (id: string, done: boolean) => {
    setTodos((prev) => {
      return prev.map((todo) => {
        if (todo.id === id) {
          return { ...todo, done }
        }
        return todo
      })
    })
  }

  const startEditTodo = (id: string) => {
    const findedTodo = todos.find((todo) => todo.id === id)
    if (findedTodo) {
      setCurrentTodo(findedTodo)
    }
  }

  const editTodo = (name: string) => {
    setCurrentTodo((prev) => {
      if (prev) {
        return { ...prev, name }
      }
      return null
    })
  }

  const finishEditTodo = () => {
    const handler = (todoObj: Todo[]) => {
      return todoObj.map((todo) => {
        if (todo.id === (currentTodo as Todo).id) {
          return currentTodo as Todo
        }
        return todo
      })
    }
    setTodos(handler)
    setCurrentTodo(null)
    syncReactToLocal(handler)
  }

  const deleteTodo = (id: string) => {
    if (currentTodo) {
      setCurrentTodo(null)
    }
    const handler = (todoObj: Todo[]) => {
      const findIndexTodo = todoObj.findIndex((todo) => todo.id === id)
      console.log(findIndexTodo)
      if (findIndexTodo > -1) {
        const result = [...todoObj]
        result.splice(findIndexTodo, 1)
        return result
      }

      return todoObj
    }
    setTodos(handler)
    syncReactToLocal(handler)
  }

  return (
    <div className={styles.todoList}>
      <div className={styles.todoListContainer}>
        <TaskInput addTodo={addTodo} currentTodo={currentTodo} editTodo={editTodo} finishEditTodo={finishEditTodo} />
        <TaskList
          todos={notdoneTodos}
          doneTaskList={false}
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
        <TaskList
          todos={doneTodos}
          doneTaskList
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
      </div>
    </div>
  )
}
