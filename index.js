const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

  const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String
  });
  
  // Create a model
  const Item = mongoose.model('Item', itemSchema);

  app.post('/api/items', async (req, res) => {
    try {
      const newItem = new Item(req.body);
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  app.get('/api/items', async (req, res) => {
    try {
      const items = await Item.find();
      res.status(200).json(items);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/items/:id', async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      res.status(200).json(item);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.put('/api/items/:id', async (req, res) => {
    try {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
      res.status(200).json(updatedItem);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete('/api/items/:id', async (req, res) => {
    try {
      const deletedItem = await Item.findByIdAndDelete(req.params.id);
      if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
      res.status(200).json({ message: 'Item deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  const port = process.env.PORT_NO || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});