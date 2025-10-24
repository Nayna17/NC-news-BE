# NC News Seeding

When cloning this repo you will need to set up your own .env files so that you are able to access the required databases.

How to do this:

Create a file called .env.test and one called .env.developement.

Inside .env.test write the following:

PGDATABASE=test-data

Then do the same for .env.development, but instead write:

PGDATABASE = development-data

You should now be able to connect to the databases locally!

