import csv
import json
import sys


if __name__ == "__main__":
    if len(sys.argv) !=2:
        print "Usage: python csvtojson.py filename"
        sys.exit(0)
    filename = sys.argv[1]
    name = filename[:filename.find('.')]+'.json'
    with open(filename,'r') as f:
        reader = csv.DictReader(f)
        with open(name,'w') as fw:
            json.dump([row for row in reader],fw)




