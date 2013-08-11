import csv
import json
import sys
import os.path

if __name__ == "__main__":
    if len(sys.argv) !=2:
        print "Usage: python csvtojson.py filename"
        sys.exit(0)
    filename = sys.argv[1]
    name = os.path.splitext(os.path.basename(filename))[0]+'json'
    with open(filename,'r') as f:
        reader = csv.DictReader(f)
        with open(name,'w') as fw:
            json.dump([row for row in reader],fw)




