import sqlite3


def sql(addr, function):
  db = sqlite3.connect(addr)
  cursor = db.cursor()

  function(cursor)

  db.commit()
  db.close()