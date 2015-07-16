#!/usr/bin/python
# -*- coding: utf-8 -*-

import cgi
import sqlite3
import json

truth_data_path = './truth_manually_illicit_goods.db'

def main():
    con = sqlite3.connect(truth_data_path)
    cur = con.cursor()
    form = cgi.FieldStorage()
    
    data = form.getvalue('data')
    subtopic_id = json.loads(data)['subtopic_id']
    
    if subtopic_id:
	cur.execute('SELECT DISTINCT docno from passage WHERE subtopic_id=? ORDER BY rating DESC', [subtopic_id])
    
    response = []
    docs = cur.fetchall()
    for index in range(len(docs)):
	cur.execute('SELECT title FROM titles WHERE docno=?', [docs[index][0]])
	title, = cur.fetchone()
	response.append({"id": docs[index][0], "title": title})

    print("Content-Type: text/plain")
    '''
    print("Access-Control-Allow-Origin: *")
    print("Access-Control-Expose-Headers: Access-Control-Allow-Origin")
    print("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept") 
    '''
    print("\r\n")
    print(json.dumps(response))	

if __name__ == '__main__':
    main()
