const AsciiTable = require('ascii-table');

module.exports = class QueryResponse {

  constructor() {
    this.error = undefined;
    this.rows = [];
  }

  setError(err) { this.error = err }

  setRows(rows) { if(Array.isArray(row))this.rows = rows }

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

  /**
   * Returns either empty, error or succes to represent the status of the response
   * @returns A string representing the status of the response
   */
  getStatus() {
    if(this.error) return 'ERROR';
    if(this.rows.length <= 0) return 'EMPTY';
    return 'SUCCESS';
  }
}