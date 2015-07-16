#!/usr/bin/python
# -*- coding: utf-8 -*-

import cgi
import json
import sys

def main():
    log_handler = open('batchQuery.log','w')
    #log_handler.write(sys.stdin.read())
    #response = ''
    
    form = cgi.FieldStorage()
    fileitem = form['batchQuery']
    response = []
    for line in fileitem.file:
	log_handler.write(line)
	response.append(line.strip('\n'))
    
    print('Content-Type: text/plain\r\n')
    print(json.dumps(response))

if __name__ == "__main__":
    main()

