const express = require('express');
const { mongoConnect } = require('./configs/mongo.config');
mongoConnect();
const Person = require('./models/person.model');
const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());

async function personId() {
  let [person] = await Person.find({})?.sort({ id: -1 }).limit(1);
  if (!person) return;
  console.log(person);
  const newPersonId = person.id + 1;
  return newPersonId;
}
async function existingUser(name) {
  let user = await Person.findOne({ name });
  console.log(user);
  return user;
}

app.post('/api', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({error: 'Name should not be empty'});
  if (typeof name !== 'string')
    return res.status(400).json({error: 'Please enter a valid name'});
  const userExists = await existingUser(name);
  if (userExists) return res.status(400).json({error: 'User already exists'});
  const newPersonId = await personId();
  console.log(newPersonId);
  const newPerson = await new Person({
    id: newPersonId,
    name
  });
  console.log(newPerson);
  newPerson.save();
  return res.status(200).json({
    success: true,
    data: newPerson
  });
});

app.get('/api/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (!id) return res.status(400).json({error: 'Id should not be empty'});
  if (isNaN(id) === true)
    return res.status(400).json({error: 'Please enter a valid id'});
  const existingPerson = await Person.findOne({ id });
  console.log(existingPerson);
  if (!existingPerson) return res.status(400).json({error: 'Person not found'});
  return res.status(200).json({
    success: true,
    data: existingPerson
  });
});

app.put('/api/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  console.log(id);
  if (!id) return res.status(400).json({ error: 'Id should not be empty' });
  if (isNaN(id) === true)
    return res.status(400).json({error: 'Please enter a valid id'});
  const existingPerson = await Person.findOne({ id });
  console.log(existingPerson);
  if (!existingPerson) return res.status(400).json({error: 'Person not found'});
  const updatedPerson = await Person.updateOne({ id }, { name });

  return res.status(200).json({
    success: true,
    data: 'Person has been updated'
  });
});

app.delete('/api/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'Id should not be empty' });
  if (isNaN(id) === true)
    return res.status(400).json({error: 'Please enter a valid id'});
  const existingPerson = await Person.findOne({ id });
  if (!existingPerson) return res.status(400).json({error: 'Person not found'});
  const deletedPerson = await Person.deleteOne({ id });
  return res.status(200).json({
    success: true,
    data: 'Person has been deleted'
  });
});

app.listen(PORT, () => console.log('Listening at port 8000'));
