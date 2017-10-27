DROP TABLE IF EXISTS users;
CREATE TABLE users(
	userID INTEGER PRIMARY KEY,
	passcode INTEGER NOT NULL,
	firstName TEXT NOT NULL,
	gender TEXT NOT NULL
);

DROP TABLE IF EXISTS diaryEntries;
CREATE TABLE diaryEntries (
	entryID INTEGER,
	userID INTEGER NOT NULL REFERENCES users(userID),
	title TEXT CHECK (title is not null and length(title) > 0),
	subtitle TEXT,
	content TEXT CHECK (content is not null and length(content) > 0),
	dateCreated TEXT NOT NULL,
	dateLastEdited TEXT NOT NULL,
	PRIMARY KEY(entryID, userID)
);

DROP TABLE IF EXISTS wellnessTrackerEntries;
CREATE TABLE wellnessTrackerEntries (
	entryID INTEGER,
	userID INTEGER REFERENCES users(userID),
	moodScore INTEGER NOT NULL,
	sleepScore INTEGER NOT NULL,
	stressScore INTEGER NOT NULL,
	dietScore INTEGER NOT NULL,
	entryNote TEXT,
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
