PYJ_GLOBALS='$$,chrome,Marka,alertify'

%.js: %.pyj
	rapydscript lint --globals $(PYJ_GLOBALS) $(PYJ_FLAGS) $<
	rapydscript $(PYJ_FLAGS) $< --output $@
	sed -e ':a;N;$$!ba;s/async;\n/async/g' -i $@


JS_FILES=src/background.js src/roll20.js src/roll20_script.js \
	src/fvtt.js src/fvtt_script.js \
	src/dndbeyond_character.js src/dndbeyond_monster.js \
	src/dndbeyond_spell.js src/dndbeyond_encounter.js src/dndbeyond_items.js  \
	src/dndbeyond_vehicle.js src/options.js  src/popup.js src/default_popup.js
PYJ_DEPS=src/utils.pyj src/settings.pyj src/dndbeyond.pyj src/dndbeyond_dice.pyj src/constants.pyj src/roll_renderer.pyj src/dndbeyond_discord.pyj

src/fvtt_script.js: PYJ_GLOBALS='$$,chrome,game,canvas,Roll,ChatMessage,ui,Hooks,Dialog,ENTITY_PERMISSIONS,CONFIG,CHAT_MESSAGE_TYPES,CONST,CONFIG,isNewerVersion'
src/utils.pyj-cached: PYJ_GLOBALS='$$,chrome,browser,cloneInto,alertify'
src/constants.pyj-cached: PYJ_FLAGS+=--noqa eol-semicolon

all:  $(PYJ_DEPS:=-cached) $(JS_FILES)

$(JS_FILES): $(PYJ_DEPS)

build: all
	rm -f *~ */*~ */*/*~ src/*.pyj-cached
	rm -rf docs/_site
	web-ext build

clean:
	rm -f $(JS_FILES) *~ */*~ src/*.pyj-cached

%.pyj-cached: %.pyj
	rapydscript lint --globals $(PYJ_GLOBALS) $(PYJ_FLAGS) $<
	@rm -f $@



.PHONY: all clean build
