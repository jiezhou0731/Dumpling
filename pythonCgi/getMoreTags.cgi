#!/usr/bin/python

import cgi
import json
import subprocess
import os
import codecs

jarpath = '/var/www/direwolf/javaApi/tagParser.jar'
tmpfile = 'tmp.txt'
def main():
    form = cgi.FieldStorage()
    text = form.getvalue('text', '')
    dh = open(tmpfile,'w')
    dh.write(text)
    dh.close()
    os.chmod(tmpfile, 0777)
    results = subprocess.check_output(['java', '-jar', jarpath, os.getcwd()+'/'+tmpfile])
    #log_handler = open('findmore_log.txt','w')
    #log_handler = codecs.open('findmore_log.txt','w','utf-8')
    #log_handler.write(results)
    #log_handler.close()
    print 'Content-Type: text/plain\r\n'
    print results

if __name__ == '__main__':
    main()

