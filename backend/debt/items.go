package debt

// DebtItem struct
type DebtItem struct {
	Name     string `json:"name"`
	DebtType string `json:"type"`
	Total    string `json:"total"`
	Monthly  string `json:"monthly"`
	Due      string `json:"due"`
}

// NewDebtItem
func NewDebtItem(name, debtType, total, monthly, due string) *DebtItem {
	return &DebtItem{
		Name:     name,
		DebtType: debtType,
		Total:    total,
		Monthly:  monthly,
		Due:      due,
	}
}
