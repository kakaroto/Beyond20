PYJ_GLOBALS='$$,chrome,Marka,alertify'
OUTPUT_DIR=output
SOURCE_DIR=src
VPATH = $(SOURCE_DIR)

%.js: %.pyj
	rapydscript lint --globals $(PYJ_GLOBALS) $(PYJ_FLAGS) $<
	rapydscript $(PYJ_FLAGS) $< --output $(OUTPUT_DIR)/$@
	sed -e ':a;N;$$!ba;s/async;\n/async/g' -i $(OUTPUT_DIR)/$@

JS_FILES=background.js roll20.js roll20_script.js \
	fvtt.js fvtt_script.js fvtt_test.js \
	dndbeyond_character.js dndbeyond_monster.js \
	dndbeyond_spell.js dndbeyond_encounter.js dndbeyond_items.js  \
	dndbeyond_vehicle.js options.js  popup.js default_popup.js \
        dndbeyond.js roll_renderer.js
PYJ_DEPS=utils.pyj settings.pyj dndbeyond.pyj dndbeyond_dice.pyj constants.pyj roll_renderer.pyj

fvtt_script.js: PYJ_GLOBALS='$$,chrome,game,canvas,Roll,ChatMessage,ui,Hooks,Dialog,ENTITY_PERMISSIONS,CONFIG,CHAT_MESSAGE_TYPES,CONST,CONFIG,isNewerVersion'
utils.pyj-cached: PYJ_GLOBALS='$$,chrome,browser,cloneInto,alertify'
constants.pyj-cached: PYJ_FLAGS+=--noqa eol-semicolon

all: lint $(JS_FILES)

$(OUTPUT_DIR):
	mkdir -p output

$(JS_FILES): $(PYJ_DEPS) $(OUTPUT_DIR)

build: all
	rm -f *~ */*~ */*/*~
	rm -rf docs/_site
	web-ext build

lint: $(PYJ_DEPS:=-cached)
	@rm -f $(SOURCE_DIR)/$@

%.pyj-cached: %.pyj
	rapydscript lint --globals $(PYJ_GLOBALS) $(PYJ_FLAGS) $<

clean:
	rm -rf $(OUTPUT_DIR) $(SOURCE_DIR)/*.pyj-cached *~ */*~

.PHONY: all lint build clean
