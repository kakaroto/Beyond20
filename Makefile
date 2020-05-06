all: $(OUTPUT_DIR)

$(OUTPUT_DIR):
	mkdir -p $(OUTPUT_DIR)

build: all
	rm -f *~ */*~ */*/*~
	rm -rf docs/_site
	web-ext build

clean:
	rm -f *~ */*~ 
	(cd ${OUTPUT_DIR} && rm -f ${JS_FILES})

.PHONY: all clean build
