module.exports = function(db) {
  db["space"].belongsTo(db["user"], {
    onDelete: "SET NULL",
    onUpdate: "CASCADE"
  });
};
