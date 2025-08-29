import { useEffect, useState } from "react";
import "./style/app.css";

export default function App() {
	const [todos, setTodos] = useState({
		pending: [],
		active: [],
		closed: [],
	});
	const [updatedValue, setUpdatedValue] = useState(null);

	function handleTodoAdder(todo) {
		setTodos((prevTodos) => ({
			...prevTodos,
			[todo.status]: [...prevTodos[todo.status], todo],
		}));
	}

	function handleDeleteTask(task) {
		setTodos((prevTodos) => ({
			...prevTodos,
			[task.status]: prevTodos[task.status].filter((tsk) => tsk.id !== task.id),
		}));
	}

	function handleEditTask(task) {
		setTodos((prevTodos) => {
			const oldStatus = updatedValue.status;
			let newTodos = { ...prevTodos };

			newTodos[oldStatus] = newTodos[oldStatus].filter((t) => t.id !== task.id);

			newTodos[task.status] = [...newTodos[task.status], task];

			return newTodos;
		});
		setUpdatedValue(null);
	}

	return (
		<>
			<div className="container">
				<Header />
				<TodosControler
					onAddTodo={handleTodoAdder}
					UpdateTodoValue={updatedValue}
					onEditTask={handleEditTask}
				/>
				<TodosTips
					onDeleteTask={handleDeleteTask}
					onSetUpdateTask={setUpdatedValue}
					todos={todos}
				/>
			</div>
		</>
	);
}

// -----------------------------
// Components
// -----------------------------

function Header() {
	return (
		<header className="header">
			<div className="header_left">
				<span>
					<svg
						className="header_icon"
						width="47"
						height="47"
						viewBox="0 0 47 47"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M16.8906 23.5L22.0312 28.6406L30.8438 19.8281M42.5938 23.5C42.5937 28.564 40.5821 33.4205 37.0013 37.0013C33.4205 40.5821 28.564 42.5938 23.5 42.5938C18.436 42.5938 13.5795 40.5821 9.99868 37.0013C6.41791 33.4205 4.40625 28.564 4.40625 23.5C4.40625 18.436 6.41791 13.5795 9.99868 9.99868C13.5795 6.41791 18.436 4.40625 23.5 4.40625C28.564 4.40625 33.4205 6.41791 37.0013 9.99868C40.5821 13.5795 42.5937 18.436 42.5938 23.5Z"
							stroke="#FDBF46"
							stroke-width="2.9375"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
				Todos
			</div>
			<div className="header_right">
				<h1>ToDo List</h1>
				<h2>Perfil</h2>
			</div>
		</header>
	);
}

function TodosControler({ onAddTodo, UpdateTodoValue, onEditTask }) {
	const [task, setTask] = useState("");
	const [status, setStatus] = useState("active");

	useEffect(() => {
		if (UpdateTodoValue) {
			setTask(UpdateTodoValue.task);
			setStatus(UpdateTodoValue.status);
		} else {
			setTask("");
			setStatus("active");
		}
	}, [UpdateTodoValue]);

	function formSubmit(event) {
		event.preventDefault();
	}

	function handleActive(event) {
		setStatus(event.target.innerHTML);
	}

	function handleAddTodo() {
		if (!task) return;

		const nowDate = new Date().toISOString().split("T")[0];
		const id = crypto.randomUUID();

		const newTodo = {
			id,
			task,
			createdAt: nowDate,
			updatedAt: nowDate,
			status,
		};

		onAddTodo(newTodo);
		setTask("");
		setStatus("active");
	}

	function handleUpdateTodo() {
		if (!task || !UpdateTodoValue) return;

		const updateTask = {
			...UpdateTodoValue,
			task,
			updatedAt: new Date().toISOString().split("T")[0],
			status,
		};

		onEditTask(updateTask);
		setTask("");
	}

	function handleStatusChange(event) {
		setStatus(event.currentTarget.dataset.status);
	}

	return (
		<section className="todo-section">
			<form className="todo_form" onSubmit={formSubmit}>
				<div className="todo_input">
					<input
						value={task}
						type="text"
						onChange={(e) => setTask(e.target.value)}
						placeholder="Enter your task"
					/>
					<span
						className={
							status === "active"
								? "green_btn"
								: status === "pending"
									? "yellow_btn"
									: "red_btn"
						}
					>
						{status}
					</span>
				</div>

				<div className="todo_buttons">
					{/* Add / Update */}
					<Button
						color="blue_btn button"
						onClickHandle={UpdateTodoValue ? handleUpdateTodo : handleAddTodo}
					>
						<span>{UpdateTodoValue ? "Update" : "Add"}</span>
					</Button>

					{/* <Button color="red_btn button" onClickHandle={handleActive} data-status="closed">
						closed
					</Button>
					<Button color="yellow_btn button" onClickHandle={handleActive} data-status="pending">
						pending
					</Button>
					<Button color="green_btn button" onClickHandle={handleActive} data-status="active">
						active
					</Button> */}
					<Button
						color="green_btn button"
						data-status="active"
						onClickHandle={handleStatusChange}
					>
						active
					</Button>
					<Button
						color="yellow_btn button"
						data-status="pending"
						onClickHandle={handleStatusChange}
					>
						pending
					</Button>
					<Button
						color="red_btn button"
						data-status="closed"
						onClickHandle={handleStatusChange}
					>
						closed
					</Button>
				</div>
			</form>
		</section>
	);
}

