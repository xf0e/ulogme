#!/usr/bin/python
import socketserver
import http.server
import sys
import cgi
import os
import inspect

from export_events import updateevents

# Port settings
IP = "127.0.0.1"
if len(sys.argv) > 1:
  PORT = int(sys.argv[1])
else:
  PORT = 8124

# serve render/ folder, not current folder
rootdir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
os.chdir(rootdir+'/render')

# Custom handler
class CustomHandler(http.server.SimpleHTTPRequestHandler):
  def do_GET(self):
    # default behavior
    http.server.SimpleHTTPRequestHandler.do_GET(self) 

  def do_POST(self):
    form = cgi.FieldStorage(
      fp = self.rfile,
      headers = self.headers,
      environ = {'REQUEST_METHOD':'POST', 'CONTENT_TYPE':self.headers['Content-Type']})
    result = 'NOT_UNDERSTOOD'

    if self.path == '/refresh':
      # recompute jsons. We have to pop out to root from render directory
      # temporarily. It's a little ugly
      os.chdir(rootdir) # pop out
      updateevents() # defined in export_events.py
      os.chdir('render') # pop back to render directory
      result = 'OK'
      
    if self.path == '/addnote':
      # add note at specified time and refresh
      note = form.getvalue('note')
      note_time = form.getvalue('time')
      os.chdir(rootdir) # pop out
      os.system('echo %s | ./note.sh %s' % (note, note_time))
      updateevents() # defined in export_events.py
      os.chdir('render') # go back to render
      result = 'OK'

    if self.path == '/blog':
      # add note at specified time and refresh
      post = form.getvalue('post')
      if post is None: post = ''
      post_time = int(form.getvalue('time'))
      os.chdir(rootdir) # pop out
      open('logs/blog_%d.txt' % (post_time, ), 'w').write(post)
      updateevents() # defined in export_events.py
      os.chdir('render') # go back to render
      result = 'OK'
    
    self.send_response(200)
    self.send_header('Content-type','text/html')
    self.end_headers()
    self.wfile.write(result.encode('utf-8'))

httpd = socketserver.ThreadingTCPServer((IP, PORT), CustomHandler)

print('Serving ulogme, see it on http://localhost:' + repr(PORT))
httpd.serve_forever()

