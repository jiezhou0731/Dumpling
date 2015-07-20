#!/usr/bin/python

import cgi
import json

category = ['used', 'designed', 'equivalent']
def main():
    form = cgi.FieldStorage()
    drop_str = form.getvalue('drop_str').lower() 
    all = []
    for cat in category:
        fh = open('./category_data/'+cat,'r')
	jdata = json.loads(fh.read())
	fh.close()
	if cat in drop_str:
           format_json = {"responseHeader": {"status":0,"QTime":0,"params":{"q":"*:%s"%(cat+' for'), "indent":"true","wt":"json"}},"response":{"numFound": len(jdata), "start":0, "docs": jdata}}
	   print ('Content-Type: text/plain\r\n')
	   print json.dumps(format_json)
	   return
	all = all + jdata
    format_json = {"responseHeader": {"status":0,"QTime":0,"params":{"q":"*:*", "indent":"true","wt":"json"}},"response":{"numFound": len(jdata), "start":0, "docs": all}}
    print ('Content-Type: text/plain\r\n')
    print json.dumps(format_json)

if __name__ == "__main__":
    main()