/* function Button({ children, color, onClickHandle }) {
	return (
		<button className={` ${color}`} onClick={onClickHandle}>
			{children}
		</button>
	);
} */
function Button({ children, color, onClickHandle, ...props }) {
	return (
		<button className={color} onClick={onClickHandle} {...props}>
			{children}
		</button>
	);
}

function TodosTips({ todos, onDeleteTask, onSetUpdateTask }) {
	return (
		<section className="main">
			<TodosSection
				onDeleteTask={onDeleteTask}
				onSetUpdateTask={onSetUpdateTask}
				todosData={todos.active}
				title="active"
				color="green_btn"
			/>
			<TodosSection
				onDeleteTask={onDeleteTask}
				onSetUpdateTask={onSetUpdateTask}
				todosData={todos.pending}
				title="pending"
				color="yellow_btn"
			/>
			<TodosSection
				onDeleteTask={onDeleteTask}
				onSetUpdateTask={onSetUpdateTask}
				todosData={todos.closed}
				title="closed"
				color="red_btn"
			/>
		</section>
	);
}

function TodosSection({ title, color, todosData, onDeleteTask, onSetUpdateTask }) {
	return (
		<div className="todos_basket">
			<div className="section_header">
				<div className={`section_header_box ${color}`}>
					<span>{title}</span>
				</div>
			</div>
			<TodosTable
				todosData={todosData}
				onDeleteTask={onDeleteTask}
				onSetUpdateTask={onSetUpdateTask}
			/>
		</div>
	);
}

function TodosTable({ todosData, onDeleteTask, onSetUpdateTask }) {
	return (
		<table className="todos_heading_title">
			<thead>
				<tr>
					<th>task</th>
					<th>created at</th>
					<th>update at</th>
					<th>status</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{todosData.map((todo) => (
					<Todo
						key={todo.id}
						todo={todo}
						onDeleteTask={onDeleteTask}
						onSetUpdateTask={onSetUpdateTask}
					/>
				))}
			</tbody>
		</table>
	);
}

