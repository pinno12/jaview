import os
import subprocess
import datetime
import sys

def generate_screenshot(idx, uid):
	# Process youtube link only.
	try:
		#uid = url.split('/')[-1]
		video_fn = 'v-' + uid + '.mp4'
		# 1. Download youtube video and save it to disk
		download_cmd = "youtube-dl -f 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4' %s --output '%s'" % (url, video_fn.split('.')[0])
		subprocess.call(download_cmd, shell=True)
		# 2. Get duration to determine total number of snapshots.
		duration_cmd = "ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 '%s'" % video_fn
		duration = int(subprocess.check_output(duration_cmd, shell=True).split('.')[0])
		cur_duration = 0
		cnt = 0
		# 3. Generate snapshot at intervals of 30 secs
		take_sc_cmd = 'ffmpeg -y -ss %s -i %s -vframes 1 -q:v 2 "thumb-%s-%s-%s.jpg"'
		while cur_duration < duration:
			delta = str(datetime.timedelta(seconds=cur_duration))
			cmd = take_sc_cmd % (delta, video_fn, uid, str(cnt), delta[2:].replace(':', ''))
			subprocess.call(cmd, shell=True)
			cnt += 1
			cur_duration += 30

		os.remove(video_fn)
	except Exception:
		pass
		
def parseVideoId(url):
	if 'youtu.be' in url:
		return url.split('/')[-1]
	elif 'youtube.com' in url:
		return url.split('youtube.com/watch?v=')[1].split('&')[0]
	else :
		print('not youtube url')
		return None


if sys.argv[1] =='-f':
	file_name = sys.argv[2] # file name including file path
	with open(file_name, 'r') as f:
		lines = f.readlines()
		for idx, line in enumerate(lines):
			video_id = parseVideoId(line[:-1])
			generate_screenshot(idx, video_id)

elif sys.argv[1] =='-vi':
	url = sys.argv[2]
	video_id = parseVideoId(url)
	generate_screenshot(0, video_id)

