#!/usr/bin/python3

import json
import pprint
import opcon.database as db


sql="""SELECT schedule.skdname, jobname, depjobname, external_schedule.skdname, deptype
	FROM jdepjob
	JOIN sname schedule on jdepjob.skdid = schedule.skdid
	JOIN sname external_schedule on jdepjob.DEPSKDID = external_schedule.skdid
	WHERE schedule.skdname = '11-MVB'"""
 
dbh = db.connect("opconxps_prod")
dbhc = dbh.cursor()

try:
    dbhc.execute(sql)
except Exception:
    dbh.close()

            
sql_data = []
skip=False

for line in dbhc.fetchall():
  jobname = line[1]
  dep = line[2]
    
  for data in sql_data:
    if data['name'] == jobname:
      if dep not in data['dependencies']:
        data['dependencies'].append(dep)
      skip=True
  
  if not skip:
    sql_data.append({
      'name': jobname,
      'dependencies': [dep]
    })
  skip = False

json_data=json.dumps(sql_data)

open('output.json', 'w').write(json_data)