function Todo({ todo, onDeleteTask, onSetUpdateTask }) {
	function getTaskIdToDelete() {
		onDeleteTask(todo);
	}
	function getTaskIdToEdit() {
		onSetUpdateTask(todo);
	}

	return (
		<tr>
			<td>
				{" "}
				<svg
					className="svg_icon"
					width="21"
					height="21"
					viewBox="0 0 21 21"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect
						x="2.5"
						y="2.5"
						width="16"
						height="16"
						rx="8"
						stroke="#5B6097"
						stroke-width="4"
					/>
				</svg>
				<p className="todo_caption">{todo.task}</p>
			</td>
			<td>{todo.createdAt}</td>
			<td>{todo.updatedAt}</td>
			<td>{todo.status}</td>
			<td className="table_btn">
				<Button color="todo_btn" onClickHandle={() => onSetUpdateTask(todo)}>
					<svg
						className="svg_icon"
						width="25"
						height="25"
						viewBox="0 0 25 25"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M21.9548 5.91575C22.147 6.20687 22.115 6.60248 21.8587 6.85876L12.6663 16.0511C12.5721 16.1454 12.4544 16.2128 12.3255 16.2465L8.49709 17.2465C8.37223 17.2791 8.24352 17.2784 8.12259 17.2476C7.99402 17.2149 7.87425 17.1482 7.77723 17.0511C7.58896 16.8629 7.51462 16.5889 7.58191 16.3313L8.58191 12.5028C8.61138 12.39 8.66667 12.2786 8.74316 12.1912L17.9696 2.96967C18.0504 2.88891 18.1477 2.82846 18.2535 2.79163C18.332 2.76432 18.4152 2.75 18.4999 2.75C18.6989 2.75 18.8896 2.82902 19.0303 2.96967L21.8587 5.7981C21.8953 5.83471 21.9273 5.87416 21.9548 5.91575ZM20.2677 6.32843L18.4999 4.56066L9.98178 13.0788L9.35679 15.4716L11.7496 14.8466L20.2677 6.32843Z"
							fill="#FDBF46"
						/>
						<path
							d="M20.1413 17.6603C20.4147 15.3227 20.5017 12.9688 20.4023 10.6208C20.3975 10.5084 20.4398 10.399 20.5194 10.3194L21.5027 9.33609C21.6236 9.21519 21.8302 9.29194 21.8415 9.46254C22.0264 12.2522 21.9563 15.0545 21.6311 17.8346C21.3946 19.8571 19.7703 21.4421 17.7582 21.667C14.2916 22.0544 10.7083 22.0544 7.24171 21.667C5.22965 21.4421 3.60532 19.8571 3.36876 17.8346C2.95423 14.2903 2.95423 10.7097 3.36876 7.16543C3.60532 5.1429 5.22965 3.55789 7.24171 3.33301C9.87146 3.0391 12.5684 2.96815 15.2306 3.12016C15.4022 3.12996 15.4804 3.33757 15.3589 3.45909L14.3663 4.45165C14.2876 4.53034 14.1797 4.57261 14.0685 4.56885C11.842 4.49376 9.60049 4.57872 7.40832 4.82373C6.07821 4.97239 5.01272 6.022 4.85861 7.33968C4.45761 10.7682 4.45761 14.2318 4.85861 17.6603C5.01272 18.978 6.07821 20.0276 7.40832 20.1763C10.7642 20.5513 14.2357 20.5513 17.5916 20.1763C18.9217 20.0276 19.9872 18.978 20.1413 17.6603Z"
							fill="#FDBF46"
						/>
					</svg>
				</Button>
				<Button color="todo_btn" onClickHandle={() => onDeleteTask(todo)}>
					<svg
						className="svg_icon"
						width="25"
						height="25"
						viewBox="0 0 25 25"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M10.5 2.75C10.0858 2.75 9.75 3.08579 9.75 3.5V4.25H5.5C5.08579 4.25 4.75 4.58579 4.75 5C4.75 5.41421 5.08579 5.75 5.5 5.75H19.5C19.9142 5.75 20.25 5.41421 20.25 5C20.25 4.58579 19.9142 4.25 19.5 4.25H15.25V3.5C15.25 3.08579 14.9142 2.75 14.5 2.75H10.5Z"
							fill="#F06A6D"
						/>
						<path
							d="M10.5 11.15C10.9142 11.15 11.25 11.4858 11.25 11.9L11.25 18.9C11.25 19.3142 10.9142 19.65 10.5 19.65C10.0858 19.65 9.75 19.3142 9.75 18.9L9.75 11.9C9.75 11.4858 10.0858 11.15 10.5 11.15Z"
							fill="#F06A6D"
						/>
						<path
							d="M15.25 11.9C15.25 11.4858 14.9142 11.15 14.5 11.15C14.0858 11.15 13.75 11.4858 13.75 11.9V18.9C13.75 19.3142 14.0858 19.65 14.5 19.65C14.9142 19.65 15.25 19.3142 15.25 18.9V11.9Z"
							fill="#F06A6D"
						/>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M6.49142 8.41718C6.53363 8.03735 6.85468 7.75 7.23684 7.75H17.7632C18.1453 7.75 18.4664 8.03735 18.5086 8.41718L18.7087 10.2185C19.0715 13.4838 19.0715 16.7793 18.7087 20.0446L18.689 20.222C18.545 21.5181 17.5404 22.5517 16.2489 22.7325C13.7618 23.0807 11.2382 23.0807 8.75108 22.7325C7.45954 22.5517 6.455 21.5181 6.31098 20.222L6.29128 20.0446C5.92846 16.7793 5.92846 13.4838 6.29128 10.2185L6.49142 8.41718ZM7.90812 9.25L7.7821 10.3842C7.43152 13.5394 7.43152 16.7238 7.7821 19.879L7.8018 20.0563C7.87011 20.671 8.34652 21.1612 8.95905 21.247C11.3082 21.5758 13.6918 21.5758 16.0409 21.247C16.6535 21.1612 17.1299 20.671 17.1982 20.0563L17.2179 19.879C17.5685 16.7238 17.5685 13.5394 17.2179 10.3842L17.0919 9.25H7.90812Z"
							fill="#F06A6D"
						/>
					</svg>
				</Button>
			</td>
		</tr>
	);
}
