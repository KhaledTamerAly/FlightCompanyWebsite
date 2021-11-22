import './App.css';
import DeleteButton from './components/AdminCRUD';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState } from 'react';

function App() {
  const[isDeleted,setIsDeleted] = useState(false);

  function deleteFlight()
  {
    console.log("test");
    setIsDeleted(true);
  }

  return (
    <div>
     <DeleteButton id = "6196d1e15fae191b11dc5c0a" remove={isDeleted} onDelete={deleteFlight}/>
     </div>
  );
}

export default App;