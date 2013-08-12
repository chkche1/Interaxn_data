import json
import sys
import os.path

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print "Usage: python selector.py filename item1 item2 ..."

    filename = sys.argv[1]
    name = os.path.splitext(os.path.basename(filename))[0]
    fields, filtered_json = sys.argv[2:], []
    with open(filename, 'r') as f:
        raw_data = json.load(f)
        for d in raw_data:
            filtered_json.append({x:d[x] for x in fields})

    with open(name+'_temp.json', 'w+') as fw:
        json.dump(filtered_json, fw)

