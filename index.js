const express = require('express');

const app = express();
app.use(express.json());

const projects = [];
let counter = 0;

//global middleware
function logRequests(req, res, next){
  counter++;
  console.log(counter);
  return next();
}

//local middleware
function checkProjectExists(req, res, next){
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if(!project){
    return res.status(400).json({error: 'Not found!'});
  }

  return next();
}

app.use(logRequests);

//endpoinsts

app.get('/projects', (req, res) =>{
  return res.json(projects);
});

app.get('/projects/:id', (req, res) => {
  const { id } = req.params;
  
  const project = projects.find(p => p.id == id);

  return res.json(project);
});

app.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
})

app.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;
  
  return res.json(project);
});

app.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
})

app.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
})

app.listen(3010);