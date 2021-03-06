import {isAdmin} from "/imports/slack/helpers";
import bot from '/imports/slack/bot/rtm-bot';

Meteor.methods({
  saveSettings(settings, reset = true) {
    if(!isAdmin(Meteor.user())) return false;
    const teamId = Meteor.user().profile.auth.team_id;
    Teams.update({id: teamId}, {$set: {settings: settings}});
    
    if(reset) {
      if (!BotStorage[teamId]) {
        const team = Teams.findOne({id: teamId});
        const rtm = new bot(team);
        BotStorage[team.id] = rtm;
        BotStorage[team.id].start();
      } else {
        BotStorage[teamId].restart();
      }
    }
  }
});