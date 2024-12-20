import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TodoForm from "./components/todo-form";
import { useContext, useEffect, useState } from "react";
import ListItem from "./components/list-item";
import { FaNoteSticky, FaSun, FaTrashCan, FaMoon } from "react-icons/fa6";
import toast from "react-hot-toast";
import { Card, IconButton } from "@mui/material";
import { ThemeContext } from "./components/context/themeContext";
import Loading from "./components/loading";


export default function App() {
  const { toggleTheme, darkTheme } = useContext(ThemeContext);

  const [notes, setNotes] = useState(() => {
    const value = localStorage.getItem("notes");
    return value ? JSON.parse(value) : [];
  });

  useEffect(() => {
    window.localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])
  const [text, setText] = useState("");

  // so I created a search state to hold the value the user is entering in input box
  const [search, setSearch] = useState("");
  // I created a searchResult state to hold the result of the search after filtering the notes, I had to create this state to avoid the filter method from making changes to my origial notes state
  const [searchResult, setSearchResult] = useState(notes);

  useEffect(() => {
    if (search === "") {
      setSearchResult(notes);
      // it will render the original notes if the input is empty
    } else {
      setSearchResult(
        notes.filter((note) =>
          note.title.toLowerCase().includes(search.toLowerCase())
          // now the filter method checks if the title contains what we have entered in the input and if it does, it adds it to the searchResult array
        )
      );
    }
  }, [search, notes]);

  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  function handleChange(e) {
    setText(e.target.value);
  }

  function addNote() {
    if (text === "") {
      return toast.error("Please enter a todo");
      // I also found that the addNote function was still adding the note even if the input was empty so i fixed it by adding a condition statement
    } else {
      setNotes((prevNotes) => [
        ...prevNotes,
        { id: crypto.randomUUID(), title: text, completed: false },
      ]);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    toast.promise(
      new Promise((resolve) => {
        addNote();
        resolve();
      }),
      {
        loading: "Adding note...",
        success: <span>{`${text} Added!`}</span>,
        error: <span>Failed to add note</span>,
      },
      {
        duration: 8000,
      }
    );
    setText("");
  }

  function handleDelete(id) {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    toast.success("Todo  Deleted!");
  }

  function toggleNote(id) {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, completed: !note.completed } : note
      )
    );
  }


  return (
    <div
      className={`h-full container-fluid justify-content-center align-items-center ${darkTheme ? "bg" : ""
        }`}
    >
      <div className="d-flex justify-content-evenly align-items-center w-100">
        {/* also to bring the dark mode toggle btn inline with the title i changed 'align-content-center' to 'align-items-center' */}
        <center className="mt-5 mb-5">
          <span className={`${darkTheme ? "text-light" : ""} header`}>
            <img src="/icon.png" alt="logo" style={{ width: 200 }} />
            <span>TODO APP</span>
          </span>
        </center>
        <span>
          <button
            onClick={toggleTheme}
            className={darkTheme ? "text-light btn" : "btn"}

          >
            {darkTheme ? <FaSun size={25} /> : <FaMoon size={25} />}
          </button>
        </span>
      </div>

      <div className="row col-sm-10 d-flex gap-2 ">
        <Card
          className={`container ${!darkTheme ? "border" : ""
            } col-sm-5 p-5 me-1 rounded ${darkTheme ? "bg-black" : ""} `}
        >
          <TodoForm text={text} change={handleChange} submit={handleSubmit} />
        </Card>
        <Card
          className={`d-flex flex-column col-sm-5 ${!darkTheme ? "border" : ""
            } p-5 gap-2 rounded ${darkTheme ? "bg-black" : ""}`}
        >
          <div className="w-100">
            <input type="text" value={search} placeholder="Search Todos" onChange={(e) => setSearch(e.target.value)} className="form-control " />
          </div>
          <span
            className={`text-center accordion mb-2 ${darkTheme ? "text-light" : ""
              }`}
          >
            <FaNoteSticky /> <span>Todos </span>
            <span className="badge bg-primary">{notes.length}</span>
          </span>
          {notes.length !== 0 && (
            <div className="d-flex justify-content-end">
              <span className={`${darkTheme ? "text-light accordion" : "accordion"} d-flex align-items-center`} >
                Remove all{" "}
                <IconButton color="error" size="small" onClick={() => setNotes([])}>
                  <FaTrashCan />
                </IconButton>{" "}
              </span>
            </div>
          )}
          <ul className="list-group flex-column ">
            {notes.length === 0 ? (
              <li className={`list-group-item ${darkTheme ? "text-light" : ""} bg-transparent`}>
                No Todos available
              </li>
            ) : searchResult.length > 0 ? (
              searchResult.map((note) => (
                // so I changed somethings here, the list of notes to be displayed is now rendered based on the value of searchResult instead of notes, so as to display the search results, I tested on some notes and this is working fine
                <ListItem
                  key={note.id}
                  id={note.id}
                  toggle={toggleNote}
                  completed={note.completed}
                  title={note.title}
                  onDelete={handleDelete}
                />
              ))
            ) : (

              // so if the searchResult array is empty then that means no "note.title" includes the "search" hence an error message is displayed instead
              <li className={`list-group-item ${darkTheme ? "text-light" : ""} bg-transparent`}>
                No Matching Results
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  )
}


// all the changes I did are mentioned in the comments 