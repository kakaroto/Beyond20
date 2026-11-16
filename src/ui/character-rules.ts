import type { CharacterInfo } from "./types";

/**
 * Returns the list of character_settings keys that apply to the given character,
 * matching all class, subclass, racial-trait, and feat checks from popup.js.
 */
export function getVisibleCharacterKeys(
  character: CharacterInfo,
  availableKeys: Record<string, unknown>
): string[] {
  const keys: string[] = ["versatile-choice", "toll-choice"];
  const traits = character["racial-traits"] || [];
  const features = character["class-features"] || [];
  const classes = Object.keys(character.classes || {});
  const feats = character.feats || [];

  if (traits.includes("Lucky") || traits.includes("Luck")) keys.push("halfling-lucky");
  if (features.includes("Brutal Critical") || traits.includes("Savage Attacks")) keys.push("brutal-critical");
  if (features.includes("Brutal Strike")) keys.push("brutal-strike");
  if (classes.includes("Rogue")) keys.push("rogue-sneak-attack");
  if (classes.includes("Rogue") && features.includes("Sneak Attack 2024") && features.includes("Cunning Strike")) {
    keys.push("rogue-cunning-strike");
  }
  if (features.includes("Jack of All Trades")) keys.push("bard-joat");
  if (features.includes("Remarkable Athlete")) keys.push("champion-remarkable-athlete");
  if (features.includes("Favored Foe")) keys.push("ranger-favored-foe");
  if (feats.includes("Sharpshooter")) keys.push("sharpshooter");
  if (feats.includes("Great Weapon Master")) keys.push("great-weapon-master");
  if (feats.includes("Great Weapon Master 2024")) keys.push("great-weapon-master-2024");
  if (feats.includes("Healer 2024")) keys.push("healer-rerolls-feat-2024");
  if (features.includes("Rage")) keys.push("barbarian-rage");
  if (features.includes("Reckless Attack")) keys.push("barbarian-reckless");
  if (features.includes("Divine Fury")) keys.push("barbarian-divine-fury");
  if (features.includes("Crimson Rite")) keys.push("bloodhunter-crimson-rite");
  if (features.includes("Dread Ambusher") || features.includes("Dread Ambusher 2024")) {
    keys.push("ranger-dread-ambusher");
  }
  if (features.includes("Planar Warrior")) keys.push("ranger-planar-warrior");
  if (features.includes("Hunter’s Prey: Colossus Slayer")) keys.push("ranger-colossus-slayer");
  if (features.includes("Slayer’s Prey")) keys.push("ranger-slayers-prey");
  if (features.includes("Gathered Swarm")) keys.push("ranger-gathered-swarm");
  if (features.includes("Improved Divine Smite")) keys.push("paladin-improved-divine-smite");
  if (features.includes("Radiant Strikes")) keys.push("paladin-radiant-strikes");
  if (features.includes("Hexblade’s Curse")) keys.push("warlock-hexblade-curse");
  if (features.includes("Assassinate")) keys.push("rogue-assassinate");
  if (features.includes("Assassinate 2024")) keys.push("rogue-assassinate-2024");
  if (features.includes("Giant’s Might")) keys.push("fighter-giant-might");
  if (features.includes("Arcane Firearm")) keys.push("artificer-arcane-firearm");
  if (features.includes("Divine Strike")) keys.push("cleric-divine-strike");
  if (features.includes("Psychic Blades") && classes.includes("Bard")) keys.push("bard-psychic-blades");
  if (traits.includes("Radiant Soul")) keys.push("protector-aasimar-radiant-soul");
  if (traits.includes("Celestial Revelation: Radiant Soul")) keys.push("motm-aasimar-radiant-soul");
  if (traits.includes("Surprise Attack")) keys.push("motm-bugbear-surprise-attack");
  if (features.includes("Bladesong")) keys.push("wizard-bladesong");
  if (features.includes("Bladesong 2024")) keys.push("wizard-bladesong-2024");
  if (features.includes("Dreadful Strikes")) keys.push("fey-wanderer-dreadful-strikes");
  if (features.includes("Alchemical Savant")) keys.push("artificer-alchemical-savant");
  if (features.includes("Invincible Conqueror")) keys.push("paladin-invincible-conqueror");
  if (features.includes("Enhanced Bond")) keys.push("wildfire-spirit-enhanced-bond");
  if (features.includes("Channel Divinity: Channel Divinity: Sacred Weapon") || features.includes("Sacred Weapon")) {
    keys.push("paladin-sacred-weapon");
  }
  if (features.includes("Blessed Strikes 2024: Divine Strike")) keys.push("cleric-blessed-strikes");
  if (features.includes("Blessed Strikes")) keys.push("cleric-blessed-strikes-tasha");
  if (features.includes("Trance of Order")) keys.push("sorcerer-trance-of-order");
  if (features.includes("Symbiotic Entity")) keys.push("druid-symbiotic-entity");
  if (features.includes("Eldritch Invocations: Lifedrinker")) keys.push("eldritch-invocation-lifedrinker");
  if (features.includes("Arcane Jolt")) keys.push("artificer-arcane-jolt");
  if (feats.includes("Charger") || feats.includes("Charger 2024")) keys.push("charger-feat");
  if (features.includes("Genie’s Vessel")) keys.push("genies-vessel");
  if (features.includes("Empowered Evocation")) keys.push("empowered-evocation");
  if (features.includes("Natural Explorer")) keys.push("ranger-natural-explorer");
  if (features.includes("Spiritual Focus")) keys.push("bard-spiritual-focus");
  if (features.includes("Durable Magic")) keys.push("wizard-durable-magic");
  if (features.includes("Grave Touched")) keys.push("warlock-grave-touched");
  if (features.includes("Radiant Soul")) keys.push("warlock-the-celestial-radiant-soul");
  if (features.includes("Diamond Soul")) keys.push("monk-diamond-soul");
  if (features.includes("Circle of Mortality")) keys.push("cleric-circle-of-mortality");
  if (features.includes("Lunar Form: Wild Shape: Improved Lunar Radiance")) {
    keys.push("druid-improved-lunar-radiance");
  }
  if (features.includes("Druid Subclass: Circle of Mutation") && features.includes("Circle Forms")) {
    keys.push("druid-circle-of-mutation-circle-forms");
  }

  return keys.filter((k) => k in availableKeys);
}
