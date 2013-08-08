import json
import sys
import os.path
from pprint import pprint

if __name__ == "__main__":
    if len(sys.argv) !=2:
        print "Usage: python process_json.py filename"
    filename = sys.argv[1]
    name = os.path.splitext(os.path.basename(filename))[0]
    e_data, m_data, o_data, s_data, n_data = [],[],[],[],[]
    with open(filename, 'r') as f:
        raw_data = json.load(f)
        for day in raw_data:
            d = day['DATE']
            e_fields = {x:day[x] for x in day if 'e_' in x[:2]}
            m_fields = {x:day[x] for x in day if 'm_' in x[:2]}
            o_fields = {x:day[x] for x in day if 'o_' in x[:2]}
            s_fields = {x:day[x] for x in day if 's_' in x[:2]}
            n_fields = {x:day[x] for x in day if 'n_' in x[:2]}
            e_fields['DATE'], m_fields['DATE'], o_field = d,d,d
            s_fields['DATE'], n_fields['DATE'] = d,d
            e_data.append(e_fields)
            m_data.append(m_fields)
            o_data.append(o_fields)
            s_data.append(s_fields)
            n_data.append(n_fields)
    with open(name+'_e.json', 'w+') as fw:
        json.dump(e_data, fw)
    with open(name+'_m.json', 'w+') as fw:
        json.dump(m_data, fw)
    with open(name+'_o.json', 'w+') as fw:
        json.dump(o_data, fw)
    with open(name+'_s.json', 'w+') as fw:
        json.dump(s_data, fw)
    with open(name+'_n.json', 'w+') as fw:
        json.dump(n_data, fw)
