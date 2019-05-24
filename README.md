![Lesbian Rule featuring Dante from the Devil May Cry™ Series](https://i.imgur.com/s88SLeN.png)

![Unknown Pleasures featuring Dante from the Devil May Cry™ Series](https://i.imgur.com/hMlqoRE.png)

Add Dante from the Devil May Cry™ Series to your favourite thing.

On Mastodon: [@dantefy@botsin.space](https://botsin.space/@dantefy)


- `MASTODON_TOKEN`: a Mastodon user API token
- `MASTODON_SERVER`: the instance to which API calls should be made (usually
  where the bot user lives.) (default: https://mastodon.social)
- `CRON_RULE`: the interval between each post, in crontab format. (default:
  every four hours)

this bot uses the [envalid](https://github.com/af/envalid) package which in turn
wraps [dotenv](https://github.com/motdotla/dotenv), so you can alternately stick
any of the above environment variables in a file named `.env` in the project
root. (it's gitignored, so there's no risk of accidentally committing private
API tokens you put in there.)

code is written in typescript, and the dockerfile will compile to js as part of
its setup. run `yarn dev` if you're hacking on things and want to run locally
and rebuild on changes.
