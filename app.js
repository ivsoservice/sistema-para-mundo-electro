const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

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


// USERS
app.get('/api/users',auth,(req,res)=>{

  db.all(
    "SELECT id,username,role FROM users",
    (err,rows)=>{
      res.json(rows);
    }
  );

});


// CREAR USER
app.post('/api/users',auth,(req,res)=>{

  const {username,password,role}=req.body;

  const hash = bcrypt.hashSync(password,10);

  db.run(`
    INSERT INTO users
    (username,password,role)
    VALUES (?,?,?)
  `,[
    username,
    hash,
    role
  ],function(err){

    if(err){
      return res.status(500).json({
        error:'Error creando usuario'
      });
    }

    logAction(
      req.session.user.username,
      'CREATE_USER',
      username
    );

    res.json({
      ok:true
    });

  });

});


// EDIT USER
app.put('/api/users/:id',auth,(req,res)=>{

  const {username,password,role}=req.body;

  if(password){

    const hash = bcrypt.hashSync(password,10);

    db.run(`
      UPDATE users
      SET username=?,
      password=?,
      role=?
      WHERE id=?
    `,[
      username,
      hash,
      role,
      req.params.id
    ],()=>{

      logAction(
        req.session.user.username,
        'EDIT_USER',
        username
      );

      res.json({
        ok:true
      });

    });

  }else{

    db.run(`
      UPDATE users
      SET username=?,
      role=?
      WHERE id=?
    `,[
      username,
      role,
      req.params.id
    ],()=>{

      logAction(
        req.session.user.username,
        'EDIT_USER',
        username
      );

      res.json({
        ok:true
      });

    });

  }

});


// DELETE USER
app.delete('/api/users/:id',auth,(req,res)=>{

  db.run(
    "DELETE FROM users WHERE id=?",
    [req.params.id],
    ()=>{

      logAction(
        req.session.user.username,
        'DELETE_USER',
        req.params.id,
        'WARN'
      );

      res.json({
        ok:true
      });

    }
  );

});


// CREATE TICKET
app.post('/api/tickets',auth,(req,res)=>{

const d = req.body;

if(!d || !d.titulo || !d.cliente || !d.tipo){
return res.status(400).json({
error:'FALTAN DATOS'
});
}

db.run(`
INSERT INTO tickets
(
tipo,
titulo,
cliente,
marca,
fechaIngreso,
tecnico,
descripcion,
prioridad,
estado,
eliminado
)
VALUES (?,?,?,?,?,?,?,?,?,?)
`,
[
d.tipo,
d.titulo,
d.cliente,
d.marca,
d.fechaIngreso,
d.tecnico,
d.descripcion,
d.prioridad,
d.estado || 'Ingresado',
0
],
function(err){

if(err){
console.log(err);
return res.status(500).json({
error: err.message
});
}

db.run(
"UPDATE tickets SET numeroCaso=? WHERE id=?",
['CASO-'+this.lastID,this.lastID]
);

res.json({ok:true});

});

});


