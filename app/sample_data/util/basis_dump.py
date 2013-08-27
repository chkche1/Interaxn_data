# This python script fetches Basis B1 band data
# from the Basis website and saves the data as
# JSON files.
#
# Created August 26, 2013 by Benjamin Shyong.
# hello@benshyong.com

import sys
import os.path
import urllib
import datetime
import time

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print "Usage: python basis_dump.py basisID start_date(YYYY-MM-DD) end_date"
        sys.exit(0)
    basis_id = sys.argv[1]
    start_date_string = map(int, sys.argv[2].split('-'))
    start_date = datetime.date(start_date_string[0], start_date_string[1], start_date_string[2])
    end_date_string = map(int, sys.argv[3].split("-"))
    end_date = datetime.date(end_date_string[0], end_date_string[1], end_date_string[2])


    for single_date in (start_date + datetime.timedelta(n) for n in range((end_date-start_date).days+1)):
        filename = (basis_id +
                    "_" +
                    time.strftime("%Y-%m-%d", single_date.timetuple()) +
                    ".json")
        print "fetching data for " + time.strftime("%Y-%m-%d", single_date.timetuple())
        data = urllib.urlopen("https://app.mybasis.com/api/v1/chart/" + basis_id + ".json?start_date=" + \
          "2013-08-26" + \
          "&summary=true \
          &interval=60 \
          &units=ms \
          &start_offset=0 \
          &end_offset=0 \
          &heartrate=true \
          &steps=true \
          &calories=true \
          &gsr=true \
          &skin_temp=true \
          &air_temp=true \
          &bodystates=true")
        with open(filename, 'w') as f:
            f.write(data.read())
        print "wrote to " + filename


