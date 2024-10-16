import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './App.css';

function App() {
  const [foodName, setFoodName] = useState('');
  const [days, setDays] = useState(0);
  const [foodList, setFoodList] = useState([]);
  const [newFoodName, setNewFoodName] = useState('');

  useEffect(() => {
    Axios({
      method: 'GET',
      url: 'http://localhost:3001/read'
    })
      .then((response) => {
        setFoodList(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
        console.log("response", response)
      });
    }, []);
    const addToList = () => {
      Axios({
        method: 'POST',
        url: 'http://localhost:3001/insert',
        data: {
          foodName: foodName,
          days: days
        }
      })
      
    .then((response) => {
      if (response.status === 200) {
        setFoodList([...foodList, { _id: response.data._id, foodName: foodName, daysSinceIAte: days }]);
      } else {
        console.log('Failed to add food item:', response.status, response.statusText);
      }
    })
    .catch((error) => {
      console.error('There was an error adding the food item!', error);
    });
  };
  
  const updateFood = (id) => {
    Axios({
      method: 'PUT',
      url: 'http://localhost:3001/update',
      data: {
        id: id,
        newFoodName: newFoodName
      }
    })
      .then(() => {
        setFoodList(foodList.map((food) => (food._id === id ? { ...food, foodName: newFoodName } : food)));
        setNewFoodName('');
      })
      .catch((error) => {
        console.error('There was an error updating the food item!', error);
      });
  };

  
  const deleteFood = (id) => {
    Axios({
      method: 'DELETE',
      url: `http://localhost:3001/delete/${id}`
    })
      .then(() => {
        setFoodList(foodList.filter((food) => food._id !== id));
      })
      .catch((error) => {
        console.error('There was an error deleting the food item!', error);
      });
  };

  return (
    <div className="App">
      <h1>CRUD APP</h1>

      <label>Food Name</label>
      <input
        type="text"
        onChange={(e) => setFoodName(e.target.value)}
      />
      <label>Days Since Last Ate</label>
      <input
        type="number"
        onChange={(e) => setDays(Number(e.target.value))}
      />
      <button onClick={addToList}>Add To List</button>

      <h1>Food List</h1>
      {foodList.map((val) => (
        <div key={val._id}>
          <h1>{val.foodName}</h1>
          <h1>{val.daysSinceIAte}</h1>
          <input
            type="text"
            placeholder="New Food Name"
            onChange={(e) => setNewFoodName(e.target.value)}
          />
          <button onClick={() => updateFood(val._id)}>Update</button>
          <button onClick={() => deleteFood(val._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
