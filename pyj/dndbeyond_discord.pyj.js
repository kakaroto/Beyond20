from constants import DISCORD_BOT_API_URL;

v'async';
function postToDiscord(secret, request, title, source, attributes, description, attack_rolls, roll_info, damage_rolls, total_damages, open) {
    secret = (secret || "").trim();
    if ( !secret) {
        return;

    }
    if (request['original-whisper'] != undefined) {
        request.whisper = request['original-whisper'];

    }
    body = {
        "secret": secret,
        "request": request,
        "title": title,
        "source": source,
        "attributes": attributes,
        "description": description,
        "attack_rolls": attack_rolls,
        "roll_info": roll_info,
        "damage_rolls": damage_rolls,
        "total_damages": total_damages,
        "open": open;
    }
    request = window.fetch(DISCORD_BOT_API_URL, {"method": "POST", "headers": {'Content-Type': 'application/json; charset=utf-8'}, "body": JSON.stringify(body)});
    json = {}
    try {
        v'let response = await request';
        v'json = await response.json()';
    } catch(e) {
        console.error(e);
        return e.message;
    }
    if (json.error) {
        console.error('Error from server : ', json.error);
    }
    return json.error;
