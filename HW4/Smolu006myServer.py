import socket
import sys
import os


HOST, PORT = "localhost", 9001

if len(sys.argv) > 1:
    PORT = int(sys.argv[1])
CRLF = '\r\n'
BUFSIZE = 4096
NOT_FOUND = 'HTTP/1.1 404 NOT FOUND{}Connection: close{}'.format(CRLF, CRLF)
MOVED_PERMANENTLY = 'HTTP/1.1 301 MOVED PERMANENTLY{}Location: https://twin-cities.umn.edu/{}Connection:close{}{}'.format(CRLF,CRLF,CRLF,CRLF)
OK = 'HTTP/1.1 200 OK\n'
METHOD_NOT_ALLOWED = 'HTTP/1.1 405 METHOD NOT ALLOWED{}Allow: GET, HEAD, POST {}Connection: close{}{}'.format(CRLF, CRLF, CRLF, CRLF)
FORBIDDEN = 'HTTP/1.1 403 FORBIDDEN{}Connection: close{}'.format(CRLF,CRLF)
NOT_ACCEPTABLE = 'HTTP/1.1 406 NOT_ACCEPTABLE{}Connection: close{}'.format(CRLF,CRLF)
print('Serving HTTP on port %s ...' % PORT)
print('The Web server URL for this would be http://%s:%d/' % (HOST, PORT))

def prepare_connection():
    serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    serversocket.bind((HOST, PORT))
    serversocket.listen(5)
    return serversocket

def prepare_file(fileName, response, filetype):
    file_requested = fileName.encode()
    file_handler = open(file_requested,'rb')
    response_content = file_handler.read()
    file_handler.close()
    response_header = response
    response_header += 'Content-Type: '+ str(filetype)+'\n\n'
    server_response = response_header.encode('utf-8')
    server_response += response_content
    return server_response

def getFileType(file_requested):
    if(file_requested.endswith(".png")):
        type = 'image/png'
    elif(file_requested.endswith(".html")):
        type = 'text/html'
    elif(file_requested.endswith(".mp3")):
        type = 'audio/mpeg'
    else:
        return 'not-acceptable'
    return type

serversocket = prepare_connection()

while True:
    client_connection, client_address = serversocket.accept()
    request = client_connection.recv(BUFSIZE)
    string = bytes.decode(request)
    request_method = string.split(' ')[0]

    print("Request body: %s" % string)
    file_requested = string.split(' ')
    if(len(file_requested) > 1):
        file_requested = file_requested[1]
        if(file_requested[0] == '/'):
            file_requested = file_requested[1:]
    else:
        file_requested = ''


    if(request_method == 'POST'):
        server_response = 'HTTP/1.1 200 OK\n\n'
        server_response += 'Eventname \n'
        server_response += 'starttime \n'
        server_response += 'endtime \n'
        server_response += 'location \n'
        server_response += 'day \n'
        client_connection.sendall(server_response.encode('utf-8'))

    if(file_requested == 'umntc'):
        server_response = MOVED_PERMANENTLY
        client_connection.sendall(server_response.encode('utf-8'))

    if(not os.path.exists(file_requested)):
        client_connection.sendall(prepare_file('404.html', NOT_FOUND, 'text/html'))
    elif(getFileType(file_requested) == 'not-acceptable'):
        server_response = NOT_ACCEPTABLE
        server_response = response_header.encode('utf-8')
        client_connection.send(server_response)
    else:
        if(os.stat(file_requested).st_mode == 33184):
            server_response = prepare_file('403.html', FORBIDDEN, 'text/html')
            client_connection.sendall(server_response)
            break
        if(os.path.exists(file_requested) and request_method == 'GET'): # If file exists and request method is GET
            if(getFileType(file_requested) == 'not-acceptable'):
                server_response = NOT_ACCEPTABLE.encode('utf-8')
            else:
                server_response = prepare_file(file_requested, OK, getFileType(file_requested))
            client_connection.send(server_response)
        if(request_method == 'HEAD'): # Handling HEAD requests
            server_response = 'HTTP/1.1 200 OK\n\n'
            client_connection.sendall(server_response.encode('utf-8'))
        if(request_method != 'HEAD' and request_method != 'GET' and request_method != 'OR' and request_method != 'POST'):
            server_response = METHOD_NOT_ALLOWED
            server_response += 'Method Not Allowed'
            client_connection.sendall(server_response.encode('utf-8'))
    client_connection.close()
