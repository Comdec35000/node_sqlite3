const AsciiTable = require('ascii-table');

module.exports = class QueryResponse {

  constructor() {
    this.error = undefined;
    this.rows = [];
  }

  setError(err) { this.error = err }

  setRows(rows) { this.rows = rows }

  toString() {
    if(this.error) return this.error.toString();
    if(this.rows.length <= 0) return "Empty Result";
    
    const table = new AsciiTable.factory({
      heading: Object.keys(this.rows[0]),
      rows : []
    });

    this.rows.forEach(row => table.addRow(Object.values(row)))

    return table.toString();
  }
}