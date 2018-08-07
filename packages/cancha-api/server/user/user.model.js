
async function assignRoleToUser(db, user) {
  const role = await db.select()
        .from('role')
        .where({id: user.roleId}).first()
  user.role = role
}

module.exports = { assignRoleToUser }
