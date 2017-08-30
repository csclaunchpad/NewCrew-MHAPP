DROP TABLE IF EXISTS users;
CREATE TABLE users(
	userID INTEGER PRIMARY KEY,
	passcode INTEGER NOT NULL,
	firstName TEXT NOT NULL,
	gender TEXT NOT NULL
);

DROP TABLE IF EXISTS journalEntries;
CREATE TABLE journalEntries (
	entryID INTEGER,
	userID INTEGER NOT NULL REFERENCES users(userID),
	title TEXT NOT NULL,
	subtitle TEXT,
	content TEXT NOT NULL,
	dateCreated TEXT NOT NULL,
	dateLastEdited TEXT NOT NULL,
	PRIMARY KEY(entryID, userID)
);

DROP TABLE IF EXISTS wellnessTrackerEntries;
CREATE TABLE wellnessTrackerEntries (
	entryID INTEGER,
	userID INTEGER REFERENCES users(userID),
	happinessScore INTEGER NOT NULL,
	happinessNote TEXT,
	sleepScore INTEGER NOT NULL,
	sleepNote TEXT,
	dateEntered TEXT NOT NULL,
	PRIMARY KEY(entryID, userID)
);

DROP TABLE IF EXISTS miniTools;
CREATE TABLE miniTools (
	miniToolID INTEGER PRIMARY KEY
);

DROP TABLE IF EXISTS settings;
CREATE TABLE settings (
	schemeID INTEGER,
	userID INTEGER REFERENCES users(userID),
	colourSchema INTEGER NOT NULL,
	favouriteMiniToolID1 INTEGER REFERENCES miniTools(miniToolID),
	favouriteMiniToolID2 INTEGER REFERENCES miniTools(miniToolID),
	favouriteMiniToolID3 INTEGER REFERENCES miniTools(miniToolID),
	PRIMARY KEY(schemeID, userID)
);

DROP TABLE IF EXISTS tools;
CREATE TABLE tools (
	toolID INTEGER PRIMARY KEY
);

DROP TABLE IF EXISTS toolBelt;
CREATE TABLE toolBelt(
	userID INTEGER REFERENCES users(userID),
	toolID INTEGER REFERENCES tools(toolID),
	PRIMARY KEY(userID)
);
