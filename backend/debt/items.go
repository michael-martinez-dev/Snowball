package debt

// DebtItem struct
type DebtItem struct {
	Name     string `json:"name"`
	DebtType string `json:"type"`
	Link     string `json:"link"`
	Total    string `json:"total"`
	Monthly  string `json:"monthly"`
	Due      string `json:"due"`
	Interest string `json:"interest"`
}

// NewDebtItem
func NewDebtItem(name, debtType, link, total, monthly, due, interest string) *DebtItem {
	return &DebtItem{
		Name:     name,
		DebtType: debtType,
		Link:     link,
		Total:    total,
		Monthly:  monthly,
		Due:      due,
		Interest: interest,
	}
}
