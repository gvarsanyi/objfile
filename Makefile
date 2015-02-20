
build:
	@npm install
	@echo "BUILD coffee-script"
	@rm -rf js/
	@node_modules/.bin/coffee -b -o js/ coffee/
	@echo " -- done"

test: build
	@for FILE in `find test/ | grep .coffee | grep -v /mock/`; \
	do \
		echo TEST: $$FILE; \
		node_modules/.bin/coffee $$FILE; \
	done;
	@echo " -- done"
	@rm -rf tmp/
