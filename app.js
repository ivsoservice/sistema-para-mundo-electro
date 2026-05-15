const usersRoutes = require('./routes/users.routes');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const ticketsRoutes = require('./routes/tickets.routes');


const app = express();
const db = new sqlite3.Database('./tickets.db');
const backupDir = './backups';

if(!fs.existsSync(backupDir)){
fs.mkdirSync(backupDir);
}

function hacerBackup(){

const fecha = new Date()
.toISOString()
.replace(/:/g,'-');

const destino =
path.join(
backupDir,
`tickets-${fecha}.db`
);

fs.copyFile(
'./tickets.db',
destino,
(err)=>{

if(err){

console.log('ERROR BACKUP');
console.log(err);
return;

}

console.log('BACKUP OK:',destino);

});

}

hacerBackup();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static('public'));


app.use(session({
  secret:'mundo-electro-super-seguro',
  resave:false,
  saveUninitialized:false,
  cookie:{
    httpOnly:true,
    secure:false
  }
}));

app.use(
'/api/tickets',
ticketsRoutes(db, auth, logAction)
);
app.use(
  '/api/users',
  usersRoutes(db, auth, logAction)
);

// AUTH
function auth(req,res,next){

  if(!req.session.user){
    return res.status(401).json({
      error:'No autorizado'
    });
  }

  next();

}

// LOGS
function logAction(user,accion,detalle,nivel='INFO'){

  db.run(`
    INSERT INTO logs
    (usuario,accion,detalle,nivel,fecha)
    VALUES (?,?,?,?,?)
  `,[
    user || 'sistema',
    accion,
    detalle,
    nivel,
    new Date().toISOString()
  ]);

}

// DB
db.serialize(()=>{

  db.run(`
    CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tickets(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numeroCaso TEXT,
      tipo TEXT,
      titulo TEXT,
      cliente TEXT,
      marca TEXT,
      fechaIngreso TEXT,
      tecnico TEXT,
      descripcion TEXT,
      prioridad TEXT,
      estado TEXT DEFAULT 'Ingresado',   
      eliminado INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS logs(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT,
      accion TEXT,
      detalle TEXT,
      nivel TEXT,
      fecha TEXT
    )
  `);

  const hash = bcrypt.hashSync('1234',10);

  db.run(`
    INSERT OR IGNORE INTO users
    (id,username,password,role)
    VALUES (1,'admin',?, 'admin')
  `,[hash]);

});


// LOGIN
app.post('/api/login',(req,res)=>{

  const {username,password}=req.body;

  db.get(
    "SELECT * FROM users WHERE username=?",
    [username],
    async (err,user)=>{

      if(err){
        return res.status(500).json({
          error:'db'
        });
      }

      if(!user){
        return res.status(401).json({
          error:'Usuario incorrecto'
        });
      }

      try{

        const ok = await bcrypt.compare(
          password,
          user.password
        );

        if(!ok){
          return res.status(401).json({
            error:'Password incorrecta'
          });
        }

        req.session.user=user;

        logAction(
          user.username,
          'LOGIN',
          'LOGIN OK'
        );

        res.json({
          ok:true
        });

      }catch(e){

        res.status(500).json({
          error:'bcrypt'
        });

      }

    }
  );

});


// LOGS
app.get('/api/logs',auth,(req,res)=>{

  let {usuario,accion,desde,hasta}=req.query;

  let query="SELECT * FROM logs WHERE 1=1";
  let params=[];

  if(usuario){
    query+=" AND usuario LIKE ?";
    params.push('%'+usuario+'%');
  }

  if(accion){
    query+=" AND accion LIKE ?";
    params.push('%'+accion+'%');
  }

  if(desde){
    query+=" AND fecha >= ?";
    params.push(desde);
  }

  if(hasta){
    query+=" AND fecha <= ?";
    params.push(hasta);
  }

  query+=" ORDER BY id DESC LIMIT 500";

  db.all(query,params,(err,rows)=>{

    res.json(rows);

  });

});


// EXPORT CSV
app.get('/api/logs/export',auth,(req,res)=>{

  db.all(
    "SELECT * FROM logs ORDER BY id DESC",
    (err,rows)=>{

      let csv="usuario,accion,detalle,nivel,fecha\n";

      rows.forEach(l=>{

        csv+=`${l.usuario},${l.accion},${l.detalle},${l.nivel},${l.fecha}\n`;

      });

      res.header('Content-Type','text/csv');

      res.attachment('logs.csv');

      res.send(csv);

    }
  );

});


const PORT=3000;

app.listen(PORT,()=>{

  console.log(
    "Servidor OK http://localhost:3000"
  );

});

