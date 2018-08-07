const db = require('cancha-db');

const rolesData = [
  { type: 'OWNER' },
  { type: 'CLIENT' },
  { type: 'ADMIN' }
]
const statesData = [
  { name: 'INACTIVE' },
  { name: 'ACTIVE' },
  { name: 'PREMIUM' }
];

const seed = async function() {
  try {
  await db('role').del()
  await db('state').del();
  await db('role').insert(rolesData);
  await db('state').insert(statesData);
    db.destroy()
  } catch(e) {
  }
};

seed(); // :v
