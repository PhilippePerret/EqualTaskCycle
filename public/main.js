import { PORT } from "./constants.js";

const HOST = `http://localhost:${PORT}/`;

// GET
const tasks = await fetch(HOST + 'api/tasks').then(r => r.json());

// POST
await fetch(HOST + 'api/task/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ taskId: 123 })
});

const Essai = function(){
  console.log("C'est un essai");
  document.body.querySelector('#message').innerHTML = "C'est un essai !"
}