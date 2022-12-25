package debt

import (
	log "github.com/sirupsen/logrus"
	"sort"
	"strconv"
)

// Debt struct
type Debt struct {
	debtItems []DebtItem
	storage   DebtStore
}

// NewDebt
func NewDebt() *Debt {
	storage := DebtStore{
		Name: "debt",
		Type: "json",
	}
	return &Debt{
		debtItems: Load(storage),
		storage:   storage,
	}
}

// SubmitDebtItem
func (d *Debt) SubmitDebtItem(name, debtType, link, total, monthly, due, interest string) {
	if name == "" {
		log.Error("Debt item must have a name")
		return
	}
	if d.findDebtItem(name) {
		d.UpdateDebtItem(name, debtType, link, total, monthly, due, interest)
		return
	}
	d.debtItems = append(d.debtItems,
		*NewDebtItem(
			name,
			debtType,
			link,
			total,
			monthly,
			due,
			interest,
		),
	)
	Save(d.storage, d.debtItems)
}

// GetDebt
func (d *Debt) GetDebt() []DebtItem {
	//d.debtItems = store.Load(d.storage)
	d.sortDebt()
	return d.debtItems
}

// GetTotalDebtAmount
func (d *Debt) GetTotalDebtAmount() float64 {
	total := float64(0)
	for _, debtItem := range d.debtItems {
		itemTotal, err := strconv.ParseFloat(debtItem.Total, 64)
		if err != nil {
			continue
		}
		total += itemTotal
	}
	return total
}

// GetTotalMonthlyDebtAmount
func (d *Debt) GetTotalMonthlyDebtAmount() float64 {
	total := float64(0)
	for _, debtItem := range d.debtItems {
		itemTotal, err := strconv.ParseFloat(debtItem.Monthly, 64)
		if err != nil {
			continue
		}
		total += itemTotal
	}
	return total
}

// UpdateDebtItem
func (d *Debt) UpdateDebtItem(name, debtType, link, total, monthly, due, interest string) {
	log.Debug("Updating %s...\n", name)
	for idx, debtItem := range d.debtItems {
		if debtItem.Name == name {
			d.debtItems[idx] = *NewDebtItem(
				name,
				debtType,
				link,
				total,
				monthly,
				due,
				interest,
			)
		}
	}
	Save(d.storage, d.debtItems)
}

// DeleteDebtItem
func (d *Debt) DeleteDebtItem(name string) {
	log.Debug("Deleting %s...", name)
	for idx, debtItem := range d.debtItems {
		if debtItem.Name == name {
			d.debtItems = append(d.debtItems[:idx], d.debtItems[idx+1:]...)
		}
	}
	Save(d.storage, d.debtItems)
}

// findDebtItem
func (d *Debt) findDebtItem(name string) bool {
	found := false
	for _, debtItem := range d.debtItems {
		if debtItem.Name == name {
			found = true
		}
	}
	return found
}

// sortDebt
func (d *Debt) sortDebt() {
	sort.Slice(d.debtItems, func(i, j int) bool {
		a, _ := strconv.ParseFloat(d.debtItems[i].Total, 64)
		b, _ := strconv.ParseFloat(d.debtItems[j].Total, 64)
		return a < b
	})
}
