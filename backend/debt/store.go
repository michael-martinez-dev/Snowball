package debt

import (
	"encoding/json"
	log "github.com/sirupsen/logrus"
	"os"
)

type DebtStore struct {
	Name string
	Type string
}

func Load(ds DebtStore) []DebtItem {
	DataFile := ds.Name + "." + ds.Type
	home, _ := os.UserHomeDir()
	if _, err := os.Stat(home + "/" + DataFile); err == nil {
		log.Infoln("File exists")
		file, err := os.ReadFile(home + "/" + DataFile)
		if err != nil {
			return nil
		}
		debts := make([]DebtItem, 0)
		err = json.Unmarshal(file, &debts)
		if err != nil {
			log.Error(err)
		}
		return debts

	} else {
		log.Warnln("File does not exist")
		debts := make([]DebtItem, 0)
		Save(ds, debts)
		log.Infof("%s created\n", DataFile)
		return debts
	}
}

func Save(ds DebtStore, debt []DebtItem) {
	DataFile := ds.Name + "." + ds.Type
	home, err := os.UserHomeDir()
	if err != nil {
		log.Error(err)
	}
	file, err := json.MarshalIndent(debt, "", "    ")
	if err != nil {
		log.Error(err)
	}
	err = os.WriteFile(home+"/"+DataFile, file, 0644)
	if err != nil {
		log.Error(err)
	}
}
