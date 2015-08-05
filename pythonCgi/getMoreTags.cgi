#!/usr/bin/python

import cgi
import json
import subprocess
import os
import codecs

jarpath = '/var/www/direwolf/javaApi/AllTagJsonGenerator.jar'
tmpfile = 'tmp.txt'
#resultpath = '/var/www/direwolf/javaApi/'
def main():
    form = cgi.FieldStorage()
    text = form.getvalue('text', '')
    dh = open(tmpfile,'w')
    dh.write(text)
    dh.close()
    os.chmod(tmpfile, 0777)
    result_code = subprocess.call(['java', '-jar', jarpath, os.getcwd()+'/'+tmpfile])
    fh = open('tagResult.txt','r')
    results = fh.read()
    fh.close()
    #log_handler = open('findmore_log.txt','w')
    #log_handler = codecs.open('findmore_log.txt','w','utf-8')
    #log_handler.write(results)
    #log_handler.close()
    print 'Content-Type: text/plain\r\n'
    print results

if __name__ == '__main__':
    main()

