const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const FoodModel = require('./models/food');

app.use(express.json());
app.use(cors());

mongoose
  .connect('mongodb+srv://fishrifle1234:password12345@crud.q9hsv.mongodb.net/food?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.post('/insert', async (req, res) => {
  const { foodName, days } = req.body;

  const food = new FoodModel({ foodName: foodName, daysSinceIAte: days });

  try {
    const savedFood = await food.save();
    res.send(savedFood);
  } catch (err) {
    console.log('Error saving food:', err);
    
  }
});

app.get('/read', async (req, res) => {
  try {
    const result = await FoodModel.find({});
    res.status(200).send(result);
  } catch (err) {
    console.error('Error fetching data:', err);
    
  }
});

app.put('/update', async (req, res) => {
  const { newFoodName, id } = req.body;

  try {
    const updatedFood = await FoodModel.findById(id);
    if (updatedFood) {
      updatedFood.foodName = newFoodName;
      await updatedFood.save();
      res.send('Food updated successfully');
    } else {
      
    }
  } catch (err) {
    console.log('Error updating food:', err);
    
  }
});

app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const deletedFood = await FoodModel.findByIdAndDelete(id);
    if (deletedFood) {
      res.json({message: "NO"})
    } else {
      res.status(404).send('Food not found');
    }
  } catch (err) {
    console.error('Error deleting food:', err);
    res.status(500).send('Error deleting food');
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
