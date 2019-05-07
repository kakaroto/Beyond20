%.js: %.pyj
	rapydscript $< --output $@


JS_FILES=src/background.js src/roll20.js src/dndbeyond.js src/options.js  src/popup.js
PYJ_DEPS=src/utils.pyj src/settings.pyj

all: $(JS_FILES)

clean:
	rm -f $(JS_FILES) *~ */*~

$(JS_FILES): $(PYJ_DEPS)


