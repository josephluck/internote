# Installation

### Environment

This app relies on environment variables being set. Take a peek at .env.reference; fill it out and copy it to .env make sure you leave .env.reference committed verbatim, you don't want your secrets leaked all over github!

### Install postgres

```
sudo apt-get install postgresql postgresql-contrib
```

### Run postgres

```
sudo /etc/init.d/postgresql restart
```

### Change postgres password

```
sudo -u postgres psql postgres
```

```
\password postgres
```

Enter the password you created in your .env file

### Create the database

```
sudo -u postgres createdb internote
```
