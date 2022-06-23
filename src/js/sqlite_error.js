
module.exports = class SQLiteError extends Error {
  constructor(pyError, sql) {
    const temp = pyError.split(/\n/g)
    temp.pop()
    
    const message = 
      "\nAn error occured running the SQL : " + sql + "\n" +
      "Error message : " + temp.pop() + "\n";

    super(message);
  }
}