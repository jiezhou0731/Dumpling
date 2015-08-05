#!/usr/bin/python2.7

import cgi
import json
import subprocess
import os

jarpath = '/var/www/direwolf/pythonCgi/tagParserType.jar'
tmpfile = 'tmpType.txt'
def main():
    form = cgi.FieldStorage()
    text = form.getvalue('text', '')
    typetext = form.getvalue('type', '')
    dh = open(tmpfile,'w')
    dh.write(typetext+'\n')
    dh.write(text)
    dh.close()
    os.chmod(tmpfile, 0777)
    results = subprocess.check_output(['java', '-jar', jarpath, os.getcwd()+'/'+tmpfile])
    #log_handler = open('typelog','w')
    #log_handler.write(results)
    #log_handler.close()
    print 'Content-Type: text/plain\r\n'
    print results

if __name__ == '__main__':
    main()

