# BlacKat - Netrunner Card Explorer

This is an explorer tool to help you build decks for the card game Android:Netrunner. There's other tools out there such as [NetrunnerDB](https://netrunnerdb.com/) which lets you do things like saved built decks as well (and is also the source of the data powering this project). However, I found most of these other applications a bit clunky and didn't really enjoy using or browsing the cards on them. So I made `BlacKat` which is something like a digital binder and is a much more simple and visual way of exploring the cards.

## Development

### Requirements

- `nodeJS` version 18

### Setup

```bash
# development
npm install
npm run build:data # imports the data from NRDB
npm run dev # starts the front and back-end servers

# production
npm ci
npm run build # imports the data and builds the front-end bundles
```
