package main

import (
	"embed"
	"github.com/mixedmachine/Snowball/backend/debt"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
)

//go:embed frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()
	snowball := debt.NewDebt()

	// Create application with options
	err := wails.Run(&options.App{
		Title:            "debt-snowball",
		Height:           800,
		MinHeight:        750,
		Width:            1200,
		MinWidth:         1100,
		Assets:           assets,
		BackgroundColour: &options.RGBA{R: 0, G: 0, B: 0, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
			snowball,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
