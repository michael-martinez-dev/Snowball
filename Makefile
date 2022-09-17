APP_NAME=debt-snowball
APP_VERSION=v0.4.1


.PHONEY: run dev prod clean
build:
	wails build

run: build
	./build/bin/${APP_NAME}.exe

dev:
	wails dev

prod:
	wails build -platform windows -o ${APP_NAME}-${APP_VERSION}.exe -upx -race -nsis

clean:
	rm -f ./build/bin/${APP_NAME}-${APP_VERSION}*
