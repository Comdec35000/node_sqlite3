
module.exports = class SQLiteError extends Error {
  constructor(pyError, sql) {
    const temp = pyError.split(/\n/g)
    
    const message = 
      temp.find(l => l.startsWith('sqlite')) + "\n" + 
      "An error occured running the SQL : " + sql + "\n";

    super(message);
  }
}