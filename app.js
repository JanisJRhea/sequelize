
const express = require('express');
const db = require('./database');  

const app = express();
app.use(express.json());

db.authenticate()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
  });

db.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });

// Route to handle bulk data insertion
app.post('/bulk_student_data', async (req, res) => {
  const bulkData = req.body;  
  try {
    const result = await db.User.bulkCreate(bulkData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle updating a record
app.put('/update_student/:id', async (req, res) => {
  const { id } = req.params;  
  const updatedData = req.body; 

  try {
    const [updated] = await db.User.update(updatedData, {
      where: { id: id }
    });

    if (updated) {
      const updatedUser = await db.User.findByPk(id);
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle deleting a record
app.delete('/delete_student/:id', async (req, res) => {
  const { id } = req.params;  

  try {
    const deleted = await db.User.destroy({
      where: { id: id }
    });

    if (deleted) {
      res.status(204).send(); 
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
