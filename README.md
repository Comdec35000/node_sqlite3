# Node SQLite3

### Summary
- [Node SQLite3](#node-sqlite3)
    - [Summary](#summary)
  - [Introduction](#introduction)
  - [Requirement](#requirement)
  - [QuickStart](#quickstart)
      - [Connecting](#connecting)
      - [Running SQL](#running-sql)
      - [Adding arguments](#adding-arguments)
      - [Running multiple queries](#running-multiple-queries)
      - [Running SQL files](#running-sql-files)
  - [Contribution and issues](#contribution-and-issues)
      - [Contributors](#contributors)

## Introduction
Node SQLite is a small NodeJS package to create simple SQLite3 bindings using the pyhton standard libray.  
It allow you to run easly SQL queries and mutation with one single async function. Like so :

```js
const sqlite = require("node_sqlite3");

const connection = new sqlite.Connection("path/to/db/file");
const { rows } = await connection.runSql("SELECT * FROM mytable WHERE test > 1");
```

## Requirement

+ You have to install [`python3.8`](https://www.python.org/downloads/) or higher
+ You have to install [`nodejs v16.8.0`](https://nodejs.org/en/download/) or higher

## QuickStart

#### Connecting
You can connect to your databae simply by importing the package and instantiating the connection :
```js
const sqlite = require("node_sqlite3");

const connection = new sqlite.Connection("path/to/db/file");
```

#### Running SQL
Then, using this connection, you can run queries and mutations using the `runSql` function : 
```js
const { rows } = await connection.runSql("SELECT * FROM mytable WHERE test > 1");
```

This function is async and takes as parameter a `string`, witch represents your query or your mutation. It will return a Promise witch contain a `QueryResponse`.

The response can either contain an error, nothing or an `Array` of rows, witch you can access with the `rows` attribute of `QueryResponse`.

#### Adding arguments
You can aslo add argument to your query/mutation. To do so, simply add an array with these arguments, the function will automatically replace each "*?*" with the corresponding index argument : 
```js
// This is equal to run this : INSERT INTO users(name, email, phone) VALUES ("John Doe", "example@domain.com", "+33 6 12 34 56 78");
await connection.runSql(
  "INSERT INTO users(name, email, phone) VALUES (?, ?, ?);", 
  ["John Doe", "example@domain.com", "+33 6 12 34 56 78"]
);
```

#### Running multiple queries
Running the same query or mutation multiple times with differents armuments is sometimes boring, but you can use the `Connection#runMany` method to be more efficient :
```js
// This is equal to run this : INSERT INTO users(name, email, phone) VALUES ("John Doe", "example@domain.com", "+33 6 12 34 56 78");
await connection.runMany(
  "INSERT INTO users(name, id) VALUES (?, ?);", 
  [
    ["John Doe", 1],
    ["John Doe", 2],
    ["John Doe", 3]
  ]
);

console.log((await connection.runSql("SELECT * FROM users")).toString());
// .---------------.
// |   name   | id |
// |----------|----|
// | John Doe |  1 |
// | John Doe |  2 |
// | John Doe |  3 |
// '---------------'
```
The method return an array witch contain all of the `QueryResponse` of each SQL mutation/query.

#### Running SQL files
You can also run entire SQL files : 
index.js : 
```js
await connection.runSql("CREATE TABLE IF NOT EXISTS users (name VARCHAR(40), id INT);")
await connection.runFile('./test.sql');
  
console.log((await connection.runSql("SELECT * FROM users")).toString());
```

test.sql :
```sql
INSERT INTO users(name, id) VALUES ("John Doe", 3);

INSERT INTO users(name, id) VALUES ("John Doe", 4);

INSERT INTO users(name, id) VALUES (
  "John Doe", 5
);
```

This will print 
```
.---------------.
|   name   | id |
|----------|----|
| John Doe |  3 |
| John Doe |  4 |
| John Doe |  5 |
'---------------'
```

The method takes as argument the file path (relative or absolute) witch represents the location of the file you want to execute and return an array witch contain all of the `QueryResponse` of each SQL mutation/query.

## Contribution and issues
If you encounter an issue or want to ask for a feature, feel free to [create an issue](https://github.com/Comdec35000/node_sqlite3/issues/new)

If you want to contribute, you can create some pull requests to fix issues, all the help is welcome !

#### Contributors 
<a href="https://github.com/comdec35000/node_sqlite3/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=comdec35000/node_sqlite3" />
</a>