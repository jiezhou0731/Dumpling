#!/usr/bin/python
jarpath = '/var/www/direwolf/javaApi/tagParser.jar'
tmpfile = 'tmp.txt'
import subprocess
import os
results = subprocess.check_output(['java', '-jar', jarpath, os.getcwd()+'/'+tmpfile])
log_handler = open('findmore_log.txt','w')
log_handler.write(results)
log_handler.close()
