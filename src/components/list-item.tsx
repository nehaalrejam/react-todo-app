import { FaTrashCan } from "react-icons/fa6";
import { Checkbox, Button } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "./context/themeContext";


export default function ListItem({
  title,
  completed,
  id,
  onDelete,
  toggle,
}) {

  const themeContext = useContext(ThemeContext);
  const { darkTheme } = themeContext;

  return (
    <li
      className={`${darkTheme ? "bg" : ""} list-group ${!darkTheme ? "list-group-item" : ""} p-1 m-2`}
    >
      <div className="d-flex justify-content-between align-items-center">
        <Checkbox onChange={() => toggle(id)} checked={completed} />
        <span
          className={`${darkTheme ? "text-light" : ""} ${completed ? "text-decoration-line-through" : ""}`}
        >
          {title}
        </span>
        <button onClick={() => onDelete(id)} className="btn "><FaTrashCan /></button>

      </div>
    </li>
  );
}
