PYJ_GLOBALS='$$,chrome,Marka,alertify'
OUTPUT_DIR=dist
SOURCE_DIR=pyj
VPATH = $(SOURCE_DIR)

%.js: %.pyj
	rapydscript lint --globals $(PYJ_GLOBALS) $(PYJ_FLAGS) $<
	rapydscript $(PYJ_FLAGS) $< --output $(OUTPUT_DIR)/$@
	sed -e ':a;N;$$!ba;s/async;\n/async/g' -i $(OUTPUT_DIR)/$@


JS_FILES=dndbeyond_character.js
PYJ_DEPS=utils.pyj settings.pyj dndbeyond.pyj dndbeyond_dice.pyj constants.pyj roll_renderer.pyj dndbeyond_discord.pyj

fvtt_script.js: PYJ_GLOBALS='$$,chrome,game,canvas,Roll,ChatMessage,ui,Hooks,Dialog,ImagePopout,ENTITY_PERMISSIONS,CONFIG,CHAT_MESSAGE_TYPES,CONST,CONFIG,isNewerVersion'
utils.pyj-cached: PYJ_GLOBALS='$$,chrome,browser,cloneInto,alertify'
constants.pyj-cached: PYJ_FLAGS+=--noqa eol-semicolon

all: $(PYJ_DEPS:=-cached) $(JS_FILES)

$(JS_FILES): $(PYJ_DEPS) $(OUTPUT_DIR)

$(OUTPUT_DIR):
	mkdir -p $(OUTPUT_DIR)


build: all
	rm -f *~ */*~ */*/*~ *.pyj-cached
	rm -rf docs/_site
	web-ext build

clean:
	rm -f *~ */*~ *.pyj-cached
	(cd ${OUTPUT_DIR} && rm -f ${JS_FILES})

%.pyj-cached: %.pyj
	rapydscript lint --globals $(PYJ_GLOBALS) $(PYJ_FLAGS) $<
	@rm -f $@



.PHONY: all clean build
