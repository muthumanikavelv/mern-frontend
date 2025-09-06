import { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editId, seteditId] = useState("-1");

  // Edit State
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "http://localhost:3000";

  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => res.json())
        .then((newTodo) => {
          setTodos([...todos, newTodo]);
          setSuccess("Item added successfully!");
          setTimeout(() => setSuccess(""), 3000);
          setTitle("");
          setDescription("");
        })
        .catch(() => setError("Cannot create Todo item. Please check again!"));
    }
  };

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => setTodos(res));
  };

  useEffect(() => {
    getItems();
  }, []);

  const handleUpdate = () => {
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiUrl + "/todos/" + editId, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Update failed");
          return res.json();
        })
        .then(() => {
          const updatedTodos = todos.map((item) => {
            if (item._id === editId) {
              return { ...item, title: editTitle, description: editDescription };
            }
            return item;
          });
          setTodos(updatedTodos);
          setTitle("");
          setDescription("");
          setSuccess("Item updated successfully!");
          setTimeout(() => setSuccess(""), 3000);
          seteditId(-1);
        })
        .catch(() => setError("Cannot update Todo item. Please check again!"));
    }
  };

  const handleEditCancel = () => {
    seteditId(-1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Please confirm before deleting it")) {
      fetch(apiUrl + "/todos/" + id, {
        method: "DELETE",
      }).then(() => {
        const updatedTodos = todos.filter((item) => item._id !== id);
        setTodos(updatedTodos);
      });
    }
  };

  return (
    <>
      <div className="row p-3 bg-success text-light">
        <h1> Create Todo List with MERN </h1>
      </div>

      <div className="container mt-3">
        <h3>Add Item</h3>
        {success && <p className="text-success">{success}</p>}
        <div className="form-group d-flex gap-2">
          <input
            className="form-control"
            placeholder="Enter the Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
          />
          <input
            className="form-control"
            placeholder="Enter the Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            type="text"
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>

      <div className="container mt-4">
        <h3>Tasks to be completed</h3>
        <div className="col-md-8 mx-auto">
          <ul className="list-group">
            {todos.map((item) => (
              <li
                key={item._id}
                className="list-group-item bg-info d-flex justify-content-between align-items-start my-2"
              >
                <div className="d-flex flex-column text-start">
                  {editId !== item._id ? (
                    <>
                      <span className="fw-bold">{item.title}</span>
                      <span className="text-black">{item.description}</span>
                    </>
                  ) : (
                    <div className="form-group d-flex gap-2">
                      <input
                        className="form-control"
                        placeholder="Enter the Title"
                        onChange={(e) => setEditTitle(e.target.value)}
                        value={editTitle}
                        type="text"
                      />
                      <input
                        className="form-control"
                        placeholder="Enter the Description"
                        onChange={(e) => setEditDescription(e.target.value)}
                        value={editDescription}
                        type="text"
                      />
                    </div>
                  )}
                </div>

                <div className="d-flex gap-2">
                  {editId !== item._id ? (
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        seteditId(item._id);
                        setEditTitle(item.title);
                        setEditDescription(item.description);
                      }}
                    >
                      Edit
                    </button>
                  ) : (
                    <button className="btn btn-success" onClick={handleUpdate}>
                      Update
                    </button>
                  )}
                  {editId !== item._id ? (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  ) : (
                    <button className="btn btn-danger" onClick={handleEditCancel}>
                      Cancel
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
