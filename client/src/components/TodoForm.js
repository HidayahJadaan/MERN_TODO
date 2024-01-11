
export default function TodoForm({ handleSubmit, settodo, todo }) {

  return (
    <form onSubmit={handleSubmit} className="TodoForm">

      <input
        type="text"
        placeholder="TODO TITLE"
        value={todo}
        onChange={(e)=> settodo(e.target.value)}
        className="todo-input"
      />
      
      <button type="submit" className="todo-btn">+</button>
    </form>
  );
}
