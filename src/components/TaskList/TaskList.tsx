import styles from './taskList.module.scss'
import { Todo } from '../@types/todo.type'

interface TaskListProps {
  doneTaskList: boolean
  todos: Todo[]
  handleDoneTodo: (id: string, done: boolean) => void
}
export default function TaskList(props: TaskListProps) {
  const { doneTaskList, todos, handleDoneTodo } = props

  return (
    <>
      <h2 className={styles.title}>{doneTaskList ? '*Hoàn thành' : '*Chưa hoàn thành'}</h2>
      <div className={styles.tasks}>
        {todos.map((item, index) => (
          <div className={styles.task} key={item.id}>
            <input
              type='checkbox'
              className={styles.taskCheckbox}
              checked={item.done}
              onChange={(e) => {
                handleDoneTodo(item.id, e.target.checked)
              }}
              id={item.id}
            />
            <label className={`${styles.taskName} ${item.done ? styles.taskNameDone : ''}`} htmlFor={item.id}>
              {item.name}
            </label>
            <div className={styles.taskActions}>
              <button className={styles.taskBtn}>✏️</button>
              <button className={styles.taskBtn}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
