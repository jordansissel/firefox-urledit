all:
	sh build.sh
	scp urledit.xpi 192.168.0.5:.mozilla/firefox/*.default/extensions
	ssh 192.168.0.5 'cd .mozilla/firefox/*.default/extensions/; mkdir urledit@semicomplete.com; cd urledit@semicomplete.com; echo "A" | unzip ../urledit.xpi; rm ../urledit.xpi'

run-updater:
	while true; do \
		ls -lR | grep -v 'urledit.xpi' > /tmp/diff1; \
		touch /tmp/diff2; \
		diff /tmp/diff1 /tmp/diff2 || make all; \
		cp /tmp/diff1 /tmp/diff2; \
		sleep 1; \
	done
