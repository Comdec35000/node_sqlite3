const childprocess = require("child_process");
const fs = require('fs');
const path = require('path');
const QueryResponse = require("./query_response");
const SQLiteError = require('./sqlite_error');


module.exports = class Connection {
  /**
   * 
   * @param {path} addr The path to the database file 
   */
  constructor(addr) {

    if(!addr || typeof addr != 'string')
      throw new Error('Invalid database address : ' + addr);

    // Format the path to an absolute path
    if(!path.isAbsolute(addr)) addr = path.join(process.cwd(), addr);

    // Check the extention of the file targetted
    if(!(path.extname(addr) === ".db")) {
      
      // Checks if the file has an extension
      if(path.extname(addr)) 
        throw new Error('The database file should end with the \'.db\' extensiton ! Current is : ' + path.extname(addr));
    
      addr += ".db";  
    }

    this.addr = addr;
    
    this.createDirTree();
  }

  /**
   * Create recursively the folder tree for the database file
   */
  createDirTree() {
    const dir = this.addr.split(path.sep);
    dir.shift();
    dir.pop();

    const cwd = process.cwd();
    this.createDir(path.parse(this.addr).root + dir.shift(), dir);

    if(!fs.existsSync(this.addr)) fs.writeFileSync(this.addr, '');
    
    process.chdir(cwd);
  }

  createDir(dirname, list) {
    process.chdir(dirname);

    const next = list.shift();
    const nextPath = path.join(process.cwd(), next)

    if(!fs.existsSync(nextPath)) fs.mkdirSync(nextPath)
    if(list.length > 0) this.createDir(next, list);
  }

  async runSql(sql) {
    return new Promise((resolve, rejects) => {

      let python = null;
      try {
        python = childprocess.spawn("python", [path.join(__dirname, "../python/execute.py"), this.addr, sql]);
      } catch(e) {
        rejects(e);
      } finally {
        if(!python) rejects(new Error('Unable to call child process'));
      }
      const response = new QueryResponse();

      python.stdout.on('data', (data) => { 
        const rows = JSON.parse(data.toString('utf-8'))
        response.setRows(rows)
      })

      python.stderr.on('data', (err) => { 
        response.setError(new SQLiteError(err.toString('utf-8'), sql));
      });

      python.on('close', (code) => {
        resolve(response);
      });
    })
  }
}
