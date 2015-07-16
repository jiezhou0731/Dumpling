#!/usr/bin/python
# -*- coding: utf-8 -*-

import cgi
import sqlite3
import json
import operator

truth_data_path = './truth_manually_illicit_goods.db'

def main():
    con = sqlite3.connect(truth_data_path)
    cur = con.cursor()
    form = cgi.FieldStorage()
    
    data = form.getvalue('data')
    docid_list = json.loads(data)
    #if len(docid_list) == 0:
    #docid_list = ['com_blackhatworld_www_6c1cb1c7567abc7489209ef790ddcb9ec78c86dd_1426879415153']
    #docid_list = ['com_blackhatworld_www_111764864a3dd930079df7b484448f8ccfbd41bd_1427080924223']
    # store the received docno list to docid_list 
    if len(docid_list['docno']) == 0:
	print('Content-Type: text/plain\r\n')
        print(json.dumps('{}'))
	return
    for index, docid in enumerate(docid_list['docno']):
	cur.execute('SELECT subtopic_id, topic_id FROM passage WHERE docno=?',[docid]) 
	results = cur.fetchall()
	if index == 2: break
    #log_handler = open('log.txt','w')
    topic_map = {}
    for result in results:
	topic_map[result[1]] = topic_map.get(result[1], 0) + 1
    #log_handler.write(json.dumps(results))

    topic_id = max(topic_map.iteritems(), key=operator.itemgetter(1))[0]
    
    subtopic_map = {}
    for result in results:
	if result[1] == topic_id:
	    subtopic_map[result[0]] = []
    
    cur.execute('SELECT topic_name FROM topic WHERE topic_id=?', [topic_id])
    topic_name = cur.fetchone()[0]

    subtopics = []
    for subtopic_id in subtopic_map:
        cur.execute('SELECT subtopic_name FROM subtopic WHERE subtopic_id=?', [subtopic_id])
        subtopics.append({"text": cur.fetchone()[0], "subtopic_id": subtopic_id})
	'''
	for docid in docid_list['docno']:
	    cur.execute('SELECT * FROM passage WHERE subtopic_id=? AND docno=?',[subtopic_id, docno])
	    flag = cur.fetchone()
	    if flag:
		pass
	    else:
		pass
	'''
                
    response = {"topics": [{"text": topic_name, "topic_id": topic_id, "subtopics": subtopics}]}

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
