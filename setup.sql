CREATE TABLE Bedrift(
  BedriftID INT NOT NULL AUTO_INCREMENT,
  Navn TEXT NOT NULL,
  Logo TEXT,
  LokaltBilde BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (BedriftID)
);

CREATE TABLE Arrangement(
  ArrangementID INT NOT NULL AUTO_INCREMENT,
  Dato DATE NOT NULL,
  AntallPlasser INT NOT NULL,
  Beskrivelse TEXT,
  Link TEXT,
  PaameldingsStart DATETIME NOT NULL,
  PRIMARY KEY (ArrangementID)
);

CREATE TABLE Bilde(
  BildeID INT NOT NULL AUTO_INCREMENT,
  Link TEXT,
  ArrangementID INT NOT NULL,
  FOREIGN KEY (ArrangementID) REFERENCES Arrangement(ArrangementID),
  PRIMARY KEY (BildeID)
);

CREATE TABLE Sponsor(
  BedriftID INT NOT NULL,
  ArrangementID INT NOT NULL,
  SponsorType INT NOT NULL,
  FOREIGN KEY (BedriftID) REFERENCES Bedrift(BedriftID) ON DELETE CASCADE,
  FOREIGN KEY (ArrangementID) REFERENCES Arrangement(ArrangementID) ON DELETE CASCADE,
  PRIMARY KEY (BedriftID, ArrangementID)
);

CREATE TABLE Rom(
  RomID INT NOT NULL AUTO_INCREMENT,
  Navn TEXT NOT NULL,
  Bygning TEXT,
  MazemapURL TEXT NOT NULL,
  PRIMARY KEY (RomID)
);

CREATE TABLE ProgramHendelse(
  HendelsesID INT NOT NULL AUTO_INCREMENT,
  ArrangementID INT NOT NULL,
  Bedrift INT,
  Navn TEXT NOT NULL,
  Beskrivelse TEXT NOT NULL,
  Klokkeslett TIME,
  Varighet INT NOT NULL DEFAULT 1,
  RomID INT,
  Parallell INT NOT NULL,
  AlleParalleller BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (ArrangementID) REFERENCES Arrangement(ArrangementID),
  FOREIGN KEY (Bedrift, ArrangementID) REFERENCES Sponsor(BedriftID, ArrangementID),
  FOREIGN KEY (RomID) REFERENCES Rom(RomID),
  PRIMARY KEY (HendelsesID)
);

CREATE TABLE Paameldt(
  PaameldingsHash CHAR(32) NOT NULL,
  Epost TEXT NOT NULL,
  Navn TEXT NOT NULL,
  Linjeforening TEXT NOT NULL,
  Alder INT NOT NULL,
  StudieAar INT NOT NULL,
  Allergier TEXT,
  ArrangementID INT NOT NULL,
  Verifisert BOOLEAN DEFAULT FALSE,
  PaameldingsTidspunkt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ArrangementID) REFERENCES Arrangement(ArrangementID),
  PRIMARY KEY (PaameldingsHash)
);

CREATE TABLE ExternalParticipant(
  UUID CHAR(64) NOT NULL,
  Navn TEXT NOT NULL,
  PRIMARY KEY (UUID)
);

CREATE TABLE CardParticipantMapping(
  CardID CHAR(32) NOT NULL,
  ParticipantName TEXT NOT NULL,
  PRIMARY KEY (CardID)
);

CREATE TABLE ParticipantEventMapping(
  UUID CHAR(64) NOT NULL,
  ParticipantName TEXT NOT NULL,
  parallelNo INT NOT NULL,
  ScanTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (UUID)
);

CREATE TABLE BlipBlopTokens(
  Token CHAR(64) NOT NULL,
  parallel INT NOT NULL,
  PRIMARY KEY (Token)
);