%.js: %.pyj
	rapydscript $< --output $@

JS_FILES=src/background.js src/roll20.js src/roll20_script.js \
	src/dndbeyond_character.js src/dndbeyond_monster.js src/dndbeyond_spell.js \
	src/options.js  src/popup.js 
PYJ_DEPS=src/utils.pyj src/settings.pyj src/dndbeyond.pyj

all: $(JS_FILES)

build: all
	rm -f *~ */*~ src/*.pyj-cached
	web-ext build

clean:
	rm -f $(JS_FILES) *~ */*~ src/*.pyj-cached

$(JS_FILES): $(PYJ_DEPS)


