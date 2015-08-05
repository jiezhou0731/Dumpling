#!/usr/bin/python2.7

import cgi, subprocess, json

textParseHandler = '/var/www/direwolf/javaApi/nlp-nounpair.jar' 

def main():
    form = cgi.FieldStorage()
    text = form.getvalue('text', '')
    parse_result = subprocess.check_output(['java','-jar',textParseHandler, text])
    result_lines = parse_result.splitlines()
    dump_jdata = []
    for result in result_lines[1:]:
	dump_jdata.append([item.strip() for item in result.split(',')])
    print 'Content-Type: text/plain\r\n'
    print json.dumps(dump_jdata)

if __name__ == "__main__":
    main()