// LISTAR
app.get('/api/tickets',auth,(req,res)=>{

  let page = parseInt(req.query.page) || 1;
  let limit = 20;

  let offset = (page - 1) * limit;

  let tipo = req.query.tipo || 'diario';

  db.get(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN tipo='diario' THEN 1 ELSE 0 END) as totalDiario,
      SUM(CASE WHEN tipo='distribuidora' THEN 1 ELSE 0 END) as totalDistribuidora
    FROM tickets
    WHERE eliminado=0
  `,
  (err,countResult)=>{

    db.get(`
      SELECT COUNT(*) as totalTipo
      FROM tickets
      WHERE eliminado=0
      AND tipo=?
    `,
    [tipo],
    (err,totalTipoResult)=>{

      let totalPages =
      Math.ceil(totalTipoResult.totalTipo / limit);

      db.all(`
        SELECT *
        FROM tickets
        WHERE eliminado=0
        AND tipo=?
        ORDER BY id DESC
        LIMIT ?
        OFFSET ?
      `,
      [tipo, limit, offset],
      (err,rows)=>{

        res.json({
          tickets: rows,
          totalPages: totalPages,
          currentPage: page,
          totalTickets: countResult.total,
          totalDiario: countResult.totalDiario || 0,
          totalDistribuidora: countResult.totalDistribuidora || 0
        });

      });

    });

  });

});


// HISTORIAL
app.get('/api/tickets/historial',auth,(req,res)=>{

  db.all(`
    SELECT *
    FROM tickets
    WHERE eliminado=1
    ORDER BY id DESC
  `,(err,rows)=>{

    res.json(rows);

  });

});


// BUSCADOR GLOBAL
app.get('/api/tickets/search', auth, (req, res) => {

  const q = req.query.q;

  if (!q) {
    return res.json([]);
  }

  const sql = `
    SELECT *
    FROM tickets
    WHERE eliminado=0
    AND (
      numeroCaso LIKE ?
      OR titulo LIKE ?
      OR cliente LIKE ?
      OR marca LIKE ?
      OR descripcion LIKE ?
    )
    ORDER BY id DESC
    LIMIT 50
  `;

  const value = `%${q}%`;

  db.all(sql, [value, value, value, value, value], (err, rows) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error en búsqueda' });
    }

    res.json(rows);

  });

});


// 1 TICKET
app.get('/api/tickets/:id',auth,(req,res)=>{

  db.get(
    "SELECT * FROM tickets WHERE id=?",
    [req.params.id],
    (err,row)=>{

      res.json(row);

    }
  );

});


// EDITAR TICKET
app.put('/api/tickets/:id',auth,(req,res)=>{

  const d=req.body;

  db.run(`
    UPDATE tickets SET
    tipo=?,
    titulo=?,
    cliente=?,
    marca=?,
    fechaIngreso=?,
    tecnico=?,
    descripcion=?,
    prioridad=?,
    estado=?
    WHERE id=?
  `,
  [
    d.tipo,
    d.titulo,
    d.cliente,
    d.marca,
    d.fechaIngreso,
    d.tecnico,
    d.descripcion,
    d.prioridad,
    d.estado,
    req.params.id
  ],
  ()=>{

    logAction(
      req.session.user.username,
      'EDIT_TICKET',
      req.params.id
    );

    res.json({
      ok:true
    });

  });

});


// DELETE TICKET
app.put('/api/tickets/delete/:id',auth,(req,res)=>{

  db.run(
    "UPDATE tickets SET eliminado=1 WHERE id=?",
    [req.params.id],
    ()=>{

      logAction(
        req.session.user.username,
        'DELETE_TICKET',
        req.params.id,
        'WARN'
      );

      res.json({
        ok:true
      });

    }
  );

});


// RESTORE
app.put('/api/tickets/restore/:id',auth,(req,res)=>{

  db.run(
    "UPDATE tickets SET eliminado=0 WHERE id=?",
    [req.params.id],
    ()=>{

      logAction(
        req.session.user.username,
        'RESTORE_TICKET',
        req.params.id
      );

      res.json({
        ok:true
      });

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

// BUSCADOR GLOBAL
app.get('/api/tickets/search', auth, (req, res) => {

  const q = req.query.q;

  if (!q) {
    return res.json([]);
  }

  const sql = `
    SELECT *
    FROM tickets
    WHERE eliminado=0
    AND (
      numeroCaso LIKE ?
      OR titulo LIKE ?
      OR cliente LIKE ?
      OR marca LIKE ?
      OR descripcion LIKE ?
    )
    ORDER BY id DESC
    LIMIT 50
  `;

  const value = `%${q}%`;

  db.all(sql, [value, value, value, value, value], (err, rows) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error en búsqueda' });
    }

    res.json(rows);

  });

});