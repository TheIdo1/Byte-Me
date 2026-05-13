import socket
import sys

def main():
    if len(sys.argv) != 3:
        # print("Usage: python main.py <IP> <PORT>")
        return

    ip = sys.argv[1]

    # try cast port to an integer
    try:
        port = int(sys.argv[2])
    except ValueError:
        # contract said do not print errors GOD KNOWS WHY 
        # print("Error: Port must be an integer.")
        return
    
    soc = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        soc.connect((ip,port))
        
        #infinite loop of input and output through socket and cli
        while True:
            user_input = input()
            #ignore empty lines
            if not user_input.strip():
                continue

            #send messege to the server
            soc.send(bytes(user_input + "\n", 'utf-8'))
            data = soc.recv(4096)
            print(data.decode("utf-8"))
            
    except:
        return


if __name__ == "__main__":
    main()


