import connect
import json
import sys


def execute(addr, sql):
  connect.sql(addr, lambda cursor: get_data(cursor, sql))

def get_data(cursor, sql):
  cursor.execute(sql)
  data = cursor.fetchall()

  cols = None
  if cursor.description: cols = list(map(lambda x: x[0], cursor.description))

  data = data_to_dict(data, cols) if cols else []
  print(json.dumps(data))

def data_to_dict(data, cols):
  temp = []

  for i in data:
    j = 0
    row = []
    for x in i:
      row.append((x, cols[j]))
      j += 1
    
    temp.append(tuple(row))

  return [dict(map(reversed, tup)) for tup in temp] 


if(__name__ == "__main__"):
  addr = sys.argv[1]
  sql = sys.argv[2]

  execute(addr, sql)

