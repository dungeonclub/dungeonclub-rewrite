# Dungeon Club 2.0

This branch contains a completely separate commit history from the master branch.

A rewrite from scratch is currently in development (let's call it more of an experiment for now).
It's based on a different programming language and a different framework, so basically none of the existing git history is relevant to the rewrite.

The original Dungeon Club branch can currently be found at [doodlezucc/dungeonclub:master](https://github.com/doodlezucc/dungeonclub/tree/master).

## Development

To start the local environment, copy the `.env.example` to `.env`, replace any appropriate values run the following commands:

Emails are logged to files in the logs directory by default. To send emails configure the Gmail environment variables in the `.env` file.

```bash
npm install
npm run hardsync
npm run dev
```
