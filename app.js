require('dotenv').config();

const contactosRoutes = require('./routes/contactos.routes');
const usersRoutes = require('./routes/users.routes');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');

const ticketsRoutes = require('./routes/tickets.routes');
const ordenesRoutes = require('./routes/ordenes.routes');

const stockRoutes = require('./routes/stock.routes');


const app = express();
const db = new sqlite3.Database(process.env.DB_PATH || './tickets.db');
const backupDir = process.env.BACKUP_DIR || './backups';

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
app.use(helmet());

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
  '/api/ordenes-servicio',
  ordenesRoutes(db, auth, logAction)
);

app.use(
  '/api/users',
  usersRoutes(db, auth, logAction)
);
app.use(
  '/api/contactos',
  contactosRoutes(db, auth, logAction)
);

app.use(
  '/api/stock-service',
  stockRoutes(db, auth, logAction)
);

// AUTH
function auth(req,res,next){

  console.log("SESSION:");
  console.log(req.session);

  if(!req.session.user){

    console.log("NO HAY USER EN SESSION");

    return res.status(401).json({
      error:'No autorizado'
    });

  }

  console.log("USER OK:", req.session.user.username);

  next();

}

function onlyAdmin(req,res,next){

  if(!req.session.user || req.session.user.role !== 'admin'){
    return res.status(403).json({error:'forbidden'});
  }

  next();
}

function requireRole(role){

  return function(req,res,next){

    if(!req.session.user){
      return res.status(401).json({error:'no auth'});
    }

    if(req.session.user.role !== role){
      return res.status(403).json({error:'forbidden'});
    }

    next();
  };
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

db.run(`
  CREATE TABLE IF NOT EXISTS contacts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT,
    nombre TEXT,
    marca TEXT,
    telefono TEXT,
    direccion TEXT,
    notas TEXT
  )
`);


db.run(`
  CREATE TABLE IF NOT EXISTS stock_service(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    marca TEXT,
    modelo TEXT,
    estado TEXT,
    precio REAL,
    numeroSerie TEXT,
    garantia TEXT,
    quienRepara TEXT,
    anioFabricacion TEXT,
    fechaCompra TEXT,
    observaciones TEXT,
    fechaAlta TEXT
  )
`);

  const hash = bcrypt.hashSync('1234',10);

  db.run(`
    INSERT OR IGNORE INTO users
    (id,username,password,role)
    VALUES (1,'admin',?, 'admin')
  `,[hash]);

});

db.run(`
  ALTER TABLE ordenes_servicio
  ADD COLUMN telefono TEXT
`, (err) => {
  if (err) {
    console.log("telefono ya existe o no se pudo agregar:", err.message);
  }
});


db.run(`
  ALTER TABLE ordenes_servicio
  ADD COLUMN direccion TEXT
`, (err) => {
  if (err) {
    console.log("direccion ya existe o no se pudo agregar:", err.message);
  }
});

db.run(`
  ALTER TABLE ordenes_servicio
  ADD COLUMN localidad TEXT
`, (err) => {
  if (err) {
    console.log("localidad ya existe o no se pudo agregar:", err.message);
  }
});

db.run(`
  ALTER TABLE ordenes_servicio
  ADD COLUMN entreCalles TEXT
`, (err) => {
  if (err) {
    console.log("entreCalles ya existe o no se pudo agregar:", err.message);
  }
});

db.run(`
  ALTER TABLE ordenes_servicio
  ADD COLUMN tarea TEXT
`, (err) => {
  if (err) {
    console.log("tarea ya existe o no se pudo agregar:", err.message);
  }
});

db.run(`
  ALTER TABLE stock_service
  ADD COLUMN producto TEXT
`, (err) => {
  if (err) {
    console.log("producto ya existe:", err.message);
  }
});

db.run(`
  ALTER TABLE stock_service
  ADD COLUMN procedencia TEXT
`, (err) => {
  if (err) {
    console.log("procedencia ya existe:", err.message);
  }
});

db.run(`
  ALTER TABLE stock_service
  ADD COLUMN reparado TEXT
`, (err) => {
  if (err) {
    console.log("reparado ya existe:", err.message);
  }
});

db.run(`
  ALTER TABLE stock_service
  ADD COLUMN empresaReparadora TEXT
`, (err) => {
  if (err) {
    console.log("empresaReparadora ya existe:", err.message);
  }
});

db.run(`
  ALTER TABLE stock_service
  ADD COLUMN tecnicoReparador TEXT
`, (err) => {
  if (err) {
    console.log("tecnicoReparador ya existe:", err.message);
  }
});

db.run(`
  ALTER TABLE stock_service
  ADD COLUMN duracionGarantia TEXT
`, (err) => {
  if (err) {
    console.log("duracionGarantia ya existe:", err.message);
  }
});

db.run(`
  ALTER TABLE stock_service
  ADD COLUMN producto TEXT
`, (err) => {
  if (err) {
    console.log("producto ya existe:", err.message);
  }
});

db.run(`
  ALTER TABLE stock_service
  ADD COLUMN fechaIngresoStock TEXT
`, (err) => {
  if (err) {
    console.log("fechaIngresoStock ya existe:", err.message);
  }
});

db.run(`
  ALTER TABLE stock_service
  ADD COLUMN estadoProducto TEXT
`, (err) => {
  if (err) {
    console.log("estadoProducto ya existe:", err.message);
  }
});

db.run(`
  ALTER TABLE stock_service
  ADD COLUMN procedencia TEXT
`, (err) => {
  if (err) {
    console.log("procedencia ya existe:", err.message);
  }
});

db.run(`
  ALTER TABLE stock_service
  ADD COLUMN garantiaActivo TEXT
`, (err) => {
  if (err) {
    console.log("garantiaActivo ya existe:", err.message);
  }
});

db.run(`
  ALTER TABLE stock_service
  ADD COLUMN garantiaDuracion TEXT
`, (err) => {
  if (err) {
    console.log("garantiaDuracion ya existe:", err.message);
  }
});

db.run(`
  ALTER TABLE stock_service
  ADD COLUMN reparado TEXT
`, (err) => {
  if (err) {
    console.log("reparado ya existe:", err.message);
  }
});

db.run(`
  ALTER TABLE stock_service
  ADD COLUMN tipoReparacion TEXT
`, (err) => {
  if (err) {
    console.log("tipoReparacion ya existe:", err.message);
  }
});

db.run(`
  ALTER TABLE stock_service
  ADD COLUMN empresaReparadora TEXT
`, (err) => {
  if (err) {
    console.log("empresaReparadora ya existe:", err.message);
  }
});

db.run(`
  ALTER TABLE stock_service
  ADD COLUMN tecnicoReparador TEXT
`, (err) => {
  if (err) {
    console.log("tecnicoReparador ya existe:", err.message);
  }
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
          ok:true,
          username:user.username,
          role:user.role
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
app.get('/api/logs',auth,onlyAdmin,(req,res)=>{

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
app.get('/api/logs/export',auth,onlyAdmin,(req,res)=>{

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


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{

  console.log(
    "Servidor OK http://localhost:3000"
  );

});

